import React, { useEffect, useRef, useState } from "react";
import PhotoSwipeLightbox from "photoswipe/lightbox";
import "photoswipe/style.css";

interface ZoomableImageProps {
    src: string;
    width: number;
    height: number;
}

const MAX_SIZE = 640; // Define max width and height

const ZoomableImage: React.FC<ZoomableImageProps> = ({ src, width, height }) => {
    const imageRef = useRef<HTMLAnchorElement>(null);
    const [scaledWidth, setScaledWidth] = useState(width);
    const [scaledHeight, setScaledHeight] = useState(height);

    useEffect(() => {
        if (!imageRef.current) return;

        const lightbox = new PhotoSwipeLightbox({
            gallery: imageRef.current.parentElement!,
            children: "a",
            pswpModule: () => import("photoswipe"),
            initialZoomLevel: "fit", // Open zoomed
            secondaryZoomLevel: 2, // Allow zooming in further
        });

        lightbox.init();

        return () => {
            lightbox.destroy();
        };
    }, []);

    // Scale image while maintaining aspect ratio if it's larger than MAX_SIZE
    useEffect(() => {
        if (width > MAX_SIZE || height > MAX_SIZE) {
            const aspectRatio = width / height;
            if (width > height) {
                setScaledWidth(MAX_SIZE);
                setScaledHeight(Math.round(MAX_SIZE / aspectRatio));
            } else {
                setScaledHeight(MAX_SIZE);
                setScaledWidth(Math.round(MAX_SIZE * aspectRatio));
            }
        }
    }, [width, height]);

    return (
        <div style={{ display: "inline-block", width: scaledWidth, height: scaledHeight }}>
            <a
                ref={imageRef}
                href={src} // Opens the full-size image
                data-pswp-width={width} // Original width for zoom
                data-pswp-height={height} // Original height for zoom
                target="_blank"
                rel="noreferrer"
                style={{
                    display: "block",
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                }}
            >
                <img
                    src={src}
                    alt="Zoomable"
                    width={scaledWidth}
                    height={scaledHeight}
                    style={{
                        display: "block",
                        objectFit: "contain",
                        cursor: "pointer",
                        width: "100%", // Ensures the img takes full width of <a>
                        height: "100%", // Ensures the img takes full height of <a>
                    }}
                />
            </a>
        </div>
    );
};

export default ZoomableImage;
