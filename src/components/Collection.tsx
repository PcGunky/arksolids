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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
      <CollectionList onSelectCategory={handleSelectCategory} />
      
      {selectedView && (
        <div className="lg:sticky lg:top-4">
          <DinoDetail
            dino={selectedView.dino}
            selectedCategory={selectedView.category}
            onRemoveImage={(categoryId, imageId) => removeImage(selectedView.dino.id, categoryId, imageId)}
          />
        </div>
      )}
    </div>
  );
};