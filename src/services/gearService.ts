import { collection, doc, getDocs, query, where, updateDoc, Timestamp, DocumentData, addDoc, deleteDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';
import { BaseGear, GearStatus, GearType } from '../types/gear';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

export class GearService {
  private gearCollection = collection(db, 'gear');
  private maxImageSize = 1200; // Maximum width/height for images

  private convertToGear(doc: DocumentData): BaseGear {
    const data = doc.data();
    console.log('Converting Firestore doc to Gear object:', { docId: doc.id, rawData: data });
    
    // Convert service history dates
    const serviceHistory = data.serviceHistory?.map((record: any) => {
      console.log('Processing service history record:', record);
      return {
        ...record,
        date: record.date?.toDate?.() || record.date || null
      };
    }) || [];

    console.log('Processed service history:', serviceHistory);

    return {
      id: doc.id,
      ...data,
      type: data.type || GearType.Other,
      createdAt: data.createdAt?.toDate?.() || data.createdAt,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      dateAcquired: data.dateAcquired?.toDate?.() || data.dateAcquired,
      dateSold: data.dateSold?.toDate?.() || data.dateSold,
      serviceHistory,
      images: Array.isArray(data.images) ? data.images : []
    } as BaseGear;
  }

  async getUserGear(userId: string): Promise<BaseGear[]> {
    console.log('Fetching gear for user:', userId);
    const q = query(this.gearCollection, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    const gear = querySnapshot.docs.map(doc => this.convertToGear(doc));
    console.log('Retrieved gear items:', gear.length);
    return gear;
  }

  async addGear(userId: string, gear: Omit<BaseGear, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();

    // Convert service history dates to Timestamps
    const serviceHistory = gear.serviceHistory?.map(record => ({
      ...record,
      date: record.date instanceof Date ? Timestamp.fromDate(record.date) : record.date
    })) || [];

    // Create a Firestore-safe object
    const gearWithDates = {
      ...gear,
      userId,
      type: gear.type || GearType.Other,
      createdAt: now,
      updatedAt: now,
      status: gear.status || GearStatus.Own,
      serviceHistory
    };

    // Only add date fields if they exist
    if (gear.dateAcquired) {
      gearWithDates.dateAcquired = gear.dateAcquired instanceof Date ? Timestamp.fromDate(gear.dateAcquired) : gear.dateAcquired;
    }
    if (gear.dateSold) {
      gearWithDates.dateSold = gear.dateSold instanceof Date ? Timestamp.fromDate(gear.dateSold) : gear.dateSold;
    }

    const docRef = await addDoc(this.gearCollection, gearWithDates);
    return docRef.id;
  }

  async deleteGear(userId: string, gearId: string): Promise<void> {
    try {
      // Get the gear document first to verify ownership and get image URLs
      const gearRef = doc(this.gearCollection, gearId);
      const gearDoc = await getDoc(gearRef);
      
      if (!gearDoc.exists()) {
        console.error('Gear not found:', gearId);
        throw new Error('Gear not found');
      }
      
      const gearData = gearDoc.data();
      
      // Verify ownership
      if (gearData.userId !== userId) {
        console.error('Unauthorized to delete gear:', gearId, 'Expected user:', userId, 'Actual user:', gearData.userId);
        throw new Error('Unauthorized to delete this gear');
      }
      
      // Delete all associated images from storage
      if (gearData.images && Array.isArray(gearData.images)) {
        for (const imageUrl of gearData.images) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.error('Error deleting image:', imageUrl, error);
            // Continue with deletion even if image deletion fails
          }
        }
      }
      
      // Delete the gear document
      await deleteDoc(gearRef);
      console.log('Successfully deleted gear:', gearId);
    } catch (error) {
      console.error('Error deleting gear:', error);
      throw error;
    }
  }

  private cleanUndefined(obj: any): any {
    if (obj === null || obj === undefined) return null;
    if (typeof obj !== 'object') return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(item => this.cleanUndefined(item)).filter(item => item !== null);
    }
    
    const cleaned: any = {};
    for (const key in obj) {
      const value = this.cleanUndefined(obj[key]);
      if (value !== null && value !== undefined) {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }

  async updateGear(userId: string, gearId: string, updates: Partial<BaseGear>): Promise<void> {
    console.log('Updating gear:', { userId, gearId, updates });
    
    // Convert service history dates to Timestamps if present
    const processedUpdates = { ...updates };
    if (updates.serviceHistory) {
      console.log('Processing service history for update:', updates.serviceHistory);
      processedUpdates.serviceHistory = updates.serviceHistory.map(record => ({
        ...record,
        date: record.date instanceof Date ? Timestamp.fromDate(record.date) : record.date
      }));
      console.log('Processed service history for update:', processedUpdates.serviceHistory);
    }

    // Clean undefined values
    const cleanedUpdates = Object.entries(processedUpdates).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);

    console.log('Cleaned updates for Firestore:', cleanedUpdates);

    const docRef = doc(this.gearCollection, gearId);
    await updateDoc(docRef, {
      ...cleanedUpdates,
      updatedAt: Timestamp.now()
    });
    console.log('Gear update completed');
  }

  async getUserWishlist(userId: string): Promise<BaseGear[]> {
    const q = query(collection(db, 'wishlist'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as BaseGear));
  }

  async addToWishlist(userId: string, gear: Omit<BaseGear, 'id'>): Promise<BaseGear> {
    const wishlistRef = collection(db, 'wishlist');
    const docRef = await addDoc(wishlistRef, {
      ...gear,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { ...gear, id: docRef.id } as BaseGear;
  }

  async deleteWishlistItem(userId: string, gearId: string): Promise<void> {
    const wishlistRef = doc(db, 'wishlist', gearId);
    await deleteDoc(wishlistRef);
  }

  async updateWishlistItem(userId: string, gearId: string, updates: Partial<BaseGear>): Promise<void> {
    const wishlistRef = doc(db, 'wishlist', gearId);
    await updateDoc(wishlistRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  }

  async addImages(userId: string, gearId: string, files: File[]): Promise<Partial<BaseGear>> {
    if (!userId || !gearId) {
      throw new Error('User ID and Gear ID are required for adding images');
    }

    try {
      console.log('Starting batch image upload:', {
        numberOfFiles: files.length,
        gearId
      });

      // Get current gear document to get existing images
      const gearRef = doc(this.gearCollection, gearId);
      const gearDoc = await getDoc(gearRef);
      if (!gearDoc.exists()) {
        throw new Error('Gear not found');
      }
      const currentImages = gearDoc.data().images || [];

      // Process all images sequentially to maintain order
      const newImages = [];
      for (const file of files) {
        console.log('Processing file:', {
          name: file.name,
          size: file.size
        });

        // Compress the image
        const compressedImage = await this.compressImage(file);

        // Convert base64 to blob
        const response = await fetch(compressedImage);
        const blob = await response.blob();

        // Create a unique filename with sanitized name
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
        const filename = `${userId}/${gearId}/${timestamp}_${sanitizedFileName}`;
        const imageRef = ref(storage, filename);

        // Upload to Firebase Storage
        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);

        // Add to new images array
        newImages.push({ url, path: filename, timestamp });
      }

      // Combine with existing images in a single update
      const updatedImages = [...currentImages, ...newImages];

      console.log('Updating Firestore with new images:', {
        newImagesCount: newImages.length,
        totalImages: updatedImages.length
      });

      // Update the gear document with all images
      await updateDoc(gearRef, {
        images: updatedImages,
        updatedAt: Timestamp.now()
      });

      return { images: updatedImages };
    } catch (error) {
      console.error('Error adding images:', error);
      throw new Error('Failed to add images');
    }
  }

  async deleteImage(userId: string, gearId: string, imagePath: string): Promise<void> {
    if (!userId || !gearId || !imagePath) {
      throw new Error('User ID, Gear ID, and image path are required for deleting images');
    }

    try {
      console.log('Starting image deletion:', { imagePath, gearId });

      // Get current gear document
      const gearRef = doc(this.gearCollection, gearId);
      const gearDoc = await getDoc(gearRef);
      
      if (!gearDoc.exists()) {
        throw new Error('Gear not found');
      }

      const currentImages = gearDoc.data().images || [];
      console.log('Current images before deletion:', {
        count: currentImages.length,
        paths: currentImages.map(img => img.path)
      });

      // First update Firestore to remove the image reference
      const updatedImages = currentImages.filter(img => img.path !== imagePath);
      await updateDoc(gearRef, {
        images: updatedImages,
        updatedAt: Timestamp.now()
      });

      console.log('Updated Firestore, removing image reference');

      // Then try to delete from storage
      try {
        const imageRef = ref(storage, imagePath);
        await deleteObject(imageRef);
        console.log('Successfully deleted image from Storage');
      } catch (storageError) {
        // Log but don't throw - the image might already be deleted from storage
        console.warn('Could not delete image from Storage:', storageError);
      }

    } catch (error) {
      console.error('Error in deleteImage:', error);
      throw new Error('Failed to delete image');
    }
  }

  async reorderImages(userId: string, gearId: string, images: Array<{ url: string; path: string; timestamp: number }>): Promise<void> {
    if (!userId || !gearId) {
      throw new Error('User ID and Gear ID are required for reordering images');
    }

    try {
      console.log('Starting image reorder operation:', {
        gearId,
        imageCount: images.length,
        newOrder: images.map(img => img.path)
      });

      const gearRef = doc(this.gearCollection, gearId);
      
      // Verify the gear exists and get current images
      const gearDoc = await getDoc(gearRef);
      if (!gearDoc.exists()) {
        throw new Error('Gear not found');
      }

      const currentImages = gearDoc.data().images || [];
      
      // Verify all images in new order exist in current images
      const currentPaths = new Set(currentImages.map(img => img.path));
      const allImagesExist = images.every(img => currentPaths.has(img.path));
      
      if (!allImagesExist) {
        console.error('Image reorder failed - some images do not exist in current set');
        throw new Error('Invalid image order - some images not found');
      }

      await updateDoc(gearRef, { 
        images,
        updatedAt: Timestamp.now()
      });

      console.log('Successfully reordered images');
    } catch (error) {
      console.error('Error in reorderImages:', error);
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

  async updateGearStatus(userId: string, gearId: string, status: GearStatus) {
    const gearRef = doc(this.gearCollection, gearId);
    await updateDoc(gearRef, {
      status,
      updatedAt: new Date()
    });
  }

  async getGearById(gearId: string): Promise<BaseGear | null> {
    const docRef = doc(this.gearCollection, gearId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return this.convertToGear(docSnap);
    }
    
    return null;
  }
} 