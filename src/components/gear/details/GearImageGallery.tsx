import React, { useRef, useState } from 'react';
import { FaTrash, FaUpload, FaInfoCircle } from 'react-icons/fa';
import { BaseGear } from '../../../types/gear';
import { GearService } from '../../../services/gearService';
import { useAuth } from '../../../hooks/useAuth';

interface GearImageGalleryProps {
  gear: BaseGear;
  onUpdate: (gear: BaseGear) => void;
}

export const GearImageGallery: React.FC<GearImageGalleryProps> = ({ gear, onUpdate }) => {
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
          const updatedGear = await gearService.addImage(user!.uid, gear.id, file);
          onUpdate(updatedGear);
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
        const updatedGear = await gearService.addImage(user!.uid, gear.id, file);
        onUpdate(updatedGear);
      }
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleDeleteImage = async () => {
    if (!gear.images || gear.images.length === 0) return;

    try {
      const updatedGear = await gearService.deleteImage(user!.uid, gear.id, currentImageIndex);
      onUpdate(updatedGear);
      if (currentImageIndex >= updatedGear.images.length) {
        setCurrentImageIndex(Math.max(0, updatedGear.images.length - 1));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
        {gear.images && gear.images.length > 0 ? (
          <img
            src={gear.images[currentImageIndex]}
            alt={`${gear.make} ${gear.model}`}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {gear.images?.map((image, index) => (
          <button
            key={image}
            onClick={() => setCurrentImageIndex(index)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              index === currentImageIndex ? 'border-[#EE5430]' : 'border-transparent hover:border-[#EE5430]/50'
            }`}
            draggable
            onDragStart={(e) => handleThumbnailDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleThumbnailDrop(e, index)}
          >
            <img
              src={image}
              alt={`${gear.make} ${gear.model} thumbnail ${index + 1}`}
              className="object-cover w-full h-full"
            />
            {index === 0 && (
              <div className="absolute top-1 left-1 bg-[#EE5430] text-white text-xs px-1.5 py-0.5 rounded">
                Main
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Tooltip */}
      <div className="flex items-center gap-1 text-sm text-gray-600">
        <FaInfoCircle className="text-[#EE5430]" />
        <span>Drag thumbnails to reorder. First image will be shown on the gear card.</span>
      </div>
    </div>
  );
}; 