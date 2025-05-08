import React, { useState } from 'react';
import { Upload, Eye, Trash2 } from 'lucide-react';
import { Dino, Category } from '../types/dino';
import { useDinoStore } from '../store/useDinoStore';
import { CategoryUploadModal } from './CategoryUploadModal';

interface CategoryListProps {
  dino: Dino;
  onSelectCategory: (dino: Dino, category: Category) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ dino, onSelectCategory }) => {
  const { removeCategory } = useDinoStore();
  const [uploadCategory, setUploadCategory] = useState<string | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleRemoveCategory = (category: Category) => {
    setCategoryToDelete(category);
  };

  const confirmRemoveCategory = async () => {
    if (categoryToDelete) {
      await removeCategory(dino.id, categoryToDelete.id);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-1">
      {dino.categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-2 bg-gray-900 rounded-md group"
        >
          <span className="text-sm text-gray-300">{category.name}</span>
          <div className="flex gap-1">
            <button
              onClick={() => setUploadCategory(category.id)}
              className="p-1 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded"
              title="Upload Images"
            >
              <Upload size={16} />
            </button>
            <button
              onClick={() => onSelectCategory(dino, category)}
              className="p-1 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded"
              title="View Category"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => handleRemoveCategory(category)}
              className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
              title="Remove Category"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {uploadCategory && (
        <CategoryUploadModal
          dinoId={dino.id}
          categoryId={uploadCategory}
          onClose={() => setUploadCategory(null)}
        />
      )}

      {/* Category Deletion Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#111111] rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Confirm Category Deletion</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete the category "{categoryToDelete.name}"? This will permanently delete all images in this category.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemoveCategory}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};