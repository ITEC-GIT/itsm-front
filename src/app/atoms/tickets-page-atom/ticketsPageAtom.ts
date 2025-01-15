// src/state/authAtoms.ts
import { atom } from 'jotai';


// Atom to store the total tickets specified by the user in the 'toolbarTickets' for the all Tickets page
export const totalTicketsNavigationAtom = atom(1);
totalTicketsNavigationAtom.debugLabel = "ticketsTotalTicketsNavigationAtom";

// Atom to store the total tickets in the tickets page we got from query
export const totalTicketsAtom = atom(0);
totalTicketsAtom.debugLabel = "totalTicketsAtom";

// Atom to store the total tickets in the tickets page we got from query
export const fetchedTicketsAtom = atom<any[]>([]);
fetchedTicketsAtom.debugLabel = "fetchedTicketsAtom";
// Atom to store the flag indicating whether tickets have been fetched
export const isTicketsFetchedAtom = atom(false);
isTicketsFetchedAtom.debugLabel = "isTicketsFetchedAtom";

// Atom to store the flag for fetching more pages
export const fetchMorePagesFlagAtom = atom(false);
fetchMorePagesFlagAtom.debugLabel = "fetchMorePagesFlagAtom";

// New atom for total count
export const totalCountAtom = atom(0);
totalCountAtom.debugLabel = "totalCountAtom";


// New atom for Max ID
export const maxIdAtom = atom(0);
maxIdAtom.debugLabel = "maxIdAtom";

// atom to store the tickets across pages in ticket page
export const ticketsAtom = atom<any[]>([]);
ticketsAtom.debugLabel = "ticketsAtom";


export const maxTotalAtom = atom(0);
maxTotalAtom.debugLabel = "maxTotalAtom";


export const pinnedTicketsIdsAtom = atom<string[]>([]);
pinnedTicketsIdsAtom.debugLabel = "pinnedTicketsIdsAtom";
