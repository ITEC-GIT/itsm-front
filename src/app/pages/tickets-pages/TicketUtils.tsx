import React, {forwardRef, useEffect, useImperativeHandle, useRef} from "react";
import {string} from "yup";
import ReactQuill, {Quill} from "react-quill";
import "react-quill/dist/quill.snow.css";

export const decodeHtml = (encodedHtml: string): string => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = encodedHtml;
    return textArea.value;
};

export const getMaxWords = (encodedHtml: string, maxWords: number = 40): string => {
    // Step 1: Decode HTML entities
    const decodedHtml = decodeHtml(encodedHtml);

    // Step 2: Create a temporary DOM element to parse HTML
    const tempElement = document.createElement("div");
    tempElement.innerHTML = decodedHtml;

    // Step 3: Extract text from headings and paragraphs
    const headingsParagraphs = Array.from(tempElement.querySelectorAll("h1, h2, h3, h4, h5, h6, p"))
        .map(el => el.textContent?.trim() || "")
        .join(", ");

    // Step 4: Extract words from headings and paragraphs
    let words = headingsParagraphs.match(/\b\w+\b/g) || [];

    // Step 5: If no words found, extract from lists
    if (words.length === 0) {
        const lists = Array.from(tempElement.querySelectorAll("ul, ol, li"))
            .map(el => el.textContent?.trim() || "")
            .join(", ");
        words = lists.match(/\b\w+\b/g) || [];
    }

    // Step 6: Return up to maxWords
    return words.slice(0, maxWords).join(" ");
};


export const HeadlessQuillViewer: React.FC<{ content: string }> = ({content}) => {
    const quillRef = useRef<HTMLDivElement>(null);
    const quillInstanceRef = useRef<any>(null);

    const decodeHtml = (encodedHtml: string): string => {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = encodedHtml;
        return textArea.value;
    };

    useEffect(() => {
        if (quillRef.current) {
            // Initialize Quill only once
            if (!quillInstanceRef.current) {
                quillInstanceRef.current = new Quill(quillRef.current, {
                    readOnly: true,
                    theme: "bubble", // Minimal UI
                    modules: {toolbar: false}, // No toolbar for viewing
                });
            }

            const quillInstance = quillInstanceRef.current;
            const rawHtml =decodeHtml(content);
            // Use Quill's clipboard module to paste content correctly
            const delta = quillInstance.clipboard.convert(rawHtml);
            quillInstance.setContents(delta);
            setTimeout(() => {
                if (quillRef.current) {
                    quillRef.current.style.minHeight = "unset"; // Removes min-height
                }
            }, 0);
        }
    }, [content]);

    return <div ref={quillRef} className="quill-content quill-content-important  " style={{ overflow: 'hidden',minHeight:'unset' }} />;
};

export const CustomQuill = forwardRef<ReactQuill, any>((props, ref) => {
    const quillRef = useRef<ReactQuill | null>(null);

    // Expose the Quill instance via ref
    useImperativeHandle(ref, () => quillRef.current as ReactQuill);

    useEffect(() => {
        if (!quillRef.current) return;
        const quill = quillRef.current.getEditor();

        const handlePaste = (event: ClipboardEvent) => {
            if (!event.clipboardData) return;

            const items = event.clipboardData.items;
            for (const item of items) {
                if (item.type.startsWith("image")) {
                    event.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64Image = e.target?.result as string;
                            const range = quill.getSelection();
                            quill.insertEmbed(range?.index || 0, "image", base64Image);
                        };
                        reader.readAsDataURL(file);
                    }
                }
            }
        };

        quill.root.addEventListener("paste", handlePaste);
        return () => quill.root.removeEventListener("paste", handlePaste);
    }, []);

    return <ReactQuill ref={quillRef} {...props} />;
});