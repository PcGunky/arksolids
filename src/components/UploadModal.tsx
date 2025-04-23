import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import { DinoImage } from '../types/dino';
import { uploadImage } from '../lib/storage';
import { useAuthStore } from '../store/useAuthStore';

interface UploadModalProps {
  onClose: () => void;
  onUpload: (images: DinoImage[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ onClose, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [colors, setColors] = useState<Record<string, number>>({});
  const [uploading, setUploading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files));
    }
  };

  const handleUpload = async () => {
    if (!user) return;
    setUploading(true);

    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const url = await uploadImage(file, user.id);
        return {
          id: Math.random().toString(36).substring(7),
          url,
          color: colors[file.name] || 0,
        };
      });

      const images = await Promise.all(uploadPromises);
      onUpload(images);
      onClose();
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Upload Images</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="mb-4"
        />

        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto mb-4">
          {selectedFiles.map((file) => (
            <div key={file.name} className="border rounded-lg p-4">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <input
                type="number"
                min="0"
                max="254"
                placeholder="Color ID (0-254)"
                className="w-full px-3 py-2 border rounded-md"
                onChange={(e) =>
                  setColors((prev) => ({
                    ...prev,
                    [file.name]: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
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