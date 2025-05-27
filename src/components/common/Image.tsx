import { useEffect, useCallback, useState } from 'react';
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
  const [imgSrc, setImgSrc] = useState<string>(src ? src : fallbackSrc);

  useEffect(() => {
    setImgSrc((prevState) => {
      if (prevState === src) return prevState;

      return src;
    });
  }, [src]);

  const handleError = useCallback(() => {
    setImgSrc((prevState) => {
      if (prevState === fallbackSrc) return prevState;

      return fallbackSrc;
    });
  }, [fallbackSrc]);

  return (
    <Image
      src={imgSrc}
      className={className}
      alt={alt}
      width={width}
      height={height}
      onError={handleError}
    />
  );
};

export default ImageWithFallback;
