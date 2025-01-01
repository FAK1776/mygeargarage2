import React, { useCallback, useState, useRef, useEffect } from 'react';
import { BaseGear } from '../../../types/gear';
import { FaTrash, FaGuitar, FaCloudUploadAlt, FaChevronLeft, FaChevronRight, FaStar, FaPlus, FaSpinner } from 'react-icons/fa';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { GearService } from '../../../services/gearService';
import { useAuth } from '../../../hooks/useAuth';
import debounce from 'lodash/debounce';

interface GearImageGalleryProps {
  gear: BaseGear;
  onUpdate: (updates: Partial<BaseGear>) => void;
  onImageUpload: (files: File[]) => Promise<void>;
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

const LoadingOverlay: React.FC<{ message?: string }> = ({ message }) => (
  <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white">
    <FaSpinner className="animate-spin text-4xl mb-2" />
    <span className="text-sm">{message || 'Processing...'}</span>
  </div>
);

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

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`relative aspect-square cursor-pointer ${
        isSelected ? 'ring-2 ring-[#EE5430]' : ''
      } ${isDragging ? 'opacity-50' : 'opacity-100'} group`}
      onClick={onSelect}
    >
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <FaSpinner className="animate-spin text-gray-400" />
        </div>
      )}
      <img
        src={image.url}
        alt="Gear thumbnail"
        className="w-full h-full object-cover rounded-lg"
        onLoad={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
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
  const [isProcessing, setIsProcessing] = useState(false);
  const [localImages, setLocalImages] = useState(gear.images || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const gearService = new GearService();
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  // Sync localImages with gear.images when they change
  useEffect(() => {
    setLocalImages(gear.images || []);
  }, [gear.images]);

  // Update selected image index when images change
  useEffect(() => {
    if (selectedImage >= localImages.length) {
      setSelectedImage(Math.max(0, localImages.length - 1));
    }
  }, [localImages, selectedImage]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user?.uid || !gear.id) return;

    console.log('Starting image upload process:', {
      numberOfFiles: files.length,
      gearId: gear.id,
      currentImages: localImages.length
    });

    setIsUploading(true);

    try {
      // Initialize progress for all files
      const progressObj = {};
      Array.from(files).forEach(file => {
        progressObj[file.name] = 0;
      });
      setUploadProgress(progressObj);

      await onImageUpload(Array.from(files));

      // Update progress to complete for all files
      const completedProgress = {};
      Array.from(files).forEach(file => {
        completedProgress[file.name] = 100;
      });
      setUploadProgress(completedProgress);

      console.log('Image upload completed successfully:', {
        totalUploaded: files.length,
        newTotalImages: localImages.length + files.length
      });
    } catch (error) {
      console.error('Failed to upload images:', error);
      setError('Failed to upload images');
    } finally {
      setIsUploading(false);
      setUploadProgress({});
      if (event.target) {
        event.target.value = ''; // Reset input
      }
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
    
    if (!user?.uid || !gear.id || isProcessing) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileChange({ target: { files } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleDeleteImage = async (path: string) => {
    if (!user?.uid || !gear.id || isProcessing) return;
    
    setIsProcessing(true);
    try {
      // Update local state first
      const updatedImages = localImages.filter(img => img.path !== path);
      
      // If we're deleting the selected image, update selection
      if (selectedImage >= updatedImages.length) {
        setSelectedImage(Math.max(0, updatedImages.length - 1));
      }

      // Update local state before the API call
      setLocalImages(updatedImages);

      await gearService.deleteImage(user.uid, gear.id, path);
      
      // Only update parent if the API call was successful
      if (onUpdate) {
        onUpdate({ ...gear, images: updatedImages });
      }
      
      setError(null);
    } catch (err) {
      console.error('Error deleting image:', err);
      setError('Failed to delete image. Please try again.');
      // Revert local state on error
      setLocalImages(gear.images || []);
      // Reset selected image if needed
      if (selectedImage >= (gear.images || []).length) {
        setSelectedImage(Math.max(0, (gear.images || []).length - 1));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Debounce the actual reorder update to Firestore
  const debouncedReorder = useCallback(
    debounce(async (newImages: typeof localImages) => {
      if (!user?.uid || !gear.id) return;

      try {
        await gearService.reorderImages(user.uid, gear.id, newImages);
        onUpdate({ ...gear, images: newImages });
        setError(null);
      } catch (err) {
        console.error('Error reordering images:', err);
        setError('Failed to reorder images. Please try again.');
        // Revert local state on error
        setLocalImages(gear.images || []);
      }
    }, 500),
    [user?.uid, gear.id, onUpdate]
  );

  const moveImage = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (dragIndex === hoverIndex || isProcessing) return;

      console.log('Starting image reorder:', {
        dragIndex,
        hoverIndex,
        totalImages: localImages.length
      });

      const dragImage = localImages[dragIndex];
      const newImages = [...localImages];
      newImages.splice(dragIndex, 1);
      newImages.splice(hoverIndex, 0, dragImage);

      // Update local state immediately
      setLocalImages(newImages);
      
      // Update selected image index if needed
      if (selectedImage === dragIndex) {
        setSelectedImage(hoverIndex);
      } else if (selectedImage === hoverIndex) {
        setSelectedImage(dragIndex);
      }

      // Debounce the actual update to Firestore
      debouncedReorder(newImages);
    },
    [localImages, selectedImage, isProcessing, debouncedReorder]
  );

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!localImages?.length) return;
    
    if (direction === 'prev') {
      setSelectedImage(prev => (prev > 0 ? prev - 1 : localImages.length - 1));
    } else {
      setSelectedImage(prev => (prev < localImages.length - 1 ? prev + 1 : 0));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Images</h2>
        {(isProcessing || isUploading) && (
          <span className="text-sm text-gray-500">
            {isUploading ? 'Uploading...' : 'Processing...'}
          </span>
        )}
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
              {localImages && localImages.length > 0 ? (
                <>
                  {mainImageLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <FaSpinner className="animate-spin text-4xl text-gray-400" />
                    </div>
                  )}
                  <img
                    src={localImages[selectedImage]?.url}
                    alt="Gear"
                    className="w-full h-full object-contain"
                    onLoad={() => setMainImageLoading(false)}
                    onError={() => setMainImageLoading(false)}
                  />
                  {isProcessing && <LoadingOverlay />}
                  {/* Navigation Arrows */}
                  {localImages.length > 1 && !isProcessing && (
                    <>
                      <div className="absolute inset-y-0 left-0 flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateImage('prev');
                          }}
                          className="p-2 bg-black/30 text-white hover:bg-black/50 transition-colors ml-2 rounded-full"
                          disabled={isProcessing}
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
                          disabled={isProcessing}
                        >
                          <FaChevronRight size={24} />
                        </button>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <div 
                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-gray-500 transition-colors"
                  onClick={() => !isProcessing && fileInputRef.current?.click()}
                >
                  {isProcessing ? (
                    <LoadingOverlay />
                  ) : (
                    <>
                      <FaCloudUploadAlt size={48} className="mb-2" />
                      <p className="text-sm">Drag & drop images here or click to browse</p>
                    </>
                  )}
                </div>
              )}
              
              {/* Add More Images Button - show only when there are existing images and not processing */}
              {localImages?.length > 0 && !isProcessing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-4 right-4 p-3 bg-black/30 text-white rounded-full hover:bg-black/50 transition-colors group"
                  title="Add more images"
                >
                  <FaCloudUploadAlt size={24} className="transform group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Thumbnails - only show if there are images */}
          {localImages?.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {localImages.map((image, index) => (
                <DraggableImage
                  key={image.path}
                  image={image}
                  index={index}
                  moveImage={moveImage}
                  onDelete={handleDeleteImage}
                  isEditing={isEditing && !isProcessing}
                  isSelected={selectedImage === index}
                  onSelect={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>
      </DndProvider>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFileChange(e)}
        className="hidden"
        disabled={isProcessing}
      />
    </div>
  );
}; 