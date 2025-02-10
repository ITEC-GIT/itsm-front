import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react'
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
                            <div>
                                <h5>Messages</h5>
                                <p>Here are your messages...</p>
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