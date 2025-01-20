import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toolbarTicketsNavigationAtom, toolbarTicketsSearchAtom } from '../../atoms/toolbar-atoms/toolbarTicketsAtom';
import { totalTicketsAtom, fetchedTicketsAtom, isTicketsFetchedAtom, fetchMorePagesFlagAtom, maxIdAtom, ticketsAtom, maxTotalAtom, pinnedTicketsIdsAtom } from '../../atoms/tickets-page-atom/ticketsPageAtom';
import { toolbarTicketsFrontFiltersAtom } from '../../atoms/toolbar-atoms/toolbarTicketsAtom'
import { userAtom } from "../../atoms/auth-atoms/authAtom";

import { PageTitleTickets } from '../../../_metronic/layout/components/toolbar/page-title/PageTitleTickets'
import { GetTicketsViewById } from '../../config/ApiCalls'
import TicketCard from '../../../_metronic/layout/components/custom-components/Card'
import { Content } from '../../../_metronic/layout/components/content'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { addPinnedTicketId, removePinnedTicketId, getPinnedTicketIds } from '../../../utils/indexDB'

const TicketsPage: React.FC = () => {

  // const currentPage = useAtomValue(toolbarTicketsNavigationAtom)
  const [currentTicketsPage, setCurrentTicketsPage] = useState<number>(1)
  const toolbarSearch = useAtomValue(toolbarTicketsSearchAtom);
  const navigate = useNavigate()
  const location = useLocation();
  // const [ticketsFetched, setTicketsFetched] = useAtom(fetchedTicketsAtom)
  const [tickets, setTickets] = useAtom(ticketsAtom)
  const [frontFilter, setFrontFilter] = useAtom(toolbarTicketsFrontFiltersAtom)

  const [ticketsSearchFiltered, setTicketsSearchFiltered] = useState<any[]>([])

  const setIsTicketsFetch = useSetAtom(isTicketsFetchedAtom)
  const fetchMorePagesFlag = useAtomValue(fetchMorePagesFlagAtom)
  const setFetchMorePagesFlag = useSetAtom(fetchMorePagesFlagAtom)
  const [totalPagesFetched, setTotalPagesFetched] = useState<number>(1)

  const setTotalTickets = useSetAtom(totalTicketsAtom)// Set the total tickets per query of fetched in this instance only
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [maxTotalTickets, setMaxTotalTickets] = useAtom(maxTotalAtom)
  const [paginatedTickets, setPaginatedTickets] = useState<any[]>([])

  const [pinnedTicketIds, setPinnedTicketIds] = useAtom(pinnedTicketsIdsAtom) // State to track pinned ticket IDs
  const [sortedTickets, setSortedTickets] = useState<any[]>([])
  const usrAtom = useAtomValue(userAtom);

  // useEffect(() => {
  //   if (location.state?.from === "details" && ticketsFetched.length > 0) {
  //     console.log("Navigated back from details; skipping fetch");
  //     return;
  //   }
  //   const fetchTickets = async () => {
  //     try {
  //       const response = await GetTicketsViewById(1, '0-100', 'desc')
  //       setTicketsFetched(response.data)
  //       setTotalTickets(response.data.length) // Set the total tickets

  //     } catch (error) {
  //       console.error('Error fetching tickets:', error)
  //     }
  //   }

  //   fetchTickets()
  // }, [])


  const handlePinTicket = async (id: string) => {
    setPinnedTicketIds((prevPinned) => {
      if (prevPinned.includes(id)) {
        removePinnedTicketId(id)
        return prevPinned.filter((ticketId) => ticketId !== id)
      } else {
        addPinnedTicketId(id)
        return [...prevPinned, id]
      }
    })
  }
  const handleStarringTicket = async (id: string) => {
    return
  }
  const x =
    useEffect(() => {
      if (location.state?.from === 'details' && tickets.length > 0) {
        console.log('Navigated back from details; skipping fetch')
        setIsDataLoading(false)

        return
      }
      const fetchTickets = async () => {
        try {
          const response = await GetTicketsViewById('0-5', 'desc')
          const responseData = response.data.data
          setMaxTotalTickets(response.data.totalcount)
          setTickets(responseData)
          setTotalTickets(responseData.length)
          setIsTicketsFetch(true)
          setIsDataLoading(false)

        } catch (error) {
          console.error('Error fetching tickets:', error)
        }
      }

      fetchTickets()
    }, [location.state, setTickets, setTotalTickets, setIsTicketsFetch,])

  const getLowestId = (tickets: any[]) => {
    if (tickets.length === 0) return null
    return Math.min(...tickets.map(ticket => ticket.id))
  }
  useEffect(() => {
    if (fetchMorePagesFlag) {
      const fetchMorePages = async () => {
        try {
          const countOfPages = totalPagesFetched + 1

          const lowestId = getLowestId(tickets)
          if (lowestId !== null) {
            // the error is caused by duplicate objects , so its getting confused
            // const response = await GetTicketsViewById(lowestId-1, '0-3', 'desc')

            const response = await GetTicketsViewById('0-5', 'desc', lowestId)
            const responseData = response.data.data
            if (responseData.length > 0) {
              const updatedTickets = [...tickets, ...responseData];

              setTickets(updatedTickets)
              setTotalTickets(prevTotal => prevTotal + responseData.length)
              setIsDataLoading(false)

            }
            setTotalPagesFetched(countOfPages)
            setFetchMorePagesFlag(false)
          }
        } catch (error) {
          console.error('Error fetching more tickets:', error)
          setFetchMorePagesFlag(false) // Reset the flag in case of error

        }
      }
      setIsDataLoading(true)

      fetchMorePages()
    }
  }, [tickets, fetchMorePagesFlag, totalPagesFetched, setTickets, setTotalTickets, setFetchMorePagesFlag])

  const handleTicketClick = (ticket: any) => {
    navigate(`/ticket/${ticket.id}`, { state: { ticket } })
  }


  const changePriority = (id: number) => {
    console.log(`Change priority for ticket ID: ${id}`)
  }

  const pinTicket = (id: number) => {
    console.log(`Pin ticket ID: ${id}`)
  }

  const replyToTicket = (id: number) => {
    console.log(`Reply to ticket ID: ${id}`)
  }

  const ticketsPerPage = 6 // tickets to show in 1 page

  const updatePaginatedTickets = () => {
    const startIdx = (currentTicketsPage - 1) * ticketsPerPage;
    const endIdx = currentTicketsPage * ticketsPerPage;

    if (toolbarSearch.trim()) {
      setPaginatedTickets(ticketsSearchFiltered.slice(startIdx, endIdx));
    } else if (frontFilter) {
      setPaginatedTickets(filteredTickets.slice(startIdx, endIdx));
    } else {
      setPaginatedTickets(tickets.slice(startIdx, endIdx));
    }
  };
  useEffect(() => {
    updatePaginatedTickets();
  }, [currentTicketsPage, ticketsSearchFiltered, frontFilter]);
  useEffect(() => {
    setCurrentTicketsPage(1);
  }, [toolbarSearch, frontFilter]);
  // const updatePaginatedTickets = () => {
  //   const startIdx = (currentTicketsPage - 1) * ticketsPerPage;
  //   const endIdx = currentTicketsPage * ticketsPerPage;
  //   setPaginatedTickets(filteredTickets.slice(startIdx, endIdx));
  // };
  useEffect(() => {
    updatePaginatedTickets();
  }, [currentTicketsPage, ticketsSearchFiltered, frontFilter]);

  useEffect(() => {
    if (toolbarSearch.trim() === '') {
      setTicketsSearchFiltered(tickets); // Reset to all tickets if search is empty or whitespace
    } else {
      setTicketsSearchFiltered(
        tickets.filter((item) => {
          return Object.values(item)
            .join("")
            .toLowerCase()
            .includes(toolbarSearch.toLowerCase());
        })

      );
    }
  }, [toolbarSearch, tickets]);
  useEffect(() => {
    const sortedTickets = [...tickets].sort((a, b) => {
      if (pinnedTicketIds.includes(a.id) && !pinnedTicketIds.includes(b.id)) {
        return -1
      }
      if (!pinnedTicketIds.includes(a.id) && pinnedTicketIds.includes(b.id)) {
        return 1
      }
      return 0
    })
    const filtered = sortedTickets.filter(ticket => {
      const matchesStatus = frontFilter.status === '' || ticket.status_label === frontFilter.status;
      const matchesUrgency = frontFilter.urgency === '' || ticket.urgency_label === frontFilter.urgency;
      const matchesPriority = frontFilter.priority === '' || ticket.priority_label === frontFilter.priority;
      const matchesType = frontFilter.type === '' || ticket.type_label === frontFilter.type;
      const matchesRequester = frontFilter.requester === '' || ticket.requester === frontFilter.requester;
      const matchesBranch = frontFilter.branch === '' || ticket.area === frontFilter.branch;
      const matchesAssignee = frontFilter.assignee === '' || ticket.users_recipient === frontFilter.assignee;
      return matchesStatus && matchesUrgency && matchesPriority && matchesType && matchesRequester && matchesBranch && matchesAssignee;
    });
    // fix how many pages number is show in tool bar tickets
    // make the pages number to be in footer maybe fixed at end of page
    const paginatedTickets = filtered.slice((currentTicketsPage - 1) * ticketsPerPage, currentTicketsPage * ticketsPerPage)
    setPaginatedTickets(paginatedTickets)
  }, [currentTicketsPage, tickets, pinnedTicketIds, frontFilter])
  const calculateFilteredTickets = () => {
    return tickets.filter((ticket) => {
      const matchesStatus = frontFilter.status === '' || ticket.status_label === frontFilter.status;
      const matchesUrgency = frontFilter.urgency === '' || ticket.urgency_label === frontFilter.urgency;
      const matchesPriority = frontFilter.priority === '' || ticket.priority_label === frontFilter.priority;
      const matchesType = frontFilter.type === '' || ticket.type_label === frontFilter.type;
      const matchesRequester = frontFilter.requester === '' || ticket.requester === frontFilter.requester;
      const matchesBranch = frontFilter.branch === '' || ticket.area === frontFilter.branch;
      const matchesAssignee = frontFilter.assignee === '' || ticket.users_recipient === frontFilter.assignee;
      return matchesStatus && matchesUrgency && matchesPriority && matchesType && matchesRequester && matchesBranch && matchesAssignee;
    });
  };

  const filteredTickets = frontFilter ? calculateFilteredTickets() : tickets;



  const totalPages = Math.ceil(
    toolbarSearch.trim()
      ? ticketsSearchFiltered.length / ticketsPerPage
      : frontFilter
        ? filteredTickets.length / ticketsPerPage
        : tickets.length / ticketsPerPage
  );
  const handleFirstPage = () => setCurrentTicketsPage(1)
  const handlePreviousPage = () => setCurrentTicketsPage(prev => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentTicketsPage(prev => Math.min(prev + 1, totalPages))
  const handleLastPage = () => setCurrentTicketsPage(totalPages)
  const handlePageChange = (page: number) => {
    setCurrentTicketsPage(page)
  }
  const minPagesToShow = 8
  const maxPagesToShow = Math.min(totalPages, minPagesToShow)
  const startPage = Math.floor((currentTicketsPage - 1) / minPagesToShow) * minPagesToShow + 1
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages)
  const xx = 0;
  useEffect(() => {

    const fetchPinnedTicketIds = async () => {
      const pinnedIds = await getPinnedTicketIds()
      setPinnedTicketIds(pinnedIds)
    }
    fetchPinnedTicketIds()
  }, [setPinnedTicketIds])
  const [filteredFrontTickets, setFilteredFrontTickets] = useState<any[]>([])


  useEffect(() => {
    console.log('frontFilter', frontFilter);
    const filtered = filteredTickets.filter(ticket => {
      const matchesStatus = frontFilter.status === '' || ticket.status_label === frontFilter.status;
      const matchesUrgency = frontFilter.urgency === '' || ticket.urgency_label === frontFilter.urgency;
      const matchesPriority = frontFilter.priority === '' || ticket.priority_label === frontFilter.priority;
      const matchesType = frontFilter.type === '' || ticket.type_label === frontFilter.type;
      const matchesRequester = frontFilter.requester === '' || ticket.requester === frontFilter.requester;
      const matchesBranch = frontFilter.branch === '' || ticket.area === frontFilter.branch;
      const matchesAssignee = frontFilter.assignee === '' || ticket.users_recipient === frontFilter.assignee;
      return matchesStatus && matchesUrgency && matchesPriority && matchesType && matchesRequester && matchesBranch && matchesAssignee;
    });
    const xx = 0;
    // setFilteredFrontTickets(filtered);
    // setTotalPagesFetched(countOfPages)

  }, [frontFilter, tickets]);
  useEffect(() => {
    return () => {
      // Reset the filters when the component unmounts
      setFrontFilter({
        status: '',
        urgency: '',
        priority: '',
        type: '',
        requester: '',
        branch: '',
        assignee: ''
      });
    };
  }, [setFrontFilter]);
  const hasActiveFilters = Object.values(frontFilter).some(value => value !== '');


  return (
    <>
      {/* <PageTitleTickets>{(toolbarSearch && toolbarSearch.trim() !== '') ? 'Filtered Tickets' : 'Tickets'}</PageTitleTickets> */}
      <ToolbarWrapper source={"tickets"} />
      <Content>
        <div className="d-flex flex-column justify-content-between h-100">
          {isDataLoading ? (
            <div className="spinner-wrapper">
              <div className="spinner-border spinner-loading-data" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            ((filteredFrontTickets.length > 0 ? filteredFrontTickets : (toolbarSearch && toolbarSearch.trim() !== '') ? ticketsSearchFiltered : paginatedTickets)).map(ticket => (
              <TicketCard
                key={ticket.id}
                id={ticket.id}
                status={ticket.status_label}
                date={ticket.date}
                title={ticket.name}
                description={ticket.content || "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                assignedTo={{ name: ticket.users_recipient, avatar: "https://via.placeholder.com/40" }} // Placeholder avatar
                raisedBy={{ name: ticket.users_lastupdater, initials: ticket?.users_lastupdater?.charAt(0) }}
                priority={ticket.priority_label}
                category={ticket.type_label}
                lastUpdate={ticket.date_mod}
                onClick={() => handleTicketClick(ticket)} // Add onClick handler
                onPin={handlePinTicket} // Pass the handlePinTicket function
                isPinned={pinnedTicketIds.includes(ticket.id)} // Pass the pinned status
                isStarred={ticket.is_starred} // Pass the pinned status
                onStarred={handleStarringTicket} // Pass the handlePinTicket function

              />
            ))
          )}

          <div className="pagination-controls d-flex justify-content-end mt-3">
            <button className='btn btn-sm btn-light me-2' onClick={handleFirstPage} disabled={currentTicketsPage === 1}>First</button>
            <button className='btn btn-sm btn-light me-2' onClick={handlePreviousPage} disabled={currentTicketsPage === 1}>Previous</button>
            {Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index).map(page => (
              <button
                key={page}
                className={clsx('btn btn-sm me-2', { 'btn-primary': currentTicketsPage === page, 'btn-light': currentTicketsPage !== page })}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </button>
            ))}
            <button className='btn btn-sm btn-light me-2' onClick={handleNextPage} disabled={currentTicketsPage === totalPages}>Next</button>
            <button className='btn btn-sm btn-light' onClick={handleLastPage} disabled={currentTicketsPage === totalPages}>Last</button>
          </div>
        </div>

      </Content>
      {/* <TicketCard
          id="#HFCS00117299"
          date ="01-10-2024"
          status="CANCELED"
          title="Problem upgrading account to a premium plan?"
          description="Our team is finding it difficult to upgrade from a free plan to a premium plan."
          assignedTo={{ name: "William Haug", avatar: "https://via.placeholder.com/40" }}
          raisedBy={{ name: "Break Rick", initials: "BR" }}
          priority="CRITICAL"
          category="Acme Support"
        /> */}
    </>
  )
}

export { TicketsPage }
