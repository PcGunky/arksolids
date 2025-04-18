import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ImageGrid } from './ImageGrid';
import { MissingColorsDisplay } from './MissingColorsDisplay';
import { Dino, Category } from '../types/dino';
import { calculateTotalColors } from '../utils/colorUtils';

export const SharedCollection: React.FC = () => {
  const { identifier } = useParams();
  const [collection, setCollection] = useState<Dino[]>([]);
  const [selectedDino, setSelectedDino] = useState<Dino | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [colorCheck, setColorCheck] = useState('');
  const [missingColors, setMissingColors] = useState<string[]>([]);

  useEffect(() => {
    const fetchCollection = async () => {
      if (!identifier) {
        setError('No identifier provided');
        setLoading(false);
        return;
      }

      try {
        // First try to find by custom domain
        let { data: domainData } = await supabase
          .from('user_domains')
          .select('user_id')
          .eq('domain', identifier)
          .single();

        const userId = domainData?.user_id || identifier;

        const { data, error: supabaseError } = await supabase
          .from('collections')
          .select('data')
          .eq('user_id', userId)
          .single();

        if (supabaseError) throw supabaseError;

        if (data?.data) {
          // Sort the collection alphabetically by name
          const sortedCollection = [...data.data].sort((a, b) => 
            a.name.localeCompare(b.name)
          );
          setCollection(sortedCollection);
          if (sortedCollection.length > 0) {
            setSelectedDino(sortedCollection[0]);
            if (sortedCollection[0].categories.length > 0) {
              setSelectedCategory(sortedCollection[0].categories[0]);
            }
          }
        } else {
          setError('Collection not found');
        }
      } catch (err) {
        setError('Failed to load collection');
        console.error('Error loading shared collection:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [identifier]);

  useEffect(() => {
    setColorFilter('');
    setColorCheck('');
    setMissingColors([]);
  }, [selectedCategory?.id]);

  const handleColorCheck = () => {
    if (!selectedCategory) return;
    
    const wantedColors = colorCheck.split(',').map(c => c.trim());
    const existingColors = new Set(selectedCategory.images.map(img => img.color));
    const missing = wantedColors.filter(color => !existingColors.has(color));
    setMissingColors(missing);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl">Loading collection...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  const totalColors = calculateTotalColors(collection);
  const filteredDinos = collection.filter(dino => 
    dino.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredImages = selectedCategory ? selectedCategory.images
    .filter(img => !colorFilter || img.color.toLowerCase().includes(colorFilter.toLowerCase()))
    .sort((a, b) => {
      const aNum = parseInt(a.color);
      const bNum = parseInt(b.color);
      return isNaN(aNum) || isNaN(bNum) ? 
        a.color.localeCompare(b.color) : 
        aNum - bNum;
    }) : [];

  const uniqueColors = selectedCategory ? new Set(selectedCategory.images.map(img => img.color)) : new Set();
  const colorCount = uniqueColors.size;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Shared Collection
          </h1>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-lg font-semibold text-gray-700">
              Total Colors: {totalColors}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Dino List */}
          <div className="bg-white rounded-lg shadow-lg p-4">
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
            <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {filteredDinos.map((dino) => (
                <div key={dino.id} className="space-y-2">
                  <div
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedDino?.id === dino.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedDino(dino);
                      if (dino.categories.length > 0) {
                        setSelectedCategory(dino.categories[0]);
                      }
                    }}
                  >
                    <div className="font-medium">{dino.name}</div>
                  </div>
                  {selectedDino?.id === dino.id && (
                    <div className="ml-4 space-y-1">
                      {dino.categories.map((category) => (
                        <div
                          key={category.id}
                          className={`p-2 rounded-md cursor-pointer ${
                            selectedCategory?.id === category.id
                              ? 'bg-blue-100'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedCategory(category)}
                        >
                          <span className="text-sm">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Category Details */}
          {selectedDino && selectedCategory && (
            <div className="md:col-span-2 bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedDino.name}</h2>
                  <p className="text-gray-600">
                    {selectedCategory.name} - Colors: {colorCount}/254
                  </p>
                </div>
                <div className="relative w-64">
                  <input
                    type="text"
                    placeholder="Search by Color ID..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={colorFilter}
                    onChange={(e) => setColorFilter(e.target.value)}
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                </div>
              </div>

              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Check colors (e.g., 53,64,84,165)"
                    className="flex-1 px-4 py-2 border rounded-lg"
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
                <ImageGrid images={filteredImages} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};