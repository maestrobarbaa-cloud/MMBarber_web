"use client";

import Image, { ImageProps } from "next/image";

/**
 * A wrapper around next/image that provides a sensible default `sizes` 
 * attribute for mobile optimization if none is provided.
 * 
 * NOTE: Dynamic quality calculation was removed because it caused
 * massive double-fetching of images on mobile data connections.
 * Next.js automatically scales image dimensions via the `sizes` prop.
 */
export default function OptimizedImage(props: ImageProps) {
  // We provide a fallback sizes attribute if none is provided, 
  // so next/image knows it doesn't need to load 4K images on mobile.
  // Next.js warns if you use `sizes` without `fill`, so we only default it if fill is true,
  // or if they didn't provide width/height.
  const hasExplicitSize = !!props.width && !!props.height;
  const isFill = !!props.fill;
  
  const defaultSizes = isFill || !hasExplicitSize
    ? "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    : undefined;

  return (
    <Image 
      {...props} 
      sizes={props.sizes || defaultSizes} 
      quality={props.quality || 75} 
    />
  );
}
