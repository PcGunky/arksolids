import { supabase } from './supabase';

export const uploadImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError, data } = await supabase.storage
    .from('dino-images')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('dino-images')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (url: string): Promise<void> => {
  try {
    // Extract the file path from the URL
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const filePath = pathParts.slice(pathParts.indexOf('dino-images') + 1).join('/');

    const { error } = await supabase.storage
      .from('dino-images')
      .remove([filePath]);

    if (error) {
      console.error('Storage delete error:', error);
    }
  } catch (error) {
    console.error('Error deleting image:', error);
  }
};

export const deleteUserImages = async (userId: string): Promise<void> => {
  try {
    const { data, error } = await supabase.storage
      .from('dino-images')
      .list(userId);

    if (error) {
      throw error;
    }

    if (data && data.length > 0) {
      const filePaths = data.map(file => `${userId}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('dino-images')
        .remove(filePaths);

      if (deleteError) {
        console.error('Storage bulk delete error:', deleteError);
      }
    }
  } catch (error) {
    console.error('Error deleting user images:', error);
  }
};