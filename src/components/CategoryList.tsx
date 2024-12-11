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
    <div className="space-y-2">
      {dino.categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
        >
          <span className="text-sm font-medium">{category.name}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setUploadCategory(category.id)}
              className="flex items-center gap-1 px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
              title="Upload Images"
            >
              <Upload size={16} />
            </button>
            <button
              onClick={() => onSelectCategory(dino, category)}
              className="flex items-center gap-1 px-2 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md"
              title="View Category"
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => removeCategory(dino.id, category.id)}
              className="flex items-center gap-1 px-2 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md"
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