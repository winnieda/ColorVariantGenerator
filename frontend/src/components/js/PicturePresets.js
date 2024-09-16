import React from 'react';
import { useNavigate } from 'react-router-dom';
import PicturePresetComponent from './PicturePresetComponent';
import '../css/PicturePresets.css';

const hexToRgb = (hex) => {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
};

// Convert preset colors into format that CreatePalettePage expects
const formatColorsForPreset = (colors) => {
  return colors.map((color, index) => {
    const { r, g, b } = hexToRgb(color);
    return { id: index, hex: color, r, g, b };
  });
};

// Convert image blob to base64 data URL
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Convert image URL to Blob object, then convert to base64
const createImageBlob = async (imageUrl) => {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const base64DataUrl = await blobToBase64(blob); // Convert Blob to base64
  return base64DataUrl;
};

const PicturePresets = () => {
  const navigate = useNavigate();

  // PLACEHOLDER, will replace with SQL later
  const presets = [
    {
        image: '/images/presets/blastoise.webp',
        colors: [
            '#769ec3', '#d7e2f4', '#677398', '#e3f1ec', '#aecbc1', '#fffcc2',
            '#c3c194', '#9c6231', '#804519', '#f0cb98', '#b69b7f'
        ],
        colorGrouping: "[1-3], [4, 5], [6, 7], [8, 9], [10, 11]",
    },
    {
        image: '/images/presets/espeon.webp',
        colors: [
            '#d4b4d8', '#b37da0', '#6e4a79', '#382331', '#fabada',
            '#8a0f00', '#e92243', '#351882', '#4f3997'
        ],
        colorGrouping: "[1-4], [5-7], [8, 9]",
    },    
    {
        image: '/images/presets/electabuzz.webp',
        colors: ['#f5c800', '#c38920', '#e5efed', '#afc6be'],
        colorGrouping: "[1, 2], [3, 4]",
    },
    {
        image: '/images/presets/growlithe.webp',
        colors: ['#b56032', '#c4742f', '#f1e6bc', '#cdb098', '#211e1e', '#353939'],
        colorGrouping: "[1, 2], [3, 4], [5, 6]",
    },
  ];

  const handlePresetClick = async (preset) => {
    const formattedColors = formatColorsForPreset(preset.colors);
    const base64Image = await createImageBlob(preset.image);

    // Set a flag in sessionStorage before navigating
    sessionStorage.setItem('navigatedFromPreset', 'true');

    navigate('/create-palette', {
      state: {
        uploadedImage: base64Image,
        colors: formattedColors,
        colorGrouping: preset.colorGrouping,
      },
    });
  };

  return (
    <div className="picture-presets-container">
      <h2 className="picture-presets-title">Picture Presets Page</h2>
      <p className="picture-presets-description">
        Click on a preset to load it into the palette creator. This is a work in progress and will feature a full database of images soon.
      </p>
      <div className="picture-presets-grid">
        {presets.map((preset, index) => (
          <PicturePresetComponent
            key={index}
            image={preset.image}
            colors={preset.colors}
            colorGrouping={preset.colorGrouping}
            onClick={() => handlePresetClick(preset)}
          />
        ))}
      </div>
    </div>
  );
};

export default PicturePresets;
