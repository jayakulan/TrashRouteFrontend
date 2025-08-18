import { createContext, useContext, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoidmlzaG5udTA0IiwiYSI6ImNtZThtcnd0bDBiOGsya3FhbzI4cnVmcDUifQ.7-tKIyQsvzMkXIw3CeU0AA"; // Replace with your actual Mapbox token

const MapboxContext = createContext();

export const useMapbox = () => {
  const context = useContext(MapboxContext);
  if (!context) {
    throw new Error('useMapbox must be used within a MapboxProvider');
  }
  return context;
};

export const MapboxProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set Mapbox access token
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    // Check if Mapbox is available
    if (mapboxgl) {
      setIsLoaded(true);
      setIsLoading(false);
      console.log('Mapbox API loaded successfully');
    } else {
      setLoadError(new Error('Mapbox failed to load'));
      setIsLoading(false);
      console.error('Mapbox API Error: Failed to load');
    }
  }, []);

  const value = {
    isLoaded,
    loadError,
    isLoading,
    accessToken: MAPBOX_ACCESS_TOKEN
  };

  return (
    <MapboxContext.Provider value={value}>
      {children}
    </MapboxContext.Provider>
  );
};
