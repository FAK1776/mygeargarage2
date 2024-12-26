import React, { useRef, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrash, FaUpload } from 'react-icons/fa';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
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

  const nextImage = () => {
    if (!gear.images || gear.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % gear.images.length);
  };

  const prevImage = () => {
    if (!gear.images || gear.images.length <= 1) return;
    setCurrentImageIndex((prev) => (prev - 1 + gear.images.length) % gear.images.length);
  };

  return (
    <div 
      className={`relative aspect-square mb-4 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
        isDragging 
          ? 'border-dashed border-blue-500 bg-blue-50 scale-102' 
          : gear.images && gear.images.length > 0 
            ? 'border-transparent' 
            : 'border-dashed border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {gear.images && gear.images.length > 0 ? (
        <>
          <img
            src={gear.images[currentImageIndex]}
            alt={`${gear.make} ${gear.model}`}
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <button
                onClick={prevImage}
                className="p-2 text-white hover:text-blue-400 transition-colors"
                disabled={gear.images.length <= 1}
              >
                <FaChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="p-2 text-white hover:text-blue-400 transition-colors"
                disabled={gear.images.length <= 1}
              >
                <FaChevronRight size={24} />
              </button>
            </div>
            <button
              onClick={handleDeleteImage}
              className="absolute top-2 right-2 p-2 text-white hover:text-red-400 transition-colors"
            >
              <FaTrash size={20} />
            </button>
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <FaUpload size={48} className="mb-2" />
          <p className="text-sm">Drag & drop images here</p>
          <p className="text-sm">or</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 px-4 py-2 text-sm text-blue-500 hover:text-blue-600 transition-colors"
          >
            Browse files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>
      )}
    </div>
  );
}; 