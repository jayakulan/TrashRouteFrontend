import { createContext, useContext, useState, useEffect } from 'react';
import { LoadScript } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = "AIzaSyA5iEKgAwrJWVkCMAsD7_IilJ0YSVf_VGk";

// Static libraries array to prevent performance warnings
const GOOGLE_MAPS_LIBRARIES = ['places'];

const GoogleMapsContext = createContext();

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (!context) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};

export const GoogleMapsProvider = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoaded(true);
    setIsLoading(false);
    console.log('Google Maps API loaded successfully');
  };

  const handleError = (error) => {
    setLoadError(error);
    setIsLoading(false);
    console.error('Google Maps API Error:', error);
  };

  // Check if Google Maps is already loaded
  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && 
          window.google.maps && 
          window.google.maps.Map && 
          window.google.maps.Polyline &&
          window.google.maps.Marker &&
          window.google.maps.LatLngBounds &&
          window.google.maps.SymbolPath &&
          window.google.maps.places) {
        setIsLoaded(true);
        setIsLoading(false);
        console.log('Google Maps API already loaded');
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkGoogleMapsLoaded()) {
      return;
    }

    // Set a timeout to prevent infinite loading
    const timeoutTimer = setTimeout(() => {
      if (!isLoaded) {
        setIsLoading(false);
        console.warn('Google Maps API loading timeout');
      }
    }, 15000); // 15 second timeout

    return () => {
      clearTimeout(timeoutTimer);
    };
  }, [isLoaded]);

  const value = {
    isLoaded,
    loadError,
    isLoading,
    apiKey: GOOGLE_MAPS_API_KEY
  };

  return (
    <GoogleMapsContext.Provider value={value}>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        onLoad={handleLoad}
        onError={handleError}
        libraries={GOOGLE_MAPS_LIBRARIES}
      >
        {children}
      </LoadScript>
    </GoogleMapsContext.Provider>
  );
}; 