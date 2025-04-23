import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useDinoStore } from '../store/useDinoStore';

export const MasterList: React.FC = () => {
  const [search, setSearch] = useState('');
  const { masterList, addToCollection } = useDinoStore();

  const filteredDinos = masterList.filter((dino) =>
    dino.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 h-full">
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search dinosaurs..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {filteredDinos.map((dino) => (
          <div
            key={dino.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
          >
            <span className="font-medium">{dino.name}</span>
            <button
              onClick={() =>
                addToCollection({ ...dino, categories: [], addedAt: new Date() })
              }
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};