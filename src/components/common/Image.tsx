import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  fallbackSrc,
  alt,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState<string>(src && typeof src === 'string' ? src : fallbackSrc);

  const handleError = () => {
    setImgSrc((prevState) => {
      if (prevState === fallbackSrc) return prevState;

      return fallbackSrc;
    });
  };

  return <Image {...props} src={imgSrc} alt={alt} onError={handleError} />;
};

export default ImageWithFallback;
