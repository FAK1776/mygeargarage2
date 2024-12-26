import { collection, doc, getDocs, query, where, updateDoc, Timestamp, DocumentData, addDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BaseGear, GearStatus, GearType } from '../types/gear';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export class GearService {
  private gearCollection = collection(db, 'gear');
  private maxImageSize = 1200; // Maximum width/height for images

  private convertToGear(doc: DocumentData): BaseGear {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      type: data.type || GearType.Other, // Default to Other if type is not specified
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      images: Array.isArray(data.images) ? data.images : []
    } as BaseGear;
  }

  async getUserGear(userId: string): Promise<BaseGear[]> {
    const q = query(this.gearCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as BaseGear[];
  }

  async addGear(userId: string, gear: Omit<BaseGear, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = new Date();
    const gearWithDates = {
      ...gear,
      userId,
      type: gear.type || GearType.Other, // Default to Other if type is not specified
      createdAt: now,
      updatedAt: now,
      status: gear.status || GearStatus.Own // Default to Own if not specified
    };

    const docRef = await addDoc(this.gearCollection, gearWithDates);
    return docRef.id;
  }

  async deleteGear(userId: string, gearId: string): Promise<void> {
    const gearRef = doc(this.gearCollection, gearId);
    await deleteDoc(gearRef);
  }

  async updateGear(userId: string, gearId: string, updates: Partial<BaseGear>): Promise<void> {
    const gearRef = doc(this.gearCollection, gearId);
    await updateDoc(gearRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async getUserWishlist(userId: string): Promise<BaseGear[]> {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const snapshot = await getDocs(wishlistRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BaseGear));
  }

  async addToWishlist(userId: string, gear: Omit<BaseGear, 'id'>): Promise<BaseGear> {
    const wishlistRef = collection(db, 'users', userId, 'wishlist');
    const docRef = await addDoc(wishlistRef, {
      ...gear,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { ...gear, id: docRef.id } as BaseGear;
  }

  async deleteWishlistItem(userId: string, gearId: string): Promise<void> {
    const wishlistRef = doc(db, 'users', userId, 'wishlist', gearId);
    await deleteDoc(wishlistRef);
  }

  async updateWishlistItem(userId: string, gearId: string, updates: Partial<BaseGear>): Promise<void> {
    const wishlistRef = doc(db, 'users', userId, 'wishlist', gearId);
    await updateDoc(wishlistRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  async addImage(userId: string, gearId: string, file: File): Promise<BaseGear> {
    // Create a unique filename with sanitized characters
    const timestamp = Date.now();
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const filename = `${timestamp}_${sanitizedFilename}`;
    
    try {
      // First, get a download URL for the file
      const storageRef = ref(storage, `users/${userId}/gear/${gearId}/${filename}`);
      
      // Upload the file directly
      await uploadBytes(storageRef, file, {
        contentType: file.type,
      });
      
      // Get the download URL after upload
      const url = await getDownloadURL(storageRef);
      
      // Get the current gear item
      const gearRef = doc(this.gearCollection, gearId);
      const gearDoc = await getDoc(gearRef);
      
      if (!gearDoc.exists()) {
        throw new Error('Gear not found');
      }
      
      const currentGear = this.convertToGear(gearDoc);
      
      // Update with new image
      const images = currentGear.images || [];
      images.push(url);
      
      await updateDoc(gearRef, { 
        images,
        updatedAt: new Date()
      });
      
      return { ...currentGear, images } as BaseGear;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image. Please try again.');
    }
  }

  async deleteImage(userId: string, gearId: string, imageIndex: number): Promise<BaseGear> {
    // Get the current gear item
    const gearRef = doc(this.gearCollection, gearId);
    const gearDoc = await getDoc(gearRef);
    
    if (!gearDoc.exists()) {
      throw new Error('Gear not found');
    }
    
    const currentGear = this.convertToGear(gearDoc);
    
    if (!currentGear.images || !currentGear.images[imageIndex]) {
      throw new Error('Image not found');
    }

    // Delete the image from storage
    const imageUrl = currentGear.images[imageIndex];
    const imageRef = ref(storage, imageUrl);
    try {
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Error deleting image from storage:', error);
    }

    // Update gear document
    const images = currentGear.images.filter((_, i) => i !== imageIndex);
    await updateDoc(gearRef, { 
      images,
      updatedAt: new Date()
    });

    return { ...currentGear, images } as BaseGear;
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

  async updateGearStatus(userId: string, gearId: string, status: GearStatus) {
    const gearRef = doc(this.gearCollection, gearId);
    await updateDoc(gearRef, {
      status,
      updatedAt: new Date()
    });
  }
} 