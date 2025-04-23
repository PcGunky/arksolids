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
              onClick={() => removeCategory(dino.id, category.id)}
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
    </div>
  );
};