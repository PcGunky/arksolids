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
    <div className="bg-[#0A0A0A] h-full">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search dinosaurs..."
          className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-500" size={20} />
      </div>
      <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {filteredDinos.map((dino) => (
          <div
            key={dino.id}
            className="flex items-center justify-between p-2 hover:bg-gray-800 rounded-lg group"
          >
            <span className="text-gray-300 group-hover:text-white">{dino.name}</span>
            <button
              onClick={() =>
                addToCollection({ ...dino, categories: [], addedAt: new Date() })
              }
              className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};