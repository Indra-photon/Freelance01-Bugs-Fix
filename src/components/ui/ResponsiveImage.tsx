import React, { useState, useEffect } from 'react';
import { getImageUrlByKey } from '@/services/images/services/urlService';
import { useIsMobile } from '@/hooks/use-mobile';

interface ResponsiveImageProps {
  dynamicKey: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  priority?: boolean;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  dynamicKey,
  alt,
  className = '',
  loading = 'lazy',
  priority = false
}) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        const deviceKey = isMobile
          ? dynamicKey.endsWith('-mobile') ? dynamicKey : `${dynamicKey}-mobile`
          : dynamicKey;
        const url = await getImageUrlByKey(deviceKey);
        
        if (url && url !== '/placeholder.svg') {
          setImageUrl(url);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading image:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [dynamicKey, isMobile]);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400">Image not available</span>
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={`${className} ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}
      loading={loading}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding={priority ? 'sync' : 'async'}
      onLoad={() => setIsLoading(false)}
    />
  );
};

export default ResponsiveImage;
