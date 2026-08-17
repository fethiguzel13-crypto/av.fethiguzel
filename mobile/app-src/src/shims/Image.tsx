import React from 'react';

/**
 * `next/image` karşılığı. Çevrimdışı uygulamada optimizasyon sunucusu yok;
 * düz <img> yeterli, `loading="lazy"` ile aynı davranış korunur.
 */
type Props = Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> & {
  src: string | { src: string };
  width?: number | string;
  height?: number | string;
  priority?: boolean;
  fill?: boolean;
  quality?: number;
  placeholder?: string;
};

export default function Image({
  src,
  alt = '',
  priority,
  fill,
  quality: _quality,
  placeholder: _placeholder,
  style,
  ...rest
}: Props) {
  const resolved = typeof src === 'string' ? src : src?.src;
  return (
    <img
      {...rest}
      src={resolved}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      style={fill ? { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...style } : style}
    />
  );
}
