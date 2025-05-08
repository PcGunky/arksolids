import { create } from 'zustand';
import { Dino, DinoImage, Category } from '../types/dino';
import { supabase } from '../lib/supabase';
import { useAuthStore } from './useAuthStore';
import { deleteImage, deleteUserImages } from '../lib/storage';

interface DinoStore {
  masterList: Dino[];
  collection: Dino[];
  selectedDino: Dino | null;
  setSelectedDino: (dino: Dino | null) => void;
  addToCollection: (dino: Dino) => void;
  removeFromCollection: (id: string) => void;
  addCategory: (dinoId: string, name: string) => void;
  removeCategory: (dinoId: string, categoryId: string) => void;
  addImages: (dinoId: string, categoryId: string, images: DinoImage[]) => void;
  removeImage: (dinoId: string, categoryId: string, imageId: string) => void;
  syncCollection: () => Promise<void>;
  loadCollection: () => Promise<void>;
}

const createMasterList = (): Dino[] => {
  const dinoNames = [
    'Achatina', 'Allosaurus', 'Amargasaurus', 'Andrewsarchus', 'Anglerfish', 'Ankylosaurus', 'Archaeopteryx', 'Argentavis', 'Arthropluera', 'Astrocetus', 'Astrodelphis', 'Baryonyx', 'Basilosaurus', 'Beelzebufo', 'Bloodstalker', 'Brontosaurus', 'Carnotaurus', 'Carbonemys', 'Castoroides', 'Carcharodontosaurus', 'Ceratosaurus', 'Chadlicotherium', 'Cnidaria', 'Compy', 'Cosmo', 'Daeodon', 'Deinosuchus', 'Deinonychus', 'Desmodus', 'Dimetrodon', 'Dimorphodon', 'Dinopithecus', 'Dilophosaur', 'Diplodocus', 'Dire Bear', 'Direwolf', 'Dodo', 'Doedicurus', 'Dunkleosteus', 'Electrophorus', 'Equus', 'Fasolasuchus', 'Featherlight', 'Fenrir', 'Ferox', 'Fjordhawk', 'Gacha', 'Gasbags', 'Gigantopithecus', 'Gigantoraptor', 'Giganotosaurus', 'Glowtail', 'Griffin', 'Hesperornis', 'Ichthyornis', 'Ichthyosaurus', 'Iguanodon', 'Kairuku', 'Kaprosuchus', 'Karkinos', 'Kentrosaurus', 'Leedsichthys', 'Liopleurodon', 'Lymantria', 'Lystrosaurus', 'Maewing', 'Magmasaur', 'Mammoth', 'Managarmr', 'Mantis', 'Megachelon', 'Megalosaurus', 'Megalania', 'Megaloceros', 'Megalodon', 'Meganeura', 'Megatherium', 'Mesopithecus', 'Microraptor', 'Morellatops', 'Moschops', 'Mosasaurus', 'Oasisaur', 'Onyc', 'Oviraptor', 'Ovis', 'Pachy', 'Pachyrhinosaurus', 'Paraceratherium', 'Parasaur', 'Pegomastax', 'Pelagornis', 'Phiomia', 'Phoenix', 'Piranha', 'Plesiosaurus', 'Procoptodon', 'Pteranodon', 'Pulmonoscorpius', 'Purlovia', 'Pyromane', 'Quetzal', 'Raptor', 'Ravager', 'Reaper King', 'Rex', 'Rhyniognatha', 'Rock Drake', 'Roll Rat', 'Sabertooth', 'Sabertooth Salmon', 'Sarco', 'Shadowmane', 'Shastasaurus', 'Shinehorn', 'Sinomacrops', 'Snow Owl', 'Spino', 'Stegosaurus', 'Tapejara', 'Therizinosaur', 'Thorny Dragon', 'Thylacoleo', 'Titanoboa', 'Titanosaur', 'Troodon', 'Tropeognathus', 'Tusoteuthis', 'Velonasaur', 'Voidwyrm', 'Woolly Rhino', 'Wyvern', 'Xiphactinus', 'YiLing', 'Yeti', 'Yutyrannus'
  ];

  return dinoNames.map((name, index) => ({
    id: (index + 1).toString(),
    name,
    categories: [],
    addedAt: new Date()
  }));
};

export const useDinoStore = create<DinoStore>((set, get) => ({
  masterList: createMasterList(),
  collection: [],
  selectedDino: null,
  setSelectedDino: (dino) => set({ selectedDino: dino }),

  addToCollection: async (dino) => {
    const newDino = { ...dino, categories: [] };
    set((state) => ({
      collection: [...state.collection, newDino],
    }));
    await get().syncCollection();
  },

  removeFromCollection: async (id) => {
    const dino = get().collection.find(d => d.id === id);
    if (dino) {
      // Delete all images in all categories
      for (const category of dino.categories) {
        for (const image of category.images) {
          try {
            await deleteImage(image.url);
          } catch (error) {
            console.error('Error deleting image:', error);
          }
        }
      }
    }

    set((state) => ({
      collection: state.collection.filter((d) => d.id !== id),
      selectedDino: state.selectedDino?.id === id ? null : state.selectedDino,
    }));
    await get().syncCollection();
  },

  addCategory: async (dinoId, name) => {
    const newCategory = {
      id: Math.random().toString(36).substring(7),
      name,
      images: [],
      createdAt: new Date(),
    };

    set((state) => ({
      collection: state.collection.map((dino) =>
        dino.id === dinoId
          ? {
              ...dino,
              categories: [...dino.categories, newCategory],
            }
          : dino
      ),
    }));
    await get().syncCollection();
  },

  removeCategory: async (dinoId, categoryId) => {
    const dino = get().collection.find(d => d.id === dinoId);
    const category = dino?.categories.find(c => c.id === categoryId);
    
    if (category) {
      // Delete all images in the category
      for (const image of category.images) {
        try {
          await deleteImage(image.url);
        } catch (error) {
          console.error('Error deleting image:', error);
        }
      }
    }

    set((state) => ({
      collection: state.collection.map((dino) =>
        dino.id === dinoId
          ? {
              ...dino,
              categories: dino.categories.filter((cat) => cat.id !== categoryId),
            }
          : dino
      ),
    }));
    await get().syncCollection();
  },

  addImages: async (dinoId, categoryId, images) => {
    set((state) => ({
      collection: state.collection.map((dino) =>
        dino.id === dinoId
          ? {
              ...dino,
              categories: dino.categories.map((cat) =>
                cat.id === categoryId
                  ? {
                      ...cat,
                      images: [...cat.images, ...images],
                    }
                  : cat
              ),
            }
          : dino
      ),
    }));
    await get().syncCollection();
  },

  removeImage: async (dinoId, categoryId, imageId) => {
    const dino = get().collection.find(d => d.id === dinoId);
    const category = dino?.categories.find(c => c.id === categoryId);
    const image = category?.images.find(i => i.id === imageId);

    if (image) {
      try {
        // First update the local state immediately
        set((state) => ({
          collection: state.collection.map((dino) =>
            dino.id === dinoId
              ? {
                  ...dino,
                  categories: dino.categories.map((cat) =>
                    cat.id === categoryId
                      ? {
                          ...cat,
                          images: cat.images.filter((img) => img.id !== imageId),
                        }
                      : cat
                  ),
                }
              : dino
          ),
        }));

        // Then delete the image from storage
        await deleteImage(image.url);
        
        // Finally sync with the database
        await get().syncCollection();
      } catch (error) {
        console.error('Error deleting image:', error);
        // Revert the state if the deletion failed
        await get().loadCollection();
      }
    }
  },

  syncCollection: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { collection } = get();
    await supabase
      .from('collections')
      .upsert({
        user_id: user.id,
        data: collection,
      }, {
        onConflict: 'user_id'
      });
  },

  loadCollection: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const { data, error } = await supabase
      .from('collections')
      .select('data')
      .eq('user_id', user.id)
      .single();

    if (!error && data?.data) {
      set({ collection: data.data });
    } else {
      // If no collection exists, initialize with empty array
      set({ collection: [] });
    }
  },
}));