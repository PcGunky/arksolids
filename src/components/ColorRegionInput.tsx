import React from 'react';

interface ColorRegionInputProps {
  regionId: number;
  value: string;
  onChange: (value: string) => void;
}

export const ColorRegionInput: React.FC<ColorRegionInputProps> = ({
  regionId,
  value,
  onChange,
}) => {
  return (
    <div className="flex flex-col">
      <label className="text-sm text-gray-600 mb-1">Region {regionId}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="253,24,25,56"
        className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );
};