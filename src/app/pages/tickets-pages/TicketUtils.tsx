import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {string} from "yup";
import ReactQuill, {Quill} from "react-quill";
import { md5 } from 'js-md5';
import {PostReplyImages} from "../../config/ApiCalls.ts";
import {ImageUploadResponse} from "../../types/TicketTypes.ts";
import {isEqual} from "lodash";
import 'react-quill/dist/quill.snow.css';

//https://quilljs.com/playground/react replace with this
export const decodeHtml = (encodedHtml: string): string => {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = encodedHtml;
    return textArea.value;
};
const generateMD5Hash = (base64String: string): string => {
    return md5(base64String);
};

export const getMaxWords = (encodedHtml: string, maxWords: number = 40): string => {
    // Step 1: Decode HTML entities
    const decodedHtml = decodeHtml(encodedHtml);

    // Step 2: Create a temporary DOM element to parse HTML
    const tempElement = document.createElement("div");
    tempElement.innerHTML = decodedHtml;

    // Step 3: Normalize line breaks (<br>) into actual spaces
    const brs = tempElement.querySelectorAll("br");
    brs.forEach(br => br.replaceWith(" "));  // Replace <br> with a space

    // Step 4: Extract all visible text
    const fullText = tempElement.textContent?.trim() || "";

    // Step 5: Extract words using regex
    const words = fullText.match(/\b\w+\b/g) || [];

    // Step 6: Return up to maxWords
    return words.slice(0, maxWords).join(" ");
};
import QuillType from "quill";

export const HeadlessQuillViewer2: React.FC<{ content: string }> = ({ content }) => {
    const quillRef = useRef<HTMLDivElement>(null);
    const quillInstanceRef = useRef<QuillType | null>(null);

    const decodeHtml = (encodedHtml: string): string => {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = encodedHtml;
        return textArea.value;
    };

    useEffect(() => {
        if (quillRef.current && !quillInstanceRef.current) {
            quillInstanceRef.current = new QuillType(quillRef.current, {
                readOnly: true,
                theme: "bubble",
                modules: { toolbar: false },
            });
        }

        return () => {
            if (quillInstanceRef.current) {
                quillInstanceRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (quillRef.current && quillInstanceRef.current) {
            try {
                const rawHtml:any = decodeHtml(content);
                const delta = quillInstanceRef.current.clipboard.convert(rawHtml);

                const currentContent = quillInstanceRef.current.getContents();
                if (!isEqual(currentContent, delta)) {
                    quillInstanceRef.current.setContents(delta);
                }

                if (quillRef.current) {
                    quillRef.current.style.minHeight = "unset";
                }
            } catch (error) {
                console.error("Failed to process Quill content:", error);
            }
        }
    }, [content]);

    return <div ref={quillRef} className="quill-content quill-content-important" />;
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
interface CustomQuillProps {
    value: string;
    onChange: (value: string) => void;
    setImageMapOnAccumulated: React.Dispatch<React.SetStateAction<{ base64: string; url: string,counter:number,hash:string }[]>>;
    setImageClipboardMap: React.Dispatch<React.SetStateAction<{ base64: string; url: string,counter:number,hash:string }[]>>;
    setCountOfPasted: React.Dispatch<React.SetStateAction<number>>;
    countOfPasted: number;
    setEditorContent: React.Dispatch<React.SetStateAction<string>>;
    editorContent: string;
    modules: any;
}
export const CustomQuillImageClipboard = forwardRef<ReactQuill, CustomQuillProps>(
    ({ value, onChange, setImageMapOnAccumulated, setImageClipboardMap,setCountOfPasted,countOfPasted,setEditorContent,editorContent, ...props }, ref) => {
        const quillRef = useRef<ReactQuill | null>(null);

        // Expose the Quill instance via ref
        useImperativeHandle(ref, () => quillRef.current as ReactQuill);
        // const [imageMap, setImageMap] = useState<Record<string, string>>({}); // Store { base64: url } mappings
        // const [imageMapOnAccumulated, setimageMapOnAccumulated] = useState<{ base64: string; url: string }[]>([]); // Store [{ base64, url }] mappings
        // const [imageClipboardMap, setImageClipboardMap] = useState<{ base64: string; url: string }[]>([]); // Store [{ base64, url }] mappings
        ``
        // useEffect(() => {
        //     if(imageMapOnAccumulated!=undefined && imageMapOnAccumulated.length>0){
        //         const x=0;
        //         const xtr=imageClipboardMap;
        //         const z=0;
        //
        //     }
        // }, [imageMapOnAccumulated,imageClipboardMap]);
        const handleContentChange = (value: string, delta: any, source: string) => {
            setEditorContent(value);

            // Get all image elements in the editor
            const images = Array.from(quillRef.current?.getEditor().root.querySelectorAll("img") || []);


            const updatedImageMap = images.map((img: any, index: number) => ({
                base64: img.src,
                url: "", // Assuming you want the URL to be empty initially
                counter: index + 1, // Counter starts from 1 (index + 1)
                hash:generateMD5Hash(img.src)
            }));

            // Set the image map with the new array
            setImageMapOnAccumulated(updatedImageMap);
        };

        useEffect(() => {
            if (!quillRef.current) return;
            const quill = quillRef.current.getEditor();




            // Add keydown event listener

            // Handle image pasting from clipboard
            const handlePaste = async (event: ClipboardEvent) => {
                if (!event.clipboardData) return;

                // Extract pasted images from clipboard
                const items = event.clipboardData.items;
                for (const item of items) {
                    if (item.type.startsWith("image")) {
                        event.preventDefault(); // Prevent Quill's default paste behavior

                        const file = item.getAsFile();
                        if (file) {
                            // Convert file to base64 temporarily for immediate rendering
                            const reader = new FileReader();
                            reader.onload = async (e) => {
                                const base64 = e.target?.result as string;

                                // Insert base64 image so it appears immediately
                                const range = quill.getSelection();
                                if (range) {
                                    quill.insertEmbed(range.index, "image", base64);
                                }

                                // Upload the image to the server
                                const formData = new FormData();
                                formData.append("file", file);
                                console.log(formData)
                                const data: ImageUploadResponse = await PostReplyImages(formData, "reply") as ImageUploadResponse;
                                const imageUrl = data.url; // URL of the uploaded image
                                // setCountOfPasted((prev) => prev + 1);                             // Add the base64 and URL to the imageMap
                                // setImageClipboardMap((prev) => [...prev, { base64, url: imageUrl,counter:countOfPasted+1 }]);
                                const base64_md5_hash=generateMD5Hash(base64);
                                setCountOfPasted((prev) => {
                                    const newCount = prev + 1;

                                    setImageClipboardMap((prevMap) => [
                                        ...prevMap,
                                        { base64, url: imageUrl, counter: newCount,hash:base64_md5_hash }
                                    ]);

                                    return newCount;
                                });
                            };

                            reader.readAsDataURL(file); // Read the file as base64
                        }
                    }
                }
            };

            // Listen for the paste event
            quill.root.addEventListener("paste", handlePaste);

            // Cleanup event listeners
            return () => {
                quill.root.removeEventListener("paste", handlePaste);
            };
        }, []);

        return <ReactQuill ref={quillRef} {...props}          value={editorContent}
                           onChange={handleContentChange}/>;
    });
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

    return <ReactQuill ref={quillRef} {...props}  />;
});