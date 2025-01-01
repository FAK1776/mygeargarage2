import React, { useCallback, useState, useRef } from 'react';
import { BaseGear } from '../../../types/gear';
import { FaTrash, FaGuitar, FaCloudUploadAlt, FaChevronLeft, FaChevronRight, FaStar, FaPlus } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GearService } from '../../../services/gearService';
import { useAuth } from '../../../hooks/useAuth';

interface GearImageGalleryProps {
  gear: BaseGear;
  onUpdate: (updates: Partial<BaseGear>) => void;
  onImageUpload: (file: File) => Promise<void>;
  isEditing: boolean;
}

interface DraggableImageProps {
  image: { url: string; path: string; timestamp: number };
  index: number;
  moveImage: (dragIndex: number, hoverIndex: number) => void;
  onDelete: (path: string) => void;
  isEditing: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({ image, index, moveImage, onDelete, isEditing, isSelected, onSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'IMAGE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'IMAGE',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative aspect-square cursor-pointer ${
        isSelected ? 'ring-2 ring-[#EE5430]' : ''
      } ${isDragging ? 'opacity-50' : 'opacity-100'} group`}
      onClick={onSelect}
    >
      <img
        src={image.url}
        alt="Gear thumbnail"
        className="w-full h-full object-cover rounded-lg"
      />
      {index === 0 && (
        <div className="absolute top-1 left-1 p-1 bg-yellow-500 text-white rounded-full" title="Main image (shows on gear card)">
          <FaStar size={10} />
        </div>
      )}
      {isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(image.path);
          }}
          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete image"
        >
          <FaTrash size={10} />
        </button>
      )}
    </div>
  );
};

export const GearImageGallery: React.FC<GearImageGalleryProps> = ({
  gear,
  onUpdate,
  onImageUpload,
  isEditing,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const gearService = new GearService();

  const handleFileChange = async (files: FileList) => {
    if (!files.length || !user?.uid || !gear.id) return;

    try {
      // Create an array of upload promises
      const uploadPromises = Array.from(files).map(file => onImageUpload(file));
      
      // Wait for all uploads to complete
      await Promise.all(uploadPromises);
      
      setError(null);
      
      // If this is the first image being added, select it
      if (!gear.images || gear.images.length === 0) {
        setSelectedImage(0);
      }
    } catch (err) {
      console.error('Error uploading images:', err);
      setError('Failed to upload images. Please try again.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    if (!user?.uid || !gear.id) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileChange(files);
    }
  };

  const handleDeleteImage = async (path: string) => {
    if (!user?.uid || !gear.id) return;
    
    try {
      await gearService.deleteImage(user.uid, gear.id, path);
      const updatedImages = gear.images?.filter(img => img.path !== path) || [];
      onUpdate({ ...gear, images: updatedImages });
      setError(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
    }
  };

  const moveImage = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      if (!user?.uid || !gear.id || !gear.images) return;

      const dragImage = gear.images[dragIndex];
      const newImages = [...gear.images];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, dragImage);

      try {
        // Update the gear with the new image order
        await gearService.reorderImages(user.uid, gear.id, newImages);
        onUpdate({ ...gear, images: newImages });
        
        // Update the selected image index if needed
        if (selectedImage === dragIndex) {
          setSelectedImage(hoverIndex);
        } else if (selectedImage === hoverIndex) {
          setSelectedImage(dragIndex);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error reordering images:', err);
        setError('Failed to reorder images. Please try again.');
      }
    },
    [gear, user?.uid, onUpdate, selectedImage]
  );

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!gear.images?.length) return;
    
    if (direction === 'prev') {
      setSelectedImage(prev => (prev > 0 ? prev - 1 : gear.images.length - 1));
    } else {
      setSelectedImage(prev => (prev < gear.images.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Images</h2>
      </div>
      
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <DndProvider backend={HTML5Backend}>
        <div className="space-y-4">
          {/* Main Image with Navigation */}
          <div className="relative">
            <div 
              className={`relative aspect-square w-full bg-gray-100 rounded-lg overflow-hidden ${
                isDraggingOver ? 'border-2 border-dashed border-[#EE5430] bg-[#EE5430]/10' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {gear.images && gear.images.length > 0 ? (
                <>
                  <img
                    src={gear.images[selectedImage].url}
                    alt="Gear"
                    className="w-full h-full object-contain"
                  />
                  {/* Navigation Arrows - Always visible but semi-transparent */}
                  <div className="absolute inset-y-0 left-0 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('prev');
                      }}
                      className="p-2 bg-black/30 text-white hover:bg-black/50 transition-colors ml-2 rounded-full"
                    >
                      <FaChevronLeft size={24} />
                    </button>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateImage('next');
                      }}
                      className="p-2 bg-black/30 text-white hover:bg-black/50 transition-colors mr-2 rounded-full"
                    >
                      <FaChevronRight size={24} />
                    </button>
                  </div>
                  {/* Add More Images Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-4 right-4 p-3 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors group"
                    title="Add more images"
                  >
                    <FaCloudUploadAlt size={24} className="transform group-hover:scale-110 transition-transform" />
                  </button>
                </>
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FaCloudUploadAlt size={48} className="mb-2" />
                  <p className="text-sm">Drag & drop images here or click to browse</p>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-2">
            {gear.images?.map((image, index) => (
              <DraggableImage
                key={image.path}
                image={image}
                index={index}
                moveImage={moveImage}
                onDelete={handleDeleteImage}
                isEditing={isEditing}
                isSelected={selectedImage === index}
                onSelect={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>
      </DndProvider>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFileChange(e.target.files)}
        className="hidden"
      />
    </div>
  );
}; 