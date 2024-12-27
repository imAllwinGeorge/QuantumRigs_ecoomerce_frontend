import React, { useState, useRef, useCallback } from 'react';

const ImageMagnifier = ({ imageSrc, alt }) => {
  const [showZoom, setShowZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);
  const ZOOM_LEVEL = 2.5;

  const handleMouseMove = useCallback((e) => {
    if (!imageRef.current) return;

    const { left, top, width, height } = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const xPercent = (mouseX / width) * 100;
    const yPercent = (mouseY / height) * 100;

    setZoomPosition({ x: xPercent, y: yPercent });
  }, []);

  return (
    <div className="image-magnifier-container">
      <div className="main-image-container">
        <img
          ref={imageRef}
          src={imageSrc}
          alt={alt}
          className="main-image"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        />
      </div>
      
      {showZoom && (
        <div 
          className="zoom-container"
          style={{
            backgroundImage: `url(${imageSrc})`,
            backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
            backgroundSize: `${ZOOM_LEVEL * 100}% ${ZOOM_LEVEL * 100}%`
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;

