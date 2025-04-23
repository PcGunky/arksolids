import React, { useState, useEffect } from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';
import { Dino, Category } from '../types/dino';
import { ImageGrid } from './ImageGrid';
import { MissingColorsDisplay } from './MissingColorsDisplay';

interface DinoDetailProps {
  dino: Dino;
  selectedCategory: Category;
  onRemoveImage: (categoryId: string, imageId: string) => void;
}

export const DinoDetail: React.FC<DinoDetailProps> = ({ dino, selectedCategory, onRemoveImage }) => {
  const [colorFilter, setColorFilter] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [colorCheck, setColorCheck] = useState('');
  const [missingColors, setMissingColors] = useState<string[]>([]);

  useEffect(() => {
    setColorFilter('');
    setColorCheck('');
    setMissingColors([]);
  }, [selectedCategory.id]);

  const filteredImages = selectedCategory.images.filter((img) => {
    if (!colorFilter) return true;
    return img.color.toLowerCase() === colorFilter.toLowerCase();
  });

  const sortedImages = [...filteredImages].sort((a, b) => {
    const aNum = parseInt(a.color);
    const bNum = parseInt(b.color);
    return isNaN(aNum) || isNaN(bNum) ? 
      a.color.localeCompare(b.color) : 
      aNum - bNum;
  });
  
  const uniqueColors = new Set(selectedCategory.images.map(img => img.color));
  const colorCount = uniqueColors.size;

  const handleColorCheck = () => {
    const wantedColors = colorCheck.split(',').map(c => c.trim());
    const existingColors = new Set(selectedCategory.images.map(img => img.color));
    const missing = wantedColors.filter(color => !existingColors.has(color));
    setMissingColors(missing);
  };

  return (
    <div className="bg-[#111111] rounded-lg p-4 sm:p-6">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">{dino.name}</h2>
          <p className="text-gray-400 mt-1">
            {selectedCategory.name} - Colors: {colorCount}/254
          </p>
        </div>
        <button
          onClick={() => setShowFilter(!showFilter)}
          className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white"
          title="Filter Images"
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>

      <div className="mb-4 sm:mb-6 space-y-4">
        {showFilter && (
          <div className="p-4 bg-[#0A0A0A] rounded-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Color ID..."
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
                value={colorFilter}
                onChange={(e) => setColorFilter(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Check colors (e.g., 53,64,84,165)"
            className="flex-1 px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200"
            value={colorCheck}
            onChange={(e) => setColorCheck(e.target.value)}
          />
          <button
            onClick={handleColorCheck}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 whitespace-nowrap"
          >
            Check
          </button>
        </div>

        {missingColors.length > 0 && (
          <MissingColorsDisplay colors={missingColors} />
        )}
      </div>

      <div className="overflow-x-hidden">
        <ImageGrid
          images={sortedImages}
          onRemoveImage={(imageId) => onRemoveImage(selectedCategory.id, imageId)}
        />
      </div>
    </div>
  );
};