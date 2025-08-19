import React from 'react';

class MapboxErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('Mapbox Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Mapbox Error</h3>
            <p className="text-gray-500 mb-4">
              There was an issue with Mapbox. Please refresh the page to try again.
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-[#3a5f46] text-white px-4 py-2 rounded hover:bg-[#2e4d3a]"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapboxErrorBoundary;










