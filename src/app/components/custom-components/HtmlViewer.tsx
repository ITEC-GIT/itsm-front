import React, {useEffect, useRef, useState} from "react";
import DOMPurify from "dompurify";
import parse, { DOMNode, Element } from "html-react-parser";
import ZoomableImage from "./ImageViewer.tsx";

// type HtmlViewerProps = {
//     htmlContent: string;
// };
const ImageWithDimensions: React.FC<{ src: string }> = ({ src }) => {
    const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);

    useEffect(() => {
        const img = new Image();
        img.src = src;

        img.onload = () => {
            setDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
    }, [src]);

    if (!dimensions) {
        return <div>Loading image...</div>; // Temporary placeholder
    }

    return <ZoomableImage src={src} width={dimensions.width} height={dimensions.height} />;
};
interface HtmlViewerProps {
    htmlContent: string;
    truncate: boolean;
    onOverflowChange?: (id: string, isOverflowing: boolean) => void; // Notify the parent with the ID and overflow state
}
const HtmlContentViewer: React.FC<HtmlViewerProps> = ({htmlContent, truncate }) => {
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the content container
    const transform = (node: DOMNode) => {
        if (node instanceof Element && node.name === "img") {
            const src = node.attribs.src || "";
            return <ImageWithDimensions src={src} />;
        }
    };

    return (
        <div   ref={contentRef} className={`prose max-w-none ${truncate ? "truncate-text" : ""}`}>
            {parse(sanitizedHtml, { replace: transform })}
        </div>
    );
};
interface HtmlReplyViewerProps {
    htmlContent: string;
    truncate: boolean;
    id: string;
    onOverflowDetected?: (id: string, isOverflowing: boolean) => void;

}
const HtmlReplyViewer: React.FC<HtmlReplyViewerProps> = ({ htmlContent, truncate, id, onOverflowDetected }) => {
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the content container
    const transform = (node: DOMNode) => {
        if (node instanceof Element && node.name === "img") {
            const src = node.attribs.src || "";
            return <ImageWithDimensions src={src} />;
        }
    };
    const [isOverflowing, setIsOverflowing] = useState(false);


    useEffect(() => {
        if (contentRef.current) {
            const lineHeight = parseFloat(getComputedStyle(contentRef.current).lineHeight);
            const maxHeight = 5 * lineHeight;
            const newIsOverflowing = contentRef.current.scrollHeight > maxHeight;

            if (newIsOverflowing !== isOverflowing) {
                setIsOverflowing(newIsOverflowing);
                if (onOverflowDetected) {
                    onOverflowDetected(id, newIsOverflowing);
                }
            }
        }
    }, [htmlContent, id]); // Removed onOverflowDetected from dependencies

    return (
        <div   ref={contentRef} className={`prose max-w-none ${truncate ? "truncate-text" : ""}`}>
            {parse(sanitizedHtml, { replace: transform })}
        </div>
    );
};

export  {HtmlReplyViewer,HtmlContentViewer};