import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
  src: string;
  fallbackSrc: string;
  className?: string;
  alt: string;
  width: number;
  height: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  className,
  alt,
  width,
  height,
}) => {
  // 1. Instead of a boolean, we track WHICH url failed
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  // 2. We calculate if we should show the fallback during render
  // If the current prop 'src' matches the 'failedUrl', show fallback.
  // If 'src' changes, this automatically becomes false (resetting the error).
  const isError = failedUrl === src;
  const activeSrc = isError ? fallbackSrc : src;

  return (
    <Image
      src={activeSrc}
      className={className}
      alt={alt}
      width={width}
      height={height}
      // 3. On error, we mark THIS specific src as failed
      onError={() => setFailedUrl(src)}
    />
  );
};

export default ImageWithFallback;
