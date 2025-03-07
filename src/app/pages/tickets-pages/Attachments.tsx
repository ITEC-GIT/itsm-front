import React from "react";
import {fetchAndOpenFile} from "../../config/ApiCalls.ts";



type Attachment = {
    id: number;
    name: string;
    mime: string;
    filepath:string;
    links: { rel: string; href: string }[];
};

type Props = {
    attachments: Attachment[];
};


const getIconClass = (mime: string) => {
    if(mime ===null) return "fas fa-file";
    if (mime.includes("pdf")) return "fas fa-file-pdf";
    if (mime.includes("image")) return "fas fa-file-image";
    if (mime.includes("word")) return "fas fa-file-word";
    if (mime.includes("csv")) return "fas fa-file-csv";
    return "fas fa-file";
};
const Attachments: React.FC<Props> = ({ attachments }) => {
    const getDocumentItemLink = (links: { rel: string; href: string }[]) => {
        const link = links.find((l) => l.rel === "Document_Item");
        return link ? link.href : "#";
    };
    const attachmentFiles = import.meta.env.VITE_APP_ITSM_GLPI_API_BASE_ATTACHMENT_FILES;

    return (
        <div className="attachments-container">
            {attachments.map((attachment) => (
                <div
                    key={attachment.id}
                    className="card attachment-card shadow-lg"
                    onClick={() => window.open((`${attachmentFiles}/${attachment.filepath}`), "_blank")}
                >
                    <div className="card-body text-center">
                        <i className={`${getIconClass(attachment.mime)} fa-3x attachment-icon`}></i>
                        <h5 className="card-title mt-2">{attachment.name}</h5>
                        {/*<p className="card-text">Type: {attachment.mime}</p>*/}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Attachments;
