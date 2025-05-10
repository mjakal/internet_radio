import React, { useEffect, useState } from 'react';

interface MarqueeTextProps {
  text: string;
}

const MarqueeText: React.FC<MarqueeTextProps> = ({ text }) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = React.useRef<HTMLSpanElement>(null);
  const containerRef = React.useRef<HTMLSpanElement>(null);

  // Check if text is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;

        const isTextOverflowing = textWidth > containerWidth;
        setIsOverflowing(isTextOverflowing);
      }
    };

    checkOverflow();
  }, [text]);

  return (
    <span className="flex w-full overflow-hidden whitespace-nowrap" ref={containerRef}>
      <span
        className={`${isOverflowing ? 'animation-marquee' : ''} inline-block whitespace-nowrap`}
        ref={textRef}
      >
        {text}
      </span>
      {/* another copy of the text so it visually wraps around */}
      {isOverflowing && (
        <span className="animation-marquee ml-4 inline-block whitespace-nowrap">{text}</span>
      )}
    </span>
  );
};

export default MarqueeText;
