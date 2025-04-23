import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { DinoImage } from '../types/dino';
import { uploadImage } from '../lib/storage';
import { useAuthStore } from '../store/useAuthStore';
import { useDinoStore } from '../store/useDinoStore';

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes

interface CategoryUploadModalProps {
  dinoId: string;
  categoryId: string;
  onClose: () => void;
}

export const CategoryUploadModal: React.FC<CategoryUploadModalProps> = ({
  dinoId,
  categoryId,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [colors, setColors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const user = useAuthStore((state) => state.user);
  const addImages = useDinoStore((state) => state.addImages);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      
      // Check file types and sizes
      const invalidFiles = files.filter(file => {
        const isValidType = file.type === 'image/png' || file.type === 'image/jpeg';
        const isValidSize = file.size <= MAX_FILE_SIZE;
        return !isValidType || !isValidSize;
      });
      
      if (invalidFiles.length > 0) {
        setError('Only PNG/JPG files up to 1MB are allowed');
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }
      
      setError('');
      setSelectedFiles(files);
      
      // Initialize colors object with empty strings
      const initialColors = files.reduce((acc, file) => ({
        ...acc,
        [file.name]: ''
      }), {});
      setColors(initialColors);
    }
  };

  const validateColors = () => {
    const missingColors = selectedFiles.filter(file => !colors[file.name]);
    if (missingColors.length > 0) {
      setError('Please enter a color ID for all images');
      return false;
    }

    // Only validate number range if the color is numeric
    const invalidColors = Object.values(colors).filter(color => {
      const num = parseInt(color);
      return !isNaN(num) && (num < 0 || num > 254);
    });

    if (invalidColors.length > 0) {
      setError('Numeric color IDs must be between 0 and 254');
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!user) return;
    
    if (!validateColors()) {
      return;
    }

    setUploading(true);
    setError('');

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const url = await uploadImage(file, user.id);
        return {
          id: Math.random().toString(36).substring(7),
          url,
          color: colors[file.name],
        };
      });

      const images = await Promise.all(uploadPromises);
      await addImages(dinoId, categoryId, images);
      onClose();
    } catch (error) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#111111] rounded-lg p-6 w-full max-w-2xl border border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Upload Images</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg"
            onChange={handleFileSelect}
            className="text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-800 file:text-gray-300 hover:file:bg-gray-700"
          />
          {error && (
            <p className="text-red-400 text-sm mt-2">{error}</p>
          )}
          <p className="text-sm text-gray-400 mt-1">
            Supported formats: PNG, JPG (Max size: 1MB per image)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto mb-4">
          {selectedFiles.map((file) => (
            <div key={file.name} className="border border-gray-800 rounded-lg p-4 bg-gray-900">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <input
                type="text"
                placeholder="Color ID (e.g., 123 or Red)"
                className={`w-full px-3 py-2 bg-gray-800 border rounded-md text-gray-200 placeholder-gray-500 ${
                  !colors[file.name] ? 'border-red-500' : 'border-gray-700'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                value={colors[file.name]}
                onChange={(e) =>
                  setColors((prev) => ({
                    ...prev,
                    [file.name]: e.target.value,
                  }))
                }
                required
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            disabled={selectedFiles.length === 0 || uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};