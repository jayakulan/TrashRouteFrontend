import { useEffect } from 'react';

const NoCache = () => {
  useEffect(() => {
    // Set cache control headers via meta tags
    const metaTags = [
      { name: 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
      { name: 'Pragma', content: 'no-cache' },
      { name: 'Expires', content: '0' }
    ];

    // Add meta tags to head
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.name = tag.name;
      meta.content = tag.content;
      document.head.appendChild(meta);
    });

    // Cleanup function to remove meta tags when component unmounts
    return () => {
      metaTags.forEach(tag => {
        const existingMeta = document.querySelector(`meta[name="${tag.name}"]`);
        if (existingMeta) {
          existingMeta.remove();
        }
      });
    };
  }, []);

  return null;
};

export default NoCache; 