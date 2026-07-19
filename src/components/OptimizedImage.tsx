import React, { useState, useCallback } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  srcSet?: string;
  priority?: boolean;
}

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='267' viewBox='0 0 200 267'%3E%3Crect fill='%231B1814' width='200' height='267'/%3E%3Ctext fill='%236B6358' font-family='system-ui' font-size='12' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  sizes,
  srcSet,
  priority = false,
  className = '',
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError) {
      setImgSrc(PLACEHOLDER_SVG);
      setHasError(true);
    }
  }, [hasError]);

  const webpSrc = imgSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');

  return (
    <picture>
      {!hasError && <source srcSet={srcSet || webpSrc} type="image/webp" />}
      <img
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        srcSet={hasError ? undefined : srcSet}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onError={handleError}
        onLoad={() => setIsLoaded(true)}
        className={`${className} transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </picture>
  );
};
