import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import TicketCard from "../../../_metronic/layout/components/custom-components/Card.tsx";
import {useAtom, useAtomValue} from "jotai";
import {isCurrentUserMasterAtom} from "../../atoms/app-routes-global-atoms/approutesAtoms.ts";
import {Assignee} from "../../types/TicketTypes.ts";
import {Content} from "../../../_metronic/layout/components/content";
import {Editor} from "@tinymce/tinymce-react";
import clsx from "clsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CustomQuill = forwardRef<ReactQuill, any>((props, ref) => {
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
const TicketsDetailPage: React.FC = () => {
    const location = useLocation()
    const {ticket} = location.state || {}
    const isCurrentUserMaster = useAtomValue(
        isCurrentUserMasterAtom
    );
    const quillRef = useRef<ReactQuill | null>(null);

    const assignees: Assignee[] = JSON.parse(ticket?.assignees || "[]");

    const navigate = useNavigate()
    const [reply, setReply] = useState("");
    const [showReply, setShowReply] = useState(true);
    const [activeTab, setActiveTab] = useState("messages");
    const [isITReply, setIsITReply] = useState(true);
    if (!ticket) {
        return <div>No ticket data available</div>
    }


    return (
        <>
            <Content>
                <TicketCard
                    key={ticket.id}
                    id={ticket.id}
                    status={ticket.status_label}
                    date={ticket.date}
                    title={ticket.name}
                    description={
                        ticket.content ||
                        "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                    }
                    assignedTo={{
                        name: ticket.users_recipient,
                    }} // Placeholder avatar
                    raisedBy={{
                        name: ticket.users_recipient,
                        initials: ticket?.users_recipient?.charAt(0),
                    }}
                    priority={ticket.priority_label}
                    type={ticket.type_label}
                    urgency={ticket.urgency_label}
                    lastUpdate={ticket.date_mod}
                    isStarred={ticket.starred} // Pass the pinned status
                    isCurrentUserMaster={isCurrentUserMaster}
                    assignees={assignees}
                    isDetailsPage={true}
                />

                <button className="btn btn-sm btn-light"
                        onClick={() => navigate('/tickets', {state: {from: 'details'}})}>
                    Back
                </button>
                <div className="updates-container">
                    <h1 className="updates-title">Updates</h1>
                    <div className="tabs">
                        <button
                            className={`tab-item ${activeTab === "messages" ? "active" : ""}`}
                            onClick={() => setActiveTab("messages")}
                        >
                            Messages (6)
                        </button>
                        <button
                            className={`tab-item ${activeTab === "attachments" ? "active" : ""}`}
                            onClick={() => setActiveTab("attachments")}
                        >
                            Attachments (2)
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === "messages" && (
                            <div className={`card message-card ${isITReply ? "it-reply" : "user-ticket"}`}>
                                <div className="card-body">
                                    <div className="header d-flex align-items-center">
                                        <div className="avatar-circle me-2">M</div>
                                        <div>
                                            <h6 className="name mb-0">Matt</h6>
                                            <p className="time text-muted small">1 hour ago</p>
                                        </div>
                                    </div>
                                    <div className="message-content mt-3">
                                        <p>Hi,</p>
                                        <p>Our sales team is using AcmeWidgets to manage tasks and our team also uses
                                            accounting software to manage business operations, we now need a workflow
                                            where in we need to integrate the two apps so that we can access the
                                            Accounting related tasks on AcmeWidgets.</p>
                                        <p>Thanks,</p>
                                        <p>Matt</p>
                                    </div>
                                    <div
                                        className="footer text-muted small mt-3 pt-2 border-top d-flex justify-content-between">
                                        <span>Other Recipients <span>none</span></span>
                                        <button className="btn btn-link p-0">Show more</button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === "attachments" && (
                            <div>
                                <h5>Attachments</h5>
                                <p>Here are your attachments...</p>
                            </div>
                        )}
                    </div>
                </div>
            </Content>

            {!showReply && (
                <div className="relative-container">
                    <div className="offcanvas custom-offcanvas show">
                        <div className="offcanvas-header" style={{paddingBottom: "5px"}}> {/* Reduce padding */}
                            <h5 className="offcanvas-title">Write a Reply</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setShowReply(false)}
                            ></button>
                        </div>
                        <div className="offcanvas-body" style={{paddingTop: "5px"}}> {/* Reduce padding */}
                            {/* Quill Editor */}
                            <CustomQuill value={reply} onChange={setReply} ref={quillRef} modules={{
                                toolbar: [
                                    [{header: [1, 2, 3, false]}], // Headings
                                    ["bold", "italic", "underline", "strike"], // Text Formatting
                                    [{list: "ordered"}, {list: "bullet"}], // Lists
                                    ["blockquote", "code-block"], // Blockquote & Code
                                    ["link", "image"], // Links & Images
                                    [{align: []}], // Text Alignment
                                    ["clean"], // Clear Formatting
                                ]
                            }}/>
                            {/* Buttons */}
                            {/*<div className="mt-3 d-flex justify-content-start align-content-between">*/}
                            {/*    <button className="btn btn-secondary" onClick={() => setShowReply(true)}>Cancel</button>*/}
                            {/*    <button className="btn btn-primary" onClick={() => alert(`Reply Sent: ${reply}`)}>Send*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </div>
                    </div>
                </div>
            )}
            {showReply && (
                <div className="reply-footer-controls d-flex gap-3">
                    <button
                        className="btn btn-sm btn-primary btn-reply"
                        onClick={() => setShowReply(!showReply)}
                    >
                        Reply
                    </button>
                </div>
            )}
            {!showReply && (

                <div className="reply-footer-controls-content  d-flex gap-3">
                    <div className="cancel-send d-flex align-items-between">
                    <button className="btn btn-secondary mt-2" onClick={() => setShowReply(true)}>Cancel</button>
                    <button className="btn btn-primary mt-2" onClick={() => alert(`Reply Sent: ${reply}`)}>Send</button></div>
                </div>)}


        </>
    )
}
export default TicketsDetailPage