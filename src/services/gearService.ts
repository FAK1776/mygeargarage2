import { collection, doc, getDocs, query, where, updateDoc, Timestamp, DocumentData, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BaseGear } from '../types/gear';

export class GearService {
  private gearCollection = collection(db, 'gear');
  private maxImageSize = 1200; // Maximum width/height for images

  private convertToGear(doc: DocumentData): BaseGear {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      images: Array.isArray(data.images) ? data.images : []
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
      
      const sanitizedGear = {
        ...gear,
        userId,
        createdAt: now,
        updatedAt: now,
        description: gear.description || '',
        category: gear.category || '',
        subcategory: gear.subcategory || '',
        images: Array.isArray(gear.images) ? gear.images : [],
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
      const q = query(this.gearCollection, where('userId', '==', userId), where('id', '==', gearId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Gear not found or unauthorized');
      }

      const sanitizedUpdates = {
        ...updates,
        images: Array.isArray(updates.images) ? updates.images : [],
        updatedAt: Timestamp.now()
      };

      await updateDoc(docRef, sanitizedUpdates);
    } catch (error) {
      console.error('Error updating gear:', error);
      throw error;
    }
  }

  async deleteGear(userId: string, gearId: string): Promise<void> {
    try {
      const docRef = doc(this.gearCollection, gearId);
      const gearSnapshot = await getDoc(docRef);
      
      if (!gearSnapshot.exists() || gearSnapshot.data().userId !== userId) {
        throw new Error('Gear not found or unauthorized');
      }

      await deleteDoc(docRef);
      console.log('Successfully deleted gear document:', gearId);
    } catch (error) {
      console.error('Error deleting gear:', error);
      throw error;
    }
  }

  private async compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > this.maxImageSize) {
              height = Math.round((height * this.maxImageSize) / width);
              width = this.maxImageSize;
            }
          } else {
            if (height > this.maxImageSize) {
              width = Math.round((width * this.maxImageSize) / height);
              height = this.maxImageSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with compression
          const base64String = canvas.toDataURL('image/jpeg', 0.7);
          resolve(base64String);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  }

  async addImage(userId: string, gearId: string, file: File): Promise<BaseGear> {
    try {
      // Get the gear document
      const gearRef = doc(this.gearCollection, gearId);
      const gearSnapshot = await getDoc(gearRef);
      
      if (!gearSnapshot.exists() || gearSnapshot.data().userId !== userId) {
        throw new Error('Gear not found or unauthorized');
      }

      // Convert and compress the image
      const base64 = await this.compressImage(file);
      
      // Get the current gear data
      const gear = this.convertToGear(gearSnapshot);
      const images = Array.isArray(gear.images) ? [...gear.images] : [];
      
      // Add the new image
      images.push(base64);
      
      // Update the gear document
      await updateDoc(gearRef, {
        images: images,
        updatedAt: Timestamp.now()
      });
      
      // Return the updated gear object
      const updatedGearSnapshot = await getDoc(gearRef);
      return this.convertToGear(updatedGearSnapshot);
    } catch (error) {
      console.error('Error adding image:', error);
      throw error;
    }
  }

  async deleteImage(userId: string, gearId: string, index: number): Promise<BaseGear> {
    try {
      const gearRef = doc(this.gearCollection, gearId);
      const gearSnapshot = await getDoc(gearRef);
      
      if (!gearSnapshot.exists() || gearSnapshot.data().userId !== userId) {
        throw new Error('Gear not found or unauthorized');
      }

      const gear = this.convertToGear(gearSnapshot);
      const images = Array.isArray(gear.images) ? [...gear.images] : [];
      
      if (index < 0 || index >= images.length) {
        throw new Error('Invalid image index');
      }
      
      // Remove the image at the specified index
      images.splice(index, 1);
      
      // Update the gear document
      await updateDoc(gearRef, {
        images: images,
        updatedAt: Timestamp.now()
      });
      
      // Return the updated gear object
      const updatedGearSnapshot = await getDoc(gearRef);
      return this.convertToGear(updatedGearSnapshot);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
} 