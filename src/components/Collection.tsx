import React, { useState } from 'react';
import { useDinoStore } from '../store/useDinoStore';
import { CollectionList } from './CollectionList';
import { DinoDetail } from './DinoDetail';
import { Dino, Category } from '../types/dino';

interface SelectedView {
  dino: Dino;
  category: Category;
}

export const Collection: React.FC = () => {
  const { removeImage } = useDinoStore();
  const [selectedView, setSelectedView] = useState<SelectedView | null>(null);

  const handleSelectCategory = (dino: Dino, category: Category) => {
    setSelectedView({ dino, category });
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row bg-[#0A0A0A] gap-4">
      <div className="w-full md:w-80 md:flex-shrink-0">
        <CollectionList onSelectCategory={handleSelectCategory} />
      </div>
      {selectedView ? (
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#0A0A0A]">
          <DinoDetail
            dino={selectedView.dino}
            selectedCategory={selectedView.category}
            onRemoveImage={(categoryId, imageId) => removeImage(selectedView.dino.id, categoryId, imageId)}
          />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 bg-[#0A0A0A]">
          Select a category to view details
        </div>
      )}
    </div>
  );
};