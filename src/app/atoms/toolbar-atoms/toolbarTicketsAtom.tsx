import { atom } from 'jotai';


// Atom to store the current page specified by the user in the 'toolbarTickets' for the all Tickets page
export const toolbarTicketsNavigationAtom = atom(1);
toolbarTicketsNavigationAtom.debugLabel = "toolbarTicketsNavigationAtom";

// Atom to store the current search written by the user in the 'toolbarTickets' for the all Tickets page
export const toolbarTicketsSearchAtom = atom('');
toolbarTicketsSearchAtom.debugLabel = "toolbarTicketsSearchAtom";



export const toolbarTicketsFrontFiltersAtom = atom({
    status: '',
    urgency: '',
    priority: '',
    type: '',
    requester: '',
    branch: '',
    assignee:''
});
toolbarTicketsFrontFiltersAtom.debugLabel = "toolbarTicketsFrontFiltersAtom";
