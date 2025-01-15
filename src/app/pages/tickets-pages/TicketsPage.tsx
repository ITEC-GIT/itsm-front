import clsx from 'clsx'
import { useEffect, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../_metronic/helpers'
import { getLayoutFromLocalStorage, ILayout, LayoutSetup } from '../../../_metronic/layout/core'
import { ToolbarWrapper } from '../../../_metronic/layout/components/toolbar'
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { toolbarTicketsNavigationAtom, toolbarTicketsSearchAtom } from '../../atoms/toolbar-atoms/toolbarTicketsAtom';
import { totalTicketsAtom, fetchedTicketsAtom, isTicketsFetchedAtom, fetchMorePagesFlagAtom, maxIdAtom, ticketsAtom, maxTotalAtom, pinnedTicketsIdsAtom } from '../../atoms/tickets-page-atom/ticketsPageAtom';
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
  const [ticketsFiltered, setTicketsFiltered] = useState<any[]>([])

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
  const usrAtom= useAtomValue(userAtom);
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
  const demoTickets = [
    {
      id: 53,
      entities_id: 0,
      name: "test203",
      date: "2025-01-07 10:59:27",
      closedate: null,
      solvedate: null,
      takeintoaccountdate: null,
      date_mod: "2025-01-07 09:59:28",
      users_id_lastupdater: 7,
      users_lastupdater: "m.hareb",
      status: 1,
      status_label: "new",
      users_id_recipient: 7,
      users_recipient: "m.hareb",
      requesttypes_id: 1,
      content: "",
      urgency: 4,
      urgency_label: "High",
      impact: 3,
      impact_label: "Medium",
      priority: 3,
      priority_label: "Medium",
      itilcategories_id: 3,
      type: 1,
      type_label: "Incident",
      global_validation: 1,
      slas_id_ttr: 0,
      slas_id_tto: 0,
      slalevels_id_ttr: 0,
      time_to_resolve: null,
      time_to_own: null,
      begin_waiting_date: null,
      sla_waiting_duration: 0,
      ola_waiting_duration: 0,
      olas_id_tto: 0,
      olas_id_ttr: 0,
      olalevels_id_ttr: 0,
      ola_tto_begin_date: null,
      ola_ttr_begin_date: null,
      internal_time_to_resolve: null,
      internal_time_to_own: null,
      waiting_duration: 0,
      close_delay_stat: 0,
      solve_delay_stat: 0,
      takeintoaccount_delay_stat: 0,
      actiontime: 0,
      is_deleted: 0,
      locations_id: 0,
      validation_percent: 0,
      date_creation: "2025-01-07 09:59:28",
      areas_id: 0,
      area: null,
    },
    {
      id: 52,
      entities_id: 0,
      name: "test201",
      date: "2025-01-07 09:47:23",
      closedate: null,
      solvedate: null,
      takeintoaccountdate: null,
      date_mod: "2025-01-07 08:47:23",
      users_id_lastupdater: 7,
      users_lastupdater: "m.hareb",
      status: 1,
      status_label: "new",
      users_id_recipient: 7,
      users_recipient: "m.hareb",
      requesttypes_id: 1,
      content: "",
      urgency: 5,
      urgency_label: "Very high",
      impact: 3,
      impact_label: "Medium",
      priority: 3,
      priority_label: "Medium",
      itilcategories_id: 3,
      type: 1,
      type_label: "Incident",
      global_validation: 1,
      slas_id_ttr: 0,
      slas_id_tto: 0,
      slalevels_id_ttr: 0,
      time_to_resolve: null,
      time_to_own: null,
      begin_waiting_date: null,
      sla_waiting_duration: 0,
      ola_waiting_duration: 0,
      olas_id_tto: 0,
      olas_id_ttr: 0,
      olalevels_id_ttr: 0,
      ola_tto_begin_date: null,
      ola_ttr_begin_date: null,
      internal_time_to_resolve: null,
      internal_time_to_own: null,
      waiting_duration: 0,
      close_delay_stat: 0,
      solve_delay_stat: 0,
      takeintoaccount_delay_stat: 0,
      actiontime: 0,
      is_deleted: 0,
      locations_id: 0,
      validation_percent: 0,
      date_creation: "2025-01-07 08:47:23",
      areas_id: 0,
      area: null,
    },
    {
      id: 51,
      entities_id: 0,
      name: "(*&#38;^%$",
      date: "2025-01-07 09:34:37",
      closedate: null,
      solvedate: "2025-01-07 09:34:37",
      takeintoaccountdate: null,
      date_mod: "2025-01-07 08:34:37",
      users_id_lastupdater: 7,
      users_lastupdater: "m.hareb",
      status: 5,
      status_label: "solved",
      users_id_recipient: 7,
      users_recipient: "m.hareb",
      requesttypes_id: 1,
      content: "",
      urgency: 1,
      urgency_label: "Very low",
      impact: 3,
      impact_label: "Medium",
      priority: 2,
      priority_label: "Low",
      itilcategories_id: 3,
      type: 2,
      type_label: "Demand",
      global_validation: 1,
      slas_id_ttr: 0,
      slas_id_tto: 0,
      slalevels_id_ttr: 0,
      time_to_resolve: null,
      time_to_own: null,
      begin_waiting_date: null,
      sla_waiting_duration: 0,
      ola_waiting_duration: 0,
      olas_id_tto: 0,
      olas_id_ttr: 0,
      olalevels_id_ttr: 0,
      ola_tto_begin_date: null,
      ola_ttr_begin_date: null,
      internal_time_to_resolve: null,
      internal_time_to_own: null,
      waiting_duration: 0,
      close_delay_stat: 0,
      solve_delay_stat: 0,
      takeintoaccount_delay_stat: 0,
      actiontime: 0,
      is_deleted: 0,
      locations_id: 0,
      validation_percent: 0,
      date_creation: "2025-01-07 08:34:37",
      areas_id: 0,
      area: null,
    },
    {
      id: 50,
      entities_id: 0,
      name: "!@#$%",
      date: "2025-01-07 09:31:07",
      closedate: null,
      solvedate: null,
      takeintoaccountdate: null,
      date_mod: "2025-01-07 08:31:08",
      users_id_lastupdater: 7,
      users_lastupdater: "m.hareb",
      status: 1,
      status_label: "new",
      users_id_recipient: 7,
      users_recipient: "m.hareb",
      requesttypes_id: 1,
      content: "",
      urgency: 5,
      urgency_label: "Very high",
      impact: 3,
      impact_label: "Medium",
      priority: 4,
      priority_label: "High",
      itilcategories_id: 3,
      type: 1,
      type_label: "Incident",
      global_validation: 1,
      slas_id_ttr: 0,
      slas_id_tto: 0,
      slalevels_id_ttr: 0,
      time_to_resolve: null,
      time_to_own: null,
      begin_waiting_date: null,
      sla_waiting_duration: 0,
      ola_waiting_duration: 0,
      olas_id_tto: 0,
      olas_id_ttr: 0,
      olalevels_id_ttr: 0,
      ola_tto_begin_date: null,
      ola_ttr_begin_date: null,
      internal_time_to_resolve: null,
      internal_time_to_own: null,
      waiting_duration: 0,
      close_delay_stat: 0,
      solve_delay_stat: 0,
      takeintoaccount_delay_stat: 0,
      actiontime: 0,
      is_deleted: 0,
      locations_id: 0,
      validation_percent: 0,
      date_creation: "2025-01-07 08:31:08",
      areas_id: 0,
      area: null,
    },
  ]

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
          const nextPage = totalPagesFetched + 1

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
            setTotalPagesFetched(nextPage)
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





  useEffect(() => {
    if (toolbarSearch.trim() === '') {
      setTicketsFiltered(tickets); // Reset to all tickets if search is empty or whitespace
    } else {
      setTicketsFiltered(
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

    const paginatedTickets = sortedTickets.slice((currentTicketsPage - 1) * ticketsPerPage, currentTicketsPage * ticketsPerPage)
    setPaginatedTickets(paginatedTickets)
  }, [currentTicketsPage, tickets, pinnedTicketIds])

  const totalPages = Math.ceil(tickets.length / ticketsPerPage)

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
  useEffect(() => {

    const fetchPinnedTicketIds = async () => {
      const pinnedIds = await getPinnedTicketIds()
      setPinnedTicketIds(pinnedIds)
    }
    fetchPinnedTicketIds()
  }, [setPinnedTicketIds])

  return (
    <>
      {/* <PageTitleTickets>{(toolbarSearch && toolbarSearch.trim() !== '') ? 'Filtered Tickets' : 'Tickets'}</PageTitleTickets> */}
      <ToolbarWrapper  source={"tickets"}/>
      <Content>
      <div className="d-flex flex-column justify-content-between h-100">
  {isDataLoading ? (
    <div className="spinner-wrapper">
      <div className="spinner-border spinner-loading-data" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ) : (
    ((toolbarSearch && toolbarSearch.trim() !== '') ? ticketsFiltered : paginatedTickets).map(ticket => (
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
