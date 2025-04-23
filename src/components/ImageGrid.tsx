import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { DinoImage } from '../types/dino';

interface ImageGridProps {
  images: DinoImage[];
  onRemoveImage?: (imageId: string) => void;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onRemoveImage }) => {
  const [selectedImage, setSelectedImage] = useState<DinoImage | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <div 
              onClick={() => setSelectedImage(image)}
              className="cursor-pointer relative aspect-[5/3] bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={image.url}
                alt="Dinosaur specimen"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 text-xs rounded-md">
                {image.color}
              </div>
              {onRemoveImage && (
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(image.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative max-w-4xl w-full mx-4">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={24} />
            </button>
            <div className="relative bg-gray-900 rounded-lg overflow-hidden">
              <img
                src={selectedImage.url}
                alt="Dinosaur specimen full view"
                className="w-full h-auto max-h-[300px] object-contain"
              />
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-2 rounded-md">
                Color ID: {selectedImage.color}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};