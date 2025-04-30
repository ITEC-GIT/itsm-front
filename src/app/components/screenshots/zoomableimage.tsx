import React, { useEffect, useRef } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

interface ZoomableImageProps {
  src: string;
  index: number;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, index }) => {
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  useEffect(() => {
    if (!anchorRef.current) return;

    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: anchorRef.current.parentElement!,
      children: "a",
      pswpModule: () => import("photoswipe"),
      initialZoomLevel: "fit",
      secondaryZoomLevel: 2,
      showHideAnimationType: "zoom",
    });

    lightboxRef.current.init();

    return () => {
      lightboxRef.current?.destroy();
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();

    if (e.button === 1 && lightboxRef.current) {
      e.stopPropagation();
      lightboxRef.current.loadAndOpen(index);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <a
        ref={anchorRef}
        href={src}
        data-pswp-width={screenWidth}
        data-pswp-height={screenHeight}
        target="_blank"
        rel="noreferrer"
        onMouseDown={handleMouseDown}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          pointerEvents: "auto",
        }}
      >
        <img
          src={src}
          alt="Zoomable"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            cursor: "zoom-in",
          }}
        />
      </a>
    </div>
  );
};

export { ZoomableImage };
