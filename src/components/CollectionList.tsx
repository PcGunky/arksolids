import React, { useState } from 'react';
import { Search, Plus, FolderPlus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useDinoStore } from '../store/useDinoStore';
import { Dino, Category } from '../types/dino';
import { CategoryList } from './CategoryList';

interface CollectionListProps {
  onSelectCategory: (dino: Dino, category: Category) => void;
}

export const CollectionList: React.FC<CollectionListProps> = ({
  onSelectCategory,
}) => {
  const [search, setSearch] = useState('');
  const [dinoToRemove, setDinoToRemove] = useState<Dino | null>(null);
  const [showNewCategory, setShowNewCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [expandedDinos, setExpandedDinos] = useState<Set<string>>(new Set());
  const { collection, removeFromCollection, addCategory } = useDinoStore();

  const filteredDinos = collection.filter((dino) =>
    dino.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleRemove = (dino: Dino) => {
    setDinoToRemove(dino);
  };

  const confirmRemove = () => {
    if (dinoToRemove) {
      removeFromCollection(dinoToRemove.id);
      setDinoToRemove(null);
    }
  };

  const handleAddCategory = (dinoId: string) => {
    if (newCategoryName.trim()) {
      addCategory(dinoId, newCategoryName.trim());
      setNewCategoryName('');
      setShowNewCategory(null);
    }
  };

  const toggleExpand = (dinoId: string) => {
    setExpandedDinos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(dinoId)) {
        newSet.delete(dinoId);
      } else {
        newSet.add(dinoId);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search collection..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {filteredDinos.map((dino) => (
          <div key={dino.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleExpand(dino.id)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  {expandedDinos.has(dino.id) ? (
                    <ChevronDown size={20} />
                  ) : (
                    <ChevronRight size={20} />
                  )}
                </button>
                <span className="font-medium">{dino.name}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowNewCategory(dino.id)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-md"
                  title="Add Category"
                >
                  <FolderPlus size={20} />
                </button>
                <button
                  onClick={() => handleRemove(dino)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded-md"
                  title="Remove Dino"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {expandedDinos.has(dino.id) && (
              <>
                {showNewCategory === dino.id && (
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Category name..."
                      className="flex-1 px-3 py-1 border rounded-md"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddCategory(dino.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddCategory(dino.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}

                <CategoryList
                  dino={dino}
                  onSelectCategory={onSelectCategory}
                />
              </>
            )}
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {dinoToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Confirm Removal</h3>
            <p className="mb-6">
              Are you sure you want to remove {dinoToRemove.name} from your collection?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDinoToRemove(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};