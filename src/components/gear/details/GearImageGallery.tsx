import React, { useRef, useState } from 'react';
import { FaTrash, FaUpload, FaInfoCircle, FaImage } from 'react-icons/fa';
import { BaseGear } from '../../../types/gear';
import { GearService } from '../../../services/gearService';
import { useAuth } from '../../../hooks/useAuth';

interface GearImageGalleryProps {
  gear: BaseGear;
  onUpdate: (gear: BaseGear) => void;
  onImageUpload?: (file: File) => Promise<void>;
  isEditing?: boolean;
}

export const GearImageGallery: React.FC<GearImageGalleryProps> = ({ 
  gear, 
  onUpdate,
  onImageUpload,
  isEditing = false
}) => {
  const { user } = useAuth();
  const gearService = new GearService();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    // Handle new image file uploads
    if (e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      try {
        for (const file of files) {
          if (!file.type.startsWith('image/')) continue;
          if (onImageUpload) {
            await onImageUpload(file);
          }
        }
      } catch (error) {
        console.error('Error uploading images:', error);
      }
      return;
    }
  };

  const handleThumbnailDragStart = (e: React.DragEvent, index: number) => {
    e.stopPropagation();
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleThumbnailDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleThumbnailDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    try {
      const updatedGear = await gearService.reorderImages(user!.uid, gear.id, draggedIndex, dropIndex);
      onUpdate(updatedGear);
      setCurrentImageIndex(dropIndex);
    } catch (error) {
      console.error('Error reordering images:', error);
    }
    setDraggedIndex(null);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      for (const file of files) {
        if (!file.type.startsWith('image/')) continue;
        if (onImageUpload) {
          await onImageUpload(file);
        }
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
    
    // Clear the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteImage = async (index: number) => {
    if (!gear.images || gear.images.length === 0) return;

    try {
      const updatedGear = await gearService.deleteImage(user!.uid, gear.id, index);
      onUpdate(updatedGear);
      if (currentImageIndex >= updatedGear.images.length) {
        setCurrentImageIndex(Math.max(0, updatedGear.images.length - 1));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div 
      className={`space-y-4 ${isDragging ? 'border-2 border-dashed border-[#EE5430] rounded-lg p-4' : 'border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#EE5430] transition-colors'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Main Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden relative">
        {gear.images && gear.images.length > 0 ? (
          <img
            src={gear.images[currentImageIndex]}
            alt={`${gear.make} ${gear.model}`}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <FaImage className="w-12 h-12 text-gray-400 mb-2" />
            <span className="text-gray-400 text-center">
              Drop images here or click upload below
            </span>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <div className="flex justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-600 hover:text-gray-900 transition-colors rounded-full hover:bg-gray-100"
          title="Upload images"
        >
          <FaUpload className="w-5 h-5" />
        </button>
      </div>

      {/* Thumbnails */}
      {gear.images && gear.images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {gear.images.map((image, index) => (
            <div
              key={image}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                index === currentImageIndex ? 'border-[#EE5430]' : 'border-transparent hover:border-[#EE5430]/50'
              }`}
            >
              <img
                src={image}
                alt={`${gear.make} ${gear.model} thumbnail ${index + 1}`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setCurrentImageIndex(index)}
                draggable={true}
                onDragStart={(e) => handleThumbnailDragStart(e, index)}
                onDragOver={(e) => handleThumbnailDragOver(e, index)}
                onDrop={(e) => handleThumbnailDrop(e, index)}
              />
              <button
                onClick={() => handleDeleteImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <FaTrash size={12} />
              </button>
              {index === 0 && (
                <div className="absolute top-1 left-1 bg-[#EE5430] text-white text-xs px-1.5 py-0.5 rounded">
                  Main
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <FaInfoCircle className="text-[#EE5430] flex-shrink-0" />
        <span>Drag and drop images here or click upload. Drag thumbnails to reorder. First image will be the main image shown on cards.</span>
      </div>
    </div>
  );
}; 