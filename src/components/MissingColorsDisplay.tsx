import React from 'react';

interface MissingColorsDisplayProps {
  colors: (number | string)[];
}

export const MissingColorsDisplay: React.FC<MissingColorsDisplayProps> = ({ colors }) => {
  if (colors.length === 0) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <h3 className="text-yellow-800 font-medium mb-2">Missing Colors:</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <span
            key={color}
            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
          >
            {color.toString()}
          </span>
        ))}
      </div>
    </div>
  );
};