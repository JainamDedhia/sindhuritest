// lib/imageOptimizer.ts
/**
 * Optimizes Cloudinary image URLs with transformations
 * This dramatically improves loading performance
 */

export interface ImageOptions {
  width?: number;
  height?: number;
  quality?: 'auto' | 'low' | 'eco' | 'good' | 'best';
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
}

export const optimizeCloudinaryUrl = (
  url: string,
  options: ImageOptions = {}
): string => {
  // Default options for best performance
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Check if it's a Cloudinary URL
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Build transformation string
  const transforms: string[] = [];
  
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  transforms.push(`q_${quality}`); // Auto quality
  transforms.push(`f_${format}`);  // Auto format (WebP when supported)
  if (crop) transforms.push(`c_${crop}`);

  const transformString = transforms.join(',');

  // Insert transformation into URL
  return url.replace('/upload/', `/upload/${transformString}/`);
};

/**
 * Get optimized image for different screen sizes
 */
export const getResponsiveImage = (url: string) => ({
  mobile: optimizeCloudinaryUrl(url, { width: 400 }),
  tablet: optimizeCloudinaryUrl(url, { width: 768 }),
  desktop: optimizeCloudinaryUrl(url, { width: 1200 }),
  thumbnail: optimizeCloudinaryUrl(url, { width: 150, quality: 'eco' }),
});

/**
 * Generate blur placeholder for images
 */
export const getBlurDataURL = (url: string): string => {
  return optimizeCloudinaryUrl(url, {
    width: 10,
    quality: 'low',
    format: 'jpg'
  });
};