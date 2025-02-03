import { atom } from 'jotai';


// Atom to store the current page specified by the user in the 'toolbarTickets' for the all Tickets page
export const toolbarTicketsNavigationAtom = atom(1);
toolbarTicketsNavigationAtom.debugLabel = "toolbarTicketsNavigationAtom";

// Atom to store the current search written by the user in the 'toolbarTickets' for the all Tickets page
export const toolbarTicketsSearchAtom = atom('');
toolbarTicketsSearchAtom.debugLabel = "toolbarTicketsSearchAtom";

// new tickets available atom
export const toolbarNewTicketsAtom = atom(false);
toolbarNewTicketsAtom.debugLabel = "toolbarNewTicketsAtom";


export const toolbarTicketsFrontFiltersAtom = atom({
    status: { value: '', label: '' },
    urgency: { value: '', label: '' },
    priority: { value: '', label: '' },
    type: { value: '', label: '' },
    requester: { value: '', label: '' },
    branch: { value: '', label: '' },
    assignee: { value: '', label: '' }
});
toolbarTicketsFrontFiltersAtom.debugLabel = "toolbarTicketsFrontFiltersAtom";

export const toolbarTicketsBackendFiltersAtom = atom({
    status: { value: '', label: '' },
    urgency: { value: '', label: '' },
    priority: { value: '', label: '' },
    type: { value: '', label: '' },
    requester: { value: '', label: '' },
    branch: { value: '', label: '' },
    assignee: { value: '', label: '' },
    from: { value: '', label: '' },
    to: { value: '', label: '' },
  });
toolbarTicketsBackendFiltersAtom.debugLabel = "toolbarTicketsBackendFiltersAtom";
