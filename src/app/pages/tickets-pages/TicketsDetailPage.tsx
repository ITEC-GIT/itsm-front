import React, {forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState} from 'react'
import parse from 'html-react-parser';
import {useNavigate, useLocation} from 'react-router-dom'
import TicketCard from "../../../_metronic/layout/components/custom-components/Card.tsx";
import {useAtom, useAtomValue} from "jotai";
import {isCurrentUserMasterAtom} from "../../atoms/app-routes-global-atoms/approutesAtoms.ts";
import {Assignee} from "../../types/TicketTypes.ts";
import {Content} from "../../../_metronic/layout/components/content";
import {Editor} from "@tinymce/tinymce-react";
import clsx from "clsx";
import ReactQuill, {Quill} from "react-quill";
import {string} from "yup";
import {CustomQuill, CustomQuillImageClipboard, getMaxWords, HeadlessQuillViewer} from "./TicketUtils.tsx";
import Cookies from "js-cookie";
import {mastersAtom} from "../../atoms/app-routes-global-atoms/globalFetchedAtoms.ts";
import {
    bulkDeleteImages,
    GetTicketWithReplies,
    GetUsersAndAreas,
    SendRepliesAsync,
    GetTicketAttachments
} from "../../config/ApiCalls.ts";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {HtmlContentViewer, HtmlReplyViewer} from "../../components/custom-components/HtmlViewer.tsx";

import 'react-quill/dist/quill.snow.css';
import Attachments from "./Attachments.tsx";
import AssigneeAvatars from "../../components/custom-components/AssigneeAvatars.tsx";
import AnimatedRouteWrapper from "../../routing/AnimatedRouteWrapper.tsx";


const TicketsDetailPage: React.FC = () => {
    const location = useLocation()
    // const {ticket} = location.state || {}
    const [ticket, setTicket] = useState<any>(location.state?.ticket || null);

    useEffect(() => {
        console.log(ticket)

    }, []);
    const isCurrentUserMaster = useAtomValue(
        isCurrentUserMasterAtom
    );
    const quillRef = useRef<ReactQuill | null>(null);
    const [editorHtml, setEditorHtml] = useState("");
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [ticketReplies, setTicketReplies] = useState([]);
    const assignees: Assignee[] = ticket?.assignees || [];
    const [htmlContent, setHtmlContent] = useState("");

    const queryClient = useQueryClient(); // Get the query client

    const {
        data: ticketWithReplies,
        error,
        isLoading:repliesLoading,
    } = useQuery({
        queryKey: ["GetTicketWithReplies", ticket.id], // Ensure you have a unique query key
        queryFn: () => GetTicketWithReplies(ticket.id), // Wrap in an anonymous function
        refetchOnWindowFocus: false, // Refetch when window regains focus
        refetchInterval: 180000, // Refetch every 3 minutes (in milliseconds)
        enabled: true, // Start fetching as soon as the component is mounted
        retry: true,
    });
    const {
        data: ticketAttachments,
        error: errorAttachments,
        isLoading: isLoadingAttachments,
    } = useQuery({
        queryKey: ["GetTicketAttachments", ticket.id], // Ensure you have a unique query key
        queryFn: () => GetTicketAttachments(ticket.id), // Wrap in an anonymous function
        refetchOnWindowFocus: false, // Refetch when window regains focus
        refetchInterval: 180000, // Refetch every 3 minutes (in milliseconds)
        enabled: true, // Start fetching as soon as the component is mounted
        retry: true,
    });
    const [ticketAttachmentsData, setTicketAttachmentsData] = useState<any>([]);
    useEffect(() => {
        const x = 0;
        if (ticketAttachments == undefined || ticketAttachments.data == undefined) {
            return;
        }
        setTicketAttachmentsData(ticketAttachments.data.data)
        console.log(ticketAttachments)
    }, [ticketAttachments]);
    useEffect(() => {
        const x = 0;
        if (ticketWithReplies == undefined || ticketWithReplies.data == undefined) {
            return;
        }
        const ticketRepliesReturned = ticketWithReplies.data.replies
        if (ticketRepliesReturned.length > 0) {
            const sortedData = ticketRepliesReturned.sort((a: any, b: any) => {
                return new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime();
            });
            setTicketReplies(sortedData)

            setReplyCount(ticketRepliesReturned.length);
            setActiveTab("messages");
        } else {
            setReplyCount(0);

            setActiveTab("ticket-body");
        }
        console.log(ticketWithReplies)
    }, [ticketWithReplies]);
    const navigate = useNavigate()

    function getUserNameFromCookie() {
        const match = Cookies.get('username');
        return match ? match : null;
    }

    const userName = getUserNameFromCookie();
    const [reply, setReply] = useState("");
    const [showReply, setShowReply] = useState(true);
    const [isITReply, setIsITReply] = useState(true);
    //83 and 82 from tickets
    const [activeTab, setActiveTab] = useState("ticket-body");
    const [replyCount, setReplyCount] = useState(0);
    // useEffect(() => {
    //     const ticketReplies = JSON.parse(ticket?.replies || "[]");
    //     if (ticketReplies.length > 0) {
    //         setReplyCount(ticketReplies.length);
    //         setActiveTab("messages");
    //     } else {
    //         setReplyCount(0);
    //
    //         setActiveTab("ticket-body");
    //     }
    // }, [ticket]);
    const otherAssignees = assignees.filter(
        assignee => assignee.name !== userName && Object.values(assignee).some(value => value !== null)
    );
    const [imageMapOnAccumulated, setImageMapOnAccumulated] = useState<{
        base64: string;
        url: string,
        counter: number,
        hash: string
    }[]>([]);
    const [imageClipboardMap, setImageClipboardMap] = useState<{
        base64: string;
        url: string,
        counter: number,
        hash: string
    }[]>([]);
    useEffect(() => {
        if (imageMapOnAccumulated != undefined && imageMapOnAccumulated.length > 0) {
            const x = 0;
            const xtr = imageClipboardMap;
            const z = 0;

        }
    }, [imageMapOnAccumulated, imageClipboardMap]);
    const [countOfPasted, setCountOfPasted] = useState(0);
    const [editorContent, setEditorContent] = useState('');
    const [editorModifiedContent, setEditorModifiedContent] = useState('');

    const handleSendClick = async () => {
        if(editorContent.trim() === '') {
            return
        }
        const deletedImages = imageClipboardMap.filter(item =>
            !imageMapOnAccumulated.some(existingItem => existingItem.hash === item.hash)
        );

        const urlsToDelete = deletedImages.map(item => item.url);
        if (urlsToDelete.length > 0) {
            bulkDeleteImages(urlsToDelete);

        }

        const updatedImageMap = imageMapOnAccumulated.map(item => {
            // Find the corresponding item in imageClipboardMap
            const matchingItem = imageClipboardMap.find(clipItem => clipItem.hash === item.hash);

            // If a matching item is found, append the URL from imageClipboardMap to imageMapOnAccumulated
            if (matchingItem) {
                return {...item, url: matchingItem.url}; // Add the URL to the item
            }

            return item; // If no match found, return the item as is
        });

        let updatedEditorContent = editorContent;

        const parseHtml = (html: string, imageMap: { base64: string; url: string }[]) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Get all <img> tags
            const imgTags = doc.querySelectorAll('img');

            imgTags.forEach(img => {
                const src = img.getAttribute('src');
                if (src && src.startsWith('data:image')) {
                    // const match = imageMap.find(item => src.startsWith(item.base64.substring(0, 30))); // Match using first 30 chars
                    const match = imageMap.find(item => src.startsWith(item.base64.substring(0, 30)) && src === item.base64);

                    if (match) {
                        img.setAttribute('src', match.url); // Replace base64 with URL
                    }
                }
            });

            return doc.body.innerHTML; // Serialize modified HTML back to string
        };

        updatedImageMap.forEach(item => {
            updatedEditorContent = parseHtml(editorContent, updatedImageMap);

        });
        // Update the state with the modified editor content
        setEditorModifiedContent(updatedEditorContent);
        const response = await SendRepliesAsync(ticket.id, updatedEditorContent);
        queryClient.invalidateQueries({queryKey: ["GetTicketWithReplies", ticket.id]}); // Refetch data

        setImageMapOnAccumulated([]);
        setImageClipboardMap([]);
        setEditorContent('');
        setShowReply(true);
    };

    const [expandedReplies, setExpandedReplies] = useState<{ [key: number]: boolean }>({});

// Expand on click, but don't collapse
    const expandReply = (id: number) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [id]: true, // Ensure it stays expanded once clicked
        }));
    };

// Collapse only when clicking "Show less"
    const collapseReply = (id: number) => {
        setExpandedReplies((prev) => ({
            ...prev,
            [id]: false,
        }));
    };
    const calculateTimeAgo = (date: string): string => {
        const now = new Date();
        const providedDate = new Date(date);
        const diffInMs = now.getTime() - providedDate.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours === 0) {
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return `${diffInMinutes} minutes ago`;
            } else {
                return `${diffInHours} hours ago`;
            }
        } else {
            return `${diffInDays} days ago`;
        }
    };
    // const [overflowStates, setOverflowStates] = useState<{ [key: string]: boolean }>({});
    //
    // const handleOverflowChange = (id: string, isOverflowing: boolean) => {
    //     setOverflowStates(prevState => ({
    //         ...prevState,
    //         [id]: isOverflowing,
    //     }));
    // };
    const [overflowStates, setOverflowStates] = useState<{ [key: string]: boolean }>({});

    const handleOverflowDetected = useCallback((id: string, isOverflowing: boolean) => {
        setOverflowStates(prev => {
            if (prev[id] === isOverflowing) return prev; // Prevent unnecessary state updates
            return { ...prev, [id]: isOverflowing };
        });
    }, []);

    const [overLimitMap, setOverLimitMap] = useState<Record<string, boolean>>({});

    if (!ticket) {
        return <div>No ticket data available</div>
    }


    const testReplyData = `   <p>Hi,</p>
                                        <p>Our sales team is using AcmeWidgets to manage tasks and our team also uses
                                            accounting software to manage business operations, we now need a workflow
                                            where in we need to integrate the two apps so that we can access the
                                            Accounting related tasks on AcmeWidgets.</p>
                                        <p>Thanks,</p>
                                        <p>Matt</p>`
    const decodeHtml = (encodedHtml: string): string => {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = encodedHtml;
        return textArea.value;
    };

    const isEmptyAssignees = assignees.every(
        (assignee:any) => assignee.id === null && assignee.name === null && assignee.avatar === null
    );
    const assigneesFiltered: Assignee[] = isEmptyAssignees ? [] : assignees;
    return (
        <>
            <AnimatedRouteWrapper>

            <Content>
                <button className="btn btn-sm btn-light"
                        onClick={() => navigate('/tickets', {state: {from: 'details'}})}>
                    <i className="fa fa-arrow-left me-2"></i> Back
                </button>
                <TicketCard
                    key={ticket.id}
                    id={ticket.id}
                    status={ticket.status_label}
                    date={ticket.date}
                    title={ticket.name}
                    description={
                        getMaxWords(ticket.content) ||
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
                    assignees={assigneesFiltered}
                    isDetailsPage={true}
                />


                <div className="updates-container">
                    <h1 className="updates-title">Ticket View</h1>
                    <div className="tabs">
                        <button
                            className={`tab-item ${activeTab === "ticket-body" ? "active" : ""}`}
                            onClick={() => setActiveTab("ticket-body")}
                        >
                            Ticket Body
                        </button>
                        <button
                            className={`tab-item ${activeTab === "messages" ? "active" : ""}`}
                            onClick={() => setActiveTab("messages")}
                        >
                            Messages ({replyCount})
                        </button>
                        <button
                            className={`tab-item ${activeTab === "attachments" ? "active" : ""}`}
                            onClick={() => setActiveTab("attachments")}
                        >
                            Attachments ({ticketAttachmentsData.length})
                        </button>
                    </div>
                    <div className="tab-content">
                        {activeTab === "ticket-body" && (
                            <div>
                                <HtmlContentViewer htmlContent={decodeHtml(ticket.content)} truncate={false}/>


                            </div>
                        )}

                        {activeTab === "messages" && (
                            <div className='d-flex flex-column gap-3'>
                                {/* Iterate over the array of tickets */}
                                {repliesLoading ? (
                                    <div className="spinner-wrapper">
                                        <div
                                            className="spinner-border spinner-loading-data"
                                            role="status"
                                        >
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : (
                                ticketReplies?.map((reply: any, index: number) => {
                                    const isExpanded = expandedReplies[reply.id] || index === 0; // First reply is always expanded

                                    return (

                                        <div key={reply.id}
                                             className={`reply-card message-card ${reply.users_id === 2 ? "it-reply" : "user-ticket"}`}
                                             onClick={() => expandReply(reply.id)}>
                                            <div className="card-body">
                                                <div className="header d-flex align-items-center">
                                                    {/* Avatar Circle */}
                                                    <div className="avatar-circle me-2">
                                                        {reply.user_name?.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        {/* User Name */}
                                                        <h6 className="name mb-0">{reply.user_name}</h6>
                                                        {/* Time Ago */}
                                                        <p className="time text-muted small">{calculateTimeAgo(reply.date)}</p>
                                                    </div>
                                                </div>
                                                {/* Message Content */}

                                                <div className="message-content mt-3 d-flex"
                                                     style={{position: 'relative'}}>
                                                    <HtmlReplyViewer id={reply.id}
                                                                     htmlContent={decodeHtml(reply.content)}
                                                                     truncate={!expandedReplies[reply.id] && index !== 0}
                                                                     onOverflowDetected={handleOverflowDetected} // Pass the callback

                                                    />

                                                </div>
                                                {/* Footer */}
                                                <div
                                                    className="footer mt-3  border-top d-flex justify-content-between">
                                                    <div className="d-flex gap-2 align-content-center">

                                                        <AssigneeAvatars assignees={otherAssignees}/>
                                                    </div>
                                                    {/* Show More Button */}
                                                    {isExpanded && (
                                                        <button
                                                            className="btn btn-link p-0 mt-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation(); // Prevent expanding when clicking "Show less"
                                                                collapseReply(reply.id);
                                                            }}
                                                        >
                                                            Show less
                                                        </button>
                                                    )}
                                                    {!isExpanded && overflowStates[reply.id] ? (<button
                                                        className="btn btn-link p-0 mt-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // Prevent expanding when clicking "Show less"
                                                            expandReply(reply.id);
                                                        }}
                                                    >
                                                        Show more
                                                    </button>) : ""}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }))}
                            </div>
                        )}
                        {activeTab === "attachments" && (
                            <div>

                                <Attachments attachments={ticketAttachmentsData}/>

                            </div>
                        )}
                    </div>
                </div>
            </Content>


            <div className="relative-container">
                {!showReply && (
                    <div className="offcanvas custom-offcanvas show d-flex">
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
                            <CustomQuillImageClipboard value={reply} onChange={setReply} ref={quillRef}

                                                       setImageMapOnAccumulated={setImageMapOnAccumulated}
                                                       setImageClipboardMap={setImageClipboardMap}
                                                       setCountOfPasted={setCountOfPasted}
                                                       countOfPasted={countOfPasted}
                                                       setEditorContent={setEditorContent}
                                                       editorContent={editorContent}
                                                       modules={{
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

                        </div>
                        <div className="  d-flex gap-3">
                            <div className="cancel-send d-flex align-items-between">
                                <button className="btn btn-sm btn-primary mt-2"
                                        onClick={() => setShowReply(true)}>Cancel
                                </button>
                                <button className="btn btn-sm btn-primary mt-2"
                                        onClick={handleSendClick}>Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {showReply && (
                    <div className="reply-footer-controls-content align-self-end d-flex">

                        <div className="d-flex">
                            <button
                                className="btn btn-sm btn-primary btn-reply"
                                onClick={() => setShowReply(!showReply)}
                            >
                                Reply
                            </button>
                        </div>


                    </div>)}
            </div>
                </AnimatedRouteWrapper>



        </>
    )
}
export default TicketsDetailPage;