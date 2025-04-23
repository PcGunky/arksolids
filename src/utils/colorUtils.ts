export const calculateTotalColors = (collection: any[]): number => {
  let totalColors = 0;
  
  collection.forEach(dino => {
    dino.categories.forEach((category: any) => {
      totalColors += category.images.length;
    });
  });

  return totalColors;
};