import { 
  collection,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  getDocs,
  getDoc,
  orderBy
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { MaintenanceSchedule, MaintenanceRecord, MaintenanceStatus } from '../types/maintenance';

class MaintenanceService {
  private schedulesCollection = collection(db, 'maintenanceSchedules');
  private recordsCollection = collection(db, 'maintenanceRecords');

  calculateStatus(schedule: MaintenanceSchedule): MaintenanceStatus {
    if (!schedule.nextDueDate) {
      return 'upcoming';
    }

    const now = new Date();
    const dueDate = schedule.nextDueDate.toDate();
    const daysDiff = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0) {
      return 'overdue';
    } else if (daysDiff <= 7) {
      return 'due-soon';
    } else {
      return 'upcoming';
    }
  }

  async createSchedule(userId: string, schedule: Partial<MaintenanceSchedule>): Promise<string> {
    console.log('Creating maintenance schedule:', { userId, schedule });
    const newSchedule = {
      ...schedule,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isActive: true
    };
    
    console.log('Final schedule data to be saved:', newSchedule);
    
    try {
      const docRef = await addDoc(this.schedulesCollection, newSchedule);
      console.log('Successfully created schedule with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }

  async getUserSchedules(userId: string): Promise<MaintenanceSchedule[]> {
    console.log('Fetching maintenance schedules for user:', userId);
    const q = query(this.schedulesCollection, 
      where('userId', '==', userId),
      where('isActive', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const schedules = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as MaintenanceSchedule));

    // Sort schedules: completed tasks at the bottom
    return schedules.sort((a, b) => {
      if (a.isCompleted === b.isCompleted) {
        // If both are completed or both are not completed, sort by due date
        return a.nextDueDate.toDate().getTime() - b.nextDueDate.toDate().getTime();
      }
      // Put completed tasks at the bottom
      return a.isCompleted ? 1 : -1;
    });
  }

  async completeSchedule(scheduleId: string, record: Partial<MaintenanceRecord>): Promise<void> {
    console.log('Completing schedule:', { scheduleId, record });
    const scheduleRef = doc(this.schedulesCollection, scheduleId);
    const scheduleSnap = await getDoc(scheduleRef);
    
    if (!scheduleSnap.exists()) {
      throw new Error('Schedule not found');
    }
    
    const schedule = { id: scheduleSnap.id, ...scheduleSnap.data() } as MaintenanceSchedule;
    console.log('Found schedule:', schedule);

    // Create maintenance record
    const recordData = {
      ...record,
      scheduleId,
      userId: schedule.userId,
      completedAt: Timestamp.now(),
      createdAt: Timestamp.now()
    };
    console.log('Creating maintenance record:', recordData);
    await addDoc(this.recordsCollection, recordData);

    // Update schedule
    if (schedule.autoReschedule) {
      console.log('Auto-rescheduling task');
      // Set next due date to noon to avoid timezone issues
      const now = new Date();
      const nextDueDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + schedule.intervalDays, 12);
      console.log('Next due date:', nextDueDate);
      
      const updateData = {
        lastCompletedDate: Timestamp.now(),
        nextDueDate: Timestamp.fromDate(nextDueDate),
        updatedAt: Timestamp.now(),
        isCompleted: true // Mark as completed even for auto-rescheduled tasks
      };
      console.log('Updating schedule with:', updateData);
      await updateDoc(scheduleRef, updateData);
    } else {
      console.log('Marking task as completed (no auto-reschedule)');
      const updateData = {
        isCompleted: true,
        lastCompletedDate: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      console.log('Updating schedule with:', updateData);
      await updateDoc(scheduleRef, updateData);
    }
  }

  async undoComplete(scheduleId: string): Promise<void> {
    const scheduleRef = doc(this.schedulesCollection, scheduleId);
    const scheduleSnap = await getDoc(scheduleRef);
    
    if (!scheduleSnap.exists()) {
      throw new Error('Schedule not found');
    }
    
    const schedule = { id: scheduleSnap.id, ...scheduleSnap.data() } as MaintenanceSchedule;
    
    await updateDoc(scheduleRef, {
      isCompleted: false,
      lastCompletedDate: null,
      updatedAt: Timestamp.now(),
      // Restore the original due date if it was auto-rescheduled
      ...(schedule.autoReschedule && schedule.initialDueDate 
        ? { nextDueDate: schedule.initialDueDate } 
        : {})
    });
  }

  async rescheduleTask(scheduleId: string, newDueDate: Date): Promise<void> {
    // Ensure the date is set to noon to avoid timezone issues
    const adjustedDate = new Date(newDueDate.getFullYear(), newDueDate.getMonth(), newDueDate.getDate(), 12);
    
    const scheduleRef = doc(this.schedulesCollection, scheduleId);
    await updateDoc(scheduleRef, {
      nextDueDate: Timestamp.fromDate(adjustedDate),
      updatedAt: Timestamp.now()
    });
  }

  async deleteSchedule(scheduleId: string): Promise<void> {
    const scheduleRef = doc(this.schedulesCollection, scheduleId);
    await updateDoc(scheduleRef, {
      isActive: false,
      updatedAt: Timestamp.now()
    });
  }
}

export const maintenanceService = new MaintenanceService(); 