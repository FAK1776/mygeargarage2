import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { BaseGear } from '../types/gear';

export class GearService {
  private gearCollection = collection(db, 'gear');

  private convertToGear(doc: DocumentData): BaseGear {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate()
    } as BaseGear;
  }

  async getUserGear(userId: string): Promise<BaseGear[]> {
    try {
      const q = query(this.gearCollection, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(this.convertToGear);
    } catch (error) {
      console.error('Error getting user gear:', error);
      throw error;
    }
  }

  async addGear(userId: string, gear: Omit<BaseGear, 'id' | 'createdAt' | 'updatedAt'>): Promise<BaseGear> {
    try {
      const now = Timestamp.now();
      
      // Sanitize the data before saving
      const sanitizedGear = {
        ...gear,
        userId,
        createdAt: now,
        updatedAt: now,
        // Ensure no undefined values
        description: gear.description || '',
        category: gear.category || '',
        subcategory: gear.subcategory || '',
        imageUrl: gear.imageUrl || '',
        // Deep clone and sanitize specs
        specs: JSON.parse(JSON.stringify(gear.specs || {}))
      };

      const docRef = await addDoc(this.gearCollection, sanitizedGear);

      return {
        ...sanitizedGear,
        id: docRef.id,
        createdAt: now.toDate(),
        updatedAt: now.toDate()
      };
    } catch (error) {
      console.error('Error adding gear:', error);
      throw error;
    }
  }

  async updateGear(userId: string, gearId: string, updates: Partial<BaseGear>): Promise<void> {
    try {
      const docRef = doc(this.gearCollection, gearId);
      // Ensure the gear belongs to the user before updating
      const q = query(this.gearCollection, where('userId', '==', userId), where('id', '==', gearId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Gear not found or unauthorized');
      }

      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Error updating gear:', error);
      throw error;
    }
  }

  async deleteGear(userId: string, gearId: string): Promise<void> {
    try {
      const docRef = doc(this.gearCollection, gearId);
      await deleteDoc(docRef);

      // Delete associated image if it exists
      try {
        const imageRef = ref(storage, `images/${userId}/${gearId}`);
        await deleteObject(imageRef);
      } catch (error) {
        // Ignore error if image doesn't exist
        console.log('No image found to delete or error deleting image:', error);
      }
    } catch (error) {
      console.error('Error deleting gear:', error);
      throw error;
    }
  }

  async uploadImage(userId: string, gearId: string, file: File): Promise<string> {
    try {
      const imageRef = ref(storage, `images/${userId}/${gearId}`);
      await uploadBytes(imageRef, file);
      const downloadUrl = await getDownloadURL(imageRef);
      
      // Update gear document with image URL
      await this.updateGear(userId, gearId, { imageUrl: downloadUrl });
      
      return downloadUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
} 