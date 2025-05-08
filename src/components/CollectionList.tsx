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

  const confirmRemove = async () => {
    if (dinoToRemove) {
      await removeFromCollection(dinoToRemove.id);
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
    <div className="bg-[#0A0A0A] h-full">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search collection..."
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
      </div>

      <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {filteredDinos.map((dino) => (
          <div key={dino.id} className="rounded-lg overflow-hidden">
            <div className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleExpand(dino.id)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  {expandedDinos.has(dino.id) ? (
                    <ChevronDown size={16} className="text-gray-400" />
                  ) : (
                    <ChevronRight size={16} className="text-gray-400" />
                  )}
                </button>
                <span className="text-gray-200">{dino.name}</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setShowNewCategory(dino.id)}
                  className="p-1 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded"
                  title="Add Category"
                >
                  <FolderPlus size={16} />
                </button>
                <button
                  onClick={() => handleRemove(dino)}
                  className="p-1 text-gray-400 hover:text-red-400 hover:bg-gray-700 rounded"
                  title="Remove Dino"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {expandedDinos.has(dino.id) && (
              <div className="ml-8 space-y-1 mt-1">
                {showNewCategory === dino.id && (
                  <div className="flex gap-1 p-1">
                    <input
                      type="text"
                      placeholder="Category name..."
                      className="flex-1 px-2 py-1 bg-gray-900 border border-gray-700 rounded text-sm text-gray-200"
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
                      className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                )}

                <CategoryList
                  dino={dino}
                  onSelectCategory={onSelectCategory}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Dino Deletion Confirmation Modal */}
      {dinoToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-[#111111] rounded-lg p-6 max-w-sm w-full mx-4 border border-gray-800">
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Confirm Deletion</h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to remove {dinoToRemove.name} and all its categories from your collection? This will permanently delete all associated images.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDinoToRemove(null)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
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