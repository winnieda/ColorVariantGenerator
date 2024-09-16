import React, { createContext, useState, useEffect } from 'react';

export const PaletteContext = createContext();

export const PaletteProvider = ({ children }) => {
  const initialState = {
    colors: [{ id: 0, hex: '', r: '', g: '', b: '' }],
    generatedColorsVisible: false,
    generatedPalettes: [],
    errorMessage: '',
    colorGroupingError: false,
    varianceError: false,
    numToGenerateError: false,
    originalColors: null, // Colors of current variant palettes
    variance: '',
    numToGenerate: '',
    colorGrouping: ''
    // Images are no longer here because they take up
    // too much space, lesson learned
  };

  const [paletteState, setPaletteState] = useState(initialState);

  useEffect(() => {
    const savedState = localStorage.getItem('paletteState');
    if (savedState) {
      setPaletteState(JSON.parse(savedState));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('paletteState', JSON.stringify(paletteState));
  }, [paletteState]);

  useEffect(() => {
    const handlePageRefresh = () => {
      localStorage.removeItem('paletteState');
    };

    window.addEventListener('beforeunload', handlePageRefresh);
    return () => {
      window.removeEventListener('beforeunload', handlePageRefresh);
    };
  }, []);

  return (
    <PaletteContext.Provider value={{ paletteState, setPaletteState }}>
      {children}
    </PaletteContext.Provider>
  );
};
