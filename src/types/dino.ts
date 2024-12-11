export interface DinoImage {
  id: string;
  url: string;
  color: string;
}

export interface Category {
  id: string;
  name: string;
  images: DinoImage[];
  createdAt: Date;
}

export interface Dino {
  id: string;
  name: string;
  categories: Category[];
  addedAt: Date;
  isEditing?: boolean;
}

export interface ColorFilter {
  min: number;
  max: number;
}