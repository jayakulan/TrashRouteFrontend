const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoidmlzaG5udTA0IiwiYSI6ImNtZThtcnd0bDBiOGsya3FhbzI4cnVmcDUifQ.7-tKIyQsvzMkXIw3CeU0AA";

// Geocoding: Convert address to coordinates
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=lk`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const [lng, lat] = data.features[0].center;
      return { latitude: lat, longitude: lng, address: data.features[0].place_name };
    }
    throw new Error('No results found');
  } catch (error) {
    console.error('Geocoding error:', error);
    throw error;
  }
};

// Reverse geocoding: Convert coordinates to address
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=lk`
    );
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return data.features[0].place_name;
    }
    return 'Address not found';
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return 'Address not found';
  }
};

// Route optimization using Mapbox Directions API
export const optimizeRoute = async (coordinates, wasteType = null) => {
  try {
    if (coordinates.length < 2) {
      return { coordinates: coordinates, distance: 0, duration: 0 };
    }

    // Convert coordinates to the format expected by Mapbox
    const coordinatesString = coordinates
      .map(coord => `${coord.longitude},${coord.latitude}`)
      .join(';');

    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?access_token=${MAPBOX_ACCESS_TOKEN}&geometries=geojson&overview=full&steps=true`
    );
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        coordinates: route.geometry.coordinates.map(coord => ({
          longitude: coord[0],
          latitude: coord[1]
        })),
        distance: route.distance, // in meters
        duration: route.duration, // in seconds
        steps: route.legs[0]?.steps || []
      };
    }
    
    throw new Error('No route found');
  } catch (error) {
    console.error('Route optimization error:', error);
    // Fallback to simple nearest neighbor algorithm
    return fallbackRouteOptimization(coordinates);
  }
};

// Fallback route optimization using nearest neighbor algorithm
const fallbackRouteOptimization = (coordinates) => {
  if (coordinates.length < 2) {
    return { coordinates: coordinates, distance: 0, duration: 0 };
  }

  const visited = Array(coordinates.length).fill(false);
  const optimizedRoute = [coordinates[0]];
  visited[0] = true;

  for (let i = 1; i < coordinates.length; i++) {
    let lastPoint = optimizedRoute[optimizedRoute.length - 1];
    let minDistance = Infinity;
    let nextIndex = -1;

    for (let j = 0; j < coordinates.length; j++) {
      if (!visited[j]) {
        const distance = calculateDistance(lastPoint, coordinates[j]);
        if (distance < minDistance) {
          minDistance = distance;
          nextIndex = j;
        }
      }
    }

    if (nextIndex !== -1) {
      optimizedRoute.push(coordinates[nextIndex]);
      visited[nextIndex] = true;
    }
  }

  // Calculate total distance
  let totalDistance = 0;
  for (let i = 1; i < optimizedRoute.length; i++) {
    totalDistance += calculateDistance(optimizedRoute[i - 1], optimizedRoute[i]);
  }

  return {
    coordinates: optimizedRoute,
    distance: totalDistance,
    duration: totalDistance / 13.89 // Assuming 50 km/h average speed
  };
};

// Calculate distance between two points using Haversine formula
const calculateDistance = (point1, point2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (point1.latitude * Math.PI) / 180;
  const φ2 = (point2.latitude * Math.PI) / 180;
  const Δφ = ((point2.latitude - point1.latitude) * Math.PI) / 180;
  const Δλ = ((point2.longitude - point1.longitude) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

// Get optimized route for waste collection based on waste type
export const getWasteCollectionRoute = async (locations, wasteType) => {
  try {
    // Filter locations by waste type if specified
    let filteredLocations = locations;
    if (wasteType && wasteType !== 'all') {
      filteredLocations = locations.filter(location => 
        location.waste_types && location.waste_types.includes(wasteType)
      );
    }

    if (filteredLocations.length === 0) {
      return { coordinates: [], distance: 0, duration: 0, message: 'No locations found for this waste type' };
    }

    // Extract coordinates
    const coordinates = filteredLocations.map(location => ({
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude)
    }));

    // Get optimized route
    const optimizedRoute = await optimizeRoute(coordinates, wasteType);

    return {
      ...optimizedRoute,
      locations: filteredLocations,
      wasteType: wasteType
    };
  } catch (error) {
    console.error('Waste collection route error:', error);
    throw error;
  }
};

// Get directions between two points
export const getDirections = async (origin, destination) => {
  try {
    const coordinatesString = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`;
    
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinatesString}?access_token=${MAPBOX_ACCESS_TOKEN}&geometries=geojson&overview=full&steps=true`
    );
    
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        coordinates: route.geometry.coordinates.map(coord => ({
          longitude: coord[0],
          latitude: coord[1]
        })),
        distance: route.distance,
        duration: route.duration,
        steps: route.legs[0]?.steps || []
      };
    }
    
    throw new Error('No route found');
  } catch (error) {
    console.error('Directions error:', error);
    throw error;
  }
};










