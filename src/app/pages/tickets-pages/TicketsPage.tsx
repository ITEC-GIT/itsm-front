import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { KTIcon, toAbsoluteUrl } from "../../../_metronic/helpers";
import {
  getLayoutFromLocalStorage,
  ILayout,
  LayoutSetup,
} from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  toolbarTicketsBackendFiltersAtom,
  toolbarTicketsNavigationAtom,
  toolbarTicketsSearchAtom,
  toolbarNewTicketsAtom,
} from "../../atoms/toolbar-atoms/toolbarTicketsAtom";
import {
  totalTicketsAtom,
  fetchedTicketsAtom,
  isTicketsFetchedAtom,
  fetchMorePagesFlagAtom,
  fetchLessPagesFlagAtom,
  maxIdAtom,
  ticketsAtom,
  maxTotalAtom,
  pinnedTicketsIdsAtom,
  numOfTicketsToFetchAtom,
  intervalFetchedTicketsResponseAtom,
  initialFetchedTicketsAtom,
  initialFetchedTicketsTotalAtom,
  newTicketsAvailableCount,
} from "../../atoms/tickets-page-atom/ticketsPageAtom";
import { toolbarTicketsFrontFiltersAtom } from "../../atoms/toolbar-atoms/toolbarTicketsAtom";
import { userAtom } from "../../atoms/auth-atoms/authAtom";

import { PageTitleTickets } from "../../../_metronic/layout/components/toolbar/page-title/PageTitleTickets";
import {
  FetchFilteredTickets,
  GetTicketsViewById,
  UpdateStarred,
} from "../../config/ApiCalls";
import TicketCard from "../../../_metronic/layout/components/custom-components/Card";
import { Content } from "../../../_metronic/layout/components/content";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  addPinnedTicketId,
  removePinnedTicketId,
  getPinnedTicketIds,
} from "../../../utils/indexDB";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { ApiRequestBody } from "../../config/ApiTypes";
import { ticketPerformingActionOnAtom } from "../../atoms/tickets-page-atom/ticketsActionsAtom";
import { mastersAtom } from "../../atoms/app-routes-global-atoms/globalFetchedAtoms";
import { isCurrentUserMasterAtom } from "../../atoms/app-routes-global-atoms/approutesAtoms";
import { isEqual } from "lodash";
import { Assignee, TicketResponse } from "../../types/TicketTypes";
import { selectedAssigneesAtom } from "../../atoms/assignee-atoms/assigneeAtoms";

const TicketsPage: React.FC = () => {
  // const currentPage = useAtomValue(toolbarTicketsNavigationAtom)
  const [currentTicketsPage, setCurrentTicketsPage] = useState<number>(1);
  const toolbarSearch = useAtomValue(toolbarTicketsSearchAtom);
  const navigate = useNavigate();
  const location = useLocation();
  // const [ticketsFetched, setTicketsFetched] = useAtom(fetchedTicketsAtom)
  const [tickets, setTickets] = useAtom(ticketsAtom);
  const [intervalFetchedTicketsResponse, setIntervalFetchedTicketsResponse] =
    useAtom(intervalFetchedTicketsResponseAtom);
  const [initialFetchedTickets, setInitialFetchedTickets] = useAtom(
    initialFetchedTicketsAtom
  );
  const [initialFetchedTicketsTotal, setInitialFetchedTicketsTotal] = useAtom(
    initialFetchedTicketsTotalAtom
  );
  const [frontFilter, setFrontFilter] = useAtom(toolbarTicketsFrontFiltersAtom);
  const isFirstRender = useRef(true);

  const [ticketsSearchFiltered, setTicketsSearchFiltered] = useState<any[]>([]);

  const setIsTicketsFetch = useSetAtom(isTicketsFetchedAtom);
  const fetchMorePagesFlag = useAtomValue(fetchMorePagesFlagAtom);
  const setFetchMorePagesFlag = useSetAtom(fetchMorePagesFlagAtom);
  const fetchLessPagesFlag = useAtomValue(fetchLessPagesFlagAtom);
  const setFetchLessPagesFlag = useSetAtom(fetchLessPagesFlagAtom);

  const [totalPagesFetched, setTotalPagesFetched] = useState<number>(1);

  const [currentTotalTicketsCount, setCurrentTotalTicketsCount] =
    useAtom(totalTicketsAtom); // Set the total tickets per query of fetched in this instance only
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [maxTotalTickets, setMaxTotalTickets] = useAtom(maxTotalAtom);
  const [paginatedTickets, setPaginatedTickets] = useState<any[]>([]);

  const [pinnedTicketIds, setPinnedTicketIds] = useAtom(pinnedTicketsIdsAtom); // State to track pinned ticket IDs
  const [sortedTickets, setSortedTickets] = useState<any[]>([]);
  const queryClient = new QueryClient();
  const [numOfRecordsToFetch, setNumOfRecordsToFetch] = useAtom(
    numOfTicketsToFetchAtom
  );
  const usrAtom = useAtomValue(userAtom);
  const [backendFilter, setBackendFilters] = useAtom(
    toolbarTicketsBackendFiltersAtom
  );
  const hasNonEmptyValue = (
    backendFilter: Record<string, { value: string; label: string }>
  ) => {
    return Object.values(backendFilter).some((filter) => filter.value !== "");
  };
  const prevBackendFilter = useRef(backendFilter);

  const getUpdatedRepliesTickets = (
    initialFetchedTickets: any,
    intervalFetchedTickets: any
  ) => {
    try {
      const updatedTickets = intervalFetchedTickets.filter(
        (intervalTicket: any) => {
          const initialTicket = initialFetchedTickets.find(
            (initialTicket: any) => initialTicket.id === intervalTicket.id
          );
          return (
            initialTicket &&
            initialTicket.users_lastupdater !== intervalTicket.users_lastupdater
          );
        }
      );
      return updatedTickets;
    } catch (error) {
      console.error("Error getting updated tickets:", error);
    }
  };

  const filterBackendMutation = useMutation<any, Error, ApiRequestBody>({
    mutationFn: FetchFilteredTickets,
    onSuccess: (response) => {
      const responseData = response.data;
      setMaxTotalTickets(response.totalcount);
      setTickets(responseData);
      setCurrentTotalTicketsCount(responseData.length);
      setIsTicketsFetch(true);
      setIsDataLoading(false);
      console.log("response", response);
      setCurrentTicketsPage(1);

      const message = "success";
    },
    onError: (error) => {
      alert("There was an error: " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["create"] }); // Updated invalidateQueries syntax
    },
  });
  const [
    automaticRefetchLengthMismatchFlag,
    setAutomaticRefetchLengthMismatchFlag,
  ] = useState(false);
  const [mismatchCount, setMismatchCount] = useAtom(newTicketsAvailableCount);

  const GetTicketsMutation = useMutation<
    any,
    Error,
    {
      body: ApiRequestBody;
      fetchLessPagesFlag?: boolean;
      fetchMorePagesFlag?: boolean;
      initialFetching?: boolean;
      intervalFetching?: boolean;
      filterFetching?: boolean;
    }
  >({
    mutationFn: ({ body }) => FetchFilteredTickets(body),
    onSuccess: (
      response,
      {
        fetchLessPagesFlag,
        fetchMorePagesFlag,
        initialFetching,
        intervalFetching,
        filterFetching,
      }
    ) => {
      let responseData = response.data;
      if (responseData.length !== 0) {
        if (initialFetching) {
          setInitialFetchedTickets(response.data);
          setInitialFetchedTicketsTotal(response.totalcount);
          setMaxTotalTickets(response.totalcount);
          setCurrentTotalTicketsCount(responseData.length);
          setTickets(responseData);
          setCurrentTicketsPage(1);
        } else if (fetchMorePagesFlag && !filterFetching) {
          setCurrentTotalTicketsCount(
            (prevTotal) => prevTotal + numOfRecordsToFetch
          );
          const mismatch = Math.abs(
            Number(response.totalcount) - Number(initialFetchedTicketsTotal)
          );
          if (mismatch != response.totalcount) {
            setMismatchCount(mismatch);
          }
          setTickets(responseData);
        } else if (fetchLessPagesFlag && !filterFetching) {
          responseData = response.data.sort((a: any, b: any) => b.id - a.id);// i can make flag , if current response data is less than num to fetch
          // then no need for more pagination ot the right side
          setCurrentTotalTicketsCount((prevTotal) => {
            const newTotal = prevTotal - responseData.length;
  
            return newTotal < responseData.length
              ? responseData.length
              : newTotal;
          });
          const mismatch = Math.abs(
            Number(response.totalcount) - Number(initialFetchedTicketsTotal)
          );
          if (mismatch != response.totalcount) {
            setMismatchCount(mismatch);
          }
          setTickets(responseData);
        } else if (intervalFetching) {
          const intervalFetchedTicketsRes: TicketResponse = response;

          setIntervalFetchedTicketsResponse(intervalFetchedTicketsRes);
          // need data to be added by me maybe using pulsar , or local database
          // must set the setTotaltickets in a way
          if (response.totalcount !== initialFetchedTicketsTotal) {
            setAutomaticRefetchLengthMismatchFlag(true);
            const mismatch = Math.abs(
              Number(response.totalcount) - Number(initialFetchedTicketsTotal)
            );
            console.log(`Mismatch in total tickets over interval: ${mismatch}`);
            if (mismatch != response.totalcount) {
              setMismatchCount(mismatch);
            }
          }
          if (
            intervalFetchedTicketsRes &&
            intervalFetchedTicketsRes.data.length > 0
          ) {
            const updatedTickets = getUpdatedRepliesTickets(
              initialFetchedTickets,
              intervalFetchedTicketsRes.data
            );
          }

          const x = 0;
        } else if (filterFetching && fetchMorePagesFlag) {
          const responseData = response.data;
          setCurrentTotalTicketsCount(
            (prevTotal) => prevTotal + responseData.length
          );

          setTickets(responseData);
        } else if (filterFetching && fetchLessPagesFlag) {
          responseData = response.data.sort((a: any, b: any) => b.id - a.id);
          setCurrentTotalTicketsCount(
            (prevTotal) => prevTotal - responseData.length
          );
          setTickets(responseData);
        } else if (filterFetching) {
          const responseData = response.data;

          setTickets(responseData);

          setCurrentTotalTicketsCount(responseData.length);
          setCurrentTicketsPage(1);
          setMaxTotalTickets(response.totalcount);
        }

        if (
          initialFetching ||
          fetchMorePagesFlag ||
          fetchLessPagesFlag ||
          filterFetching
        ) {
          setIsTicketsFetch(false);
          setIsDataLoading(false);

          console.log("response", response);
        } else {
          // it is interval fetching through window focus or 3 mintues itnerval
          setIsTicketsFetch(false);
        }
        if (currentTicketsPage > responseData.length / ticketsPerPage) {
          setCurrentTicketsPage(1);
        }
      } else {
        setIsTicketsFetch(false);
        setIsDataLoading(false);
        console.log("response", response);
      }

    },
    onError: (error) => {
      alert("There was an error in searching for tickets: " + error.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["create"] }); // Updated invalidateQueries syntax
    },
  });
  const fetchTicketsInterval = () => {
    const reqBody: ApiRequestBody = {
      range: `0-${numOfRecordsToFetch}`,
      order: "desc",
      opening_date: {},
    };
    setIsTicketsFetch(true);

    GetTicketsMutation.mutate({
      body: reqBody,
      fetchLessPagesFlag: false,
      fetchMorePagesFlag: false,
      initialFetching: false,
      filterFetching: false,
      intervalFetching: true,
    });
    // setIsTicketsFetch(false);
  };

  const getRandomInterval = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000; // Convert to milliseconds
  };

  // Set up the interval to fetch tickets at a random time between 2:45 and 3:15 minutes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    const setRandomInterval = () => {
      const intervalTime = getRandomInterval(165, 195); // Random time between 165 and 195 seconds
      interval = setInterval(() => {
        fetchTickets();
        clearInterval(interval); // Clear the current interval
        setRandomInterval(); // Set a new random interval
      }, intervalTime);
    };

    setRandomInterval(); // Initial call to set the interval

    // Cleanup function to clear interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, [GetTicketsMutation, numOfRecordsToFetch]);
  // Set up the event listener for window focus to fetch tickets
  useEffect(() => {
    const handleFocus = () => {
      fetchTicketsInterval();
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup function to remove event listener on component unmount
    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [GetTicketsMutation, numOfRecordsToFetch]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const reqBody: ApiRequestBody = {
  //       range: `0-${numOfRecordsToFetch}`,
  //       order: "desc",
  //       opening_date: {},
  //     };
  //     GetTicketsMutation.mutate({
  //       body: reqBody,
  //       fetchLessPagesFlag: false,
  //       fetchMorePagesFlag: false,
  //       intervalFetching: true,
  //     });
  //   }, 180000); // 180000 3 minutes in milliseconds

  //   return () => clearInterval(interval); // Clear interval on component unmount
  // }, [GetTicketsMutation, numOfRecordsToFetch]);
  const [ticketPerformingActionOn, setTicketPerformingActionOn] = useAtom(
    ticketPerformingActionOnAtom
  );
  useEffect(() => {
    if (ticketPerformingActionOn) {
      console.log("Ticket performing action on:", ticketPerformingActionOn);
      const updatedTicket = tickets.find(
        (ticket) => ticket.id === ticketPerformingActionOn.id
      );
      if (updatedTicket) {
        const newTicket = {
          ...updatedTicket,
          urgency:
            ticketPerformingActionOn.urgency?.value || updatedTicket.urgency,
          urgency_label:
            ticketPerformingActionOn.urgency?.label ||
            updatedTicket.urgency_label,
          priority:
            ticketPerformingActionOn.priority?.value || updatedTicket.priority,
          priority_label:
            ticketPerformingActionOn.priority?.label ||
            updatedTicket.priority_label,
          status:
            ticketPerformingActionOn.status?.value || updatedTicket.status,
          status_label:
            ticketPerformingActionOn.status?.label ||
            updatedTicket.status_label,
          type: ticketPerformingActionOn.type?.value || updatedTicket.type,
          type_label:
            ticketPerformingActionOn.type?.label || updatedTicket.type_label,
          // Add other fields that need to be updated similarly
        };

        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketPerformingActionOn.id
              ? { ...ticket, ...newTicket }
              : ticket
          )
        );
        console.log("Updated ticket:", newTicket);
        // You can now use newTicket as needed, e.g., update state or make an API call
      }
    }
  }, [ticketPerformingActionOn]);


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
        removePinnedTicketId(id);
        return prevPinned.filter((ticketId) => ticketId !== id);
      } else {
        addPinnedTicketId(id);
        return [...prevPinned, id];
      }
    });
  };
  const handleStarringTicket = async (id: string) => {
    const ticket = tickets.find((ticket) => ticket.id === id);

    if (ticket) {
      const newStarredStatus = ticket.starred === 1 ? 0 : 1;
      const response = await UpdateStarred(parseInt(id), newStarredStatus);

      // if (response) {
      //   setTickets(prevTickets =>
      //     prevTickets.map(t =>
      //       t.id === id ? { ...t, starred: newStarredStatus } : t
      //     )
      //   );
      // }
    }
  };
  useEffect(() => {
    if (location.state?.from === "details" && tickets.length > 0) {
      console.log("Navigated back from details; skipping fetch");
      setIsDataLoading(false);

      return;
    }
    const reqBody: ApiRequestBody = {
      range: `0-${numOfRecordsToFetch}`,
      order: "desc",
      opening_date: {},
    };
    setIsTicketsFetch(true);

    GetTicketsMutation.mutate({ body: reqBody, initialFetching: true });
    isFirstRender.current = false;

    return () => {
      // this is to unmount the component but not unmount data if navigating to details of any card
      const isTicketFormat = (input: string): boolean => {
        if (!input.startsWith("/ticket/")) return false;

        const parts = input.split("/");
        const lastPart = parts[2];

        return lastPart !== undefined && !isNaN(Number(lastPart));
      };
      const toDetailsRoute = isTicketFormat(window.location.pathname);
      if (!toDetailsRoute) {
        setTickets([]);
      }
    };
  }, []);
  // const [isBackendFilterValuesExist, setIsBackendFilterValuesExist] =
  //   useState(false);
  // useEffect(() => {
  //   const hasNonEmptyValue = (backendFilter: Record<string, string>) => {
  //     return Object.values(backendFilter).some((value) => value !== "");
  //   };
  //   setIsBackendFilterValuesExist(hasNonEmptyValue(backendFilter));
  // }, [backendFilter]);
  const fetchTickets = async () => {
    try {
      const filterBody: ApiRequestBody = {
        range: `0-${numOfRecordsToFetch}`,
        order: "desc",
        opening_date: {},
      };

      if (backendFilter.status) filterBody.status = backendFilter.status.value;
      if (backendFilter.urgency)
        filterBody.urgency = backendFilter.urgency.value;
      if (backendFilter.priority)
        filterBody.priority = backendFilter.priority.value;
      if (backendFilter.type) filterBody.type = backendFilter.type.value;
      if (backendFilter.requester)
        filterBody.requester = backendFilter.requester.value;
      if (backendFilter.branch) filterBody.area_id = backendFilter.branch.value;
      if (backendFilter.assignee)
        filterBody.assignee = backendFilter.assignee.value;
      if (backendFilter.from)
        filterBody.opening_date.from = backendFilter.from.value;
      if (backendFilter.to) filterBody.opening_date.to = backendFilter.to.value;
      setIsTicketsFetch(true);

      GetTicketsMutation.mutate({
        body: filterBody,
        filterFetching: true,
        fetchLessPagesFlag: false,
        fetchMorePagesFlag: false,
      });

      // const response = await GetTicketsViewById("0-5", "desc");
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  useEffect(() => {
    if (location.state?.from === "details" && tickets.length > 0) {
      console.log("Navigated back from details; skipping fetch");
      setIsDataLoading(false);
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, from: "" },
      });

      return;
    }

    const isBackendFilterValuesExist = hasNonEmptyValue(backendFilter);
    if (isBackendFilterValuesExist) {
      if (!isEqual(prevBackendFilter.current, backendFilter)) {
        setIsDataLoading(true);

        fetchTickets();
      }
    } else {
      const hadValuesBefore = hasNonEmptyValue(prevBackendFilter.current);
      const hasValuesNow = hasNonEmptyValue(backendFilter);

      if (hadValuesBefore && !hasValuesNow) {
        setIsDataLoading(true);

        console.log("Backend filter had values before and now it is empty");
        const reqBody: ApiRequestBody = {
          range: `0-${numOfRecordsToFetch}`,
          order: "desc",
          opening_date: {},
        };
        setIsTicketsFetch(true);

        GetTicketsMutation.mutate({ body: reqBody, initialFetching: true });
      }
    }
    prevBackendFilter.current = backendFilter; // Update the previous value

    return () => {
      // this is to unmount the component but not unmount data if navigating to details of any card
      const isTicketFormat = (input: string): boolean => {
        if (!input.startsWith("/ticket/")) return false;

        const parts = input.split("/");
        const lastPart = parts[2];

        return lastPart !== undefined && !isNaN(Number(lastPart));
      };
      const toDetailsRoute = isTicketFormat(window.location.pathname);
      if (!toDetailsRoute) {
        setTickets([]);
      }
    };
  }, [
    location.state,
    setTickets,
    setCurrentTotalTicketsCount,
    setIsTicketsFetch,
    backendFilter,
  ]);
  const getHighestId = (tickets: any[]) => {
    if (tickets.length === 0) return null;
    return Math.max(...tickets.map((ticket) => ticket.id));
  };

  const getLowestId = (tickets: any[]) => {
    if (tickets.length === 0) return null;
    return Math.min(...tickets.map((ticket) => ticket.id));
  };
  const createRequestBody = (
    numOfRecordsToFetch: number,
    Id: number,
    order: string,
    backendFilter: any
  ) => {
    const reqBody: ApiRequestBody = {
      range: `0-${numOfRecordsToFetch}`,
      order: order,
      idgt: Id,
      opening_date: {},
    };

    if (backendFilter.status) reqBody.status = backendFilter.status.value;
    if (backendFilter.urgency) reqBody.urgency = backendFilter.urgency.value;
    if (backendFilter.priority) reqBody.priority = backendFilter.priority.value;
    if (backendFilter.type) reqBody.type = backendFilter.type.value;
    if (backendFilter.requester)
      reqBody.requester = backendFilter.requester.value;
    if (backendFilter.branch) reqBody.area_id = backendFilter.branch.value;
    if (backendFilter.assignee) reqBody.assignee = backendFilter.assignee.value;
    if (backendFilter.from)
      reqBody.opening_date.from = backendFilter.from.value;
    if (backendFilter.to) reqBody.opening_date.to = backendFilter.to.value;

    return reqBody;
  };
  useEffect(() => {
    const isBackendFilterValuesExist = hasNonEmptyValue(backendFilter);

    if (fetchMorePagesFlag) {
      const fetchMorePages = async () => {
        try {
          const countOfPages = totalPagesFetched + 1;

          const lowestId = getLowestId(tickets);
          if (lowestId !== null) {
            // the error is caused by du
            // plicate objects , so its getting confused
            // const response = await GetTicketsViewById(lowestId-1, '0-3', 'desc')

            const reqFetchMoreBody = createRequestBody(
              numOfRecordsToFetch,
              lowestId,
              "desc",
              backendFilter
            );
            setIsTicketsFetch(true);

            if (isBackendFilterValuesExist) {
              GetTicketsMutation.mutate({
                body: reqFetchMoreBody,
                fetchLessPagesFlag,
                fetchMorePagesFlag,
                filterFetching: true,
              });
            } else {
              GetTicketsMutation.mutate({
                body: reqFetchMoreBody,
                fetchLessPagesFlag,
                fetchMorePagesFlag,
                filterFetching: false,
              });
            }

            // GetTicketsMutation.mutate({
            //   body: reqBody,
            //   fetchLessPagesFlag,
            //   fetchMorePagesFlag,
            // });
            // const response = await GetTicketsViewById("0-12", "desc", lowestId);
            // const responseData = response.data.data;
            // if (responseData.length > 0) {
            //   // const updatedTickets = [...tickets, ...responseData];
            //   const updatedTickets =  responseData

            //   setTickets(updatedTickets);
            //   setTotalTickets((prevTotal) => prevTotal + responseData.length);
            //   setIsDataLoading(false);
            // }
            // setTotalPagesFetched(countOfPages);
            setFetchMorePagesFlag(false);
          }
        } catch (error) {
          console.error("Error fetching more tickets:", error);
          setFetchMorePagesFlag(false); // Reset the flag in case of error
        }
      };
      setIsDataLoading(true);

      fetchMorePages();
    }
    if (fetchLessPagesFlag) {
      const fetchLessPages = async () => {
        try {
          const countOfPages = totalPagesFetched - 1;
          const highestId = getHighestId(tickets);
          if (highestId !== null) {
            // const response = await GetTicketsViewById("0-12", "asc", highestId);
            const reqFetchLessBody = createRequestBody(
              numOfRecordsToFetch,
              highestId,
              "asc",
              backendFilter
            );
            setIsTicketsFetch(true);

            if (isBackendFilterValuesExist) {
              GetTicketsMutation.mutate({
                body: reqFetchLessBody,
                fetchLessPagesFlag,
                fetchMorePagesFlag,
                filterFetching: true,
              });
            } else {
              GetTicketsMutation.mutate({
                body: reqFetchLessBody,
                fetchLessPagesFlag,
                fetchMorePagesFlag,
                filterFetching: false,
              });
            }

            // const reqBody: ApiRequestBody = {
            //   range: `0-${numOfRecordsToFetch}`,
            //   order: "asc",
            //   idgt: highestId,
            //   opening_date: {},
            // };
            // GetTicketsMutation.mutate({
            //   body: reqBody,
            //   fetchLessPagesFlag,
            //   fetchMorePagesFlag,
            // });
            // const responseData = response.data.data.sort((a: any, b: any) => b.id - a.id);

            // if (responseData.length > 0) {
            //   const updatedTickets = responseData;
            //   setTickets(updatedTickets);
            //   setTotalTickets((prevTotal) => prevTotal + responseData.length);
            //   setIsDataLoading(false);
            // }
            // setTotalPagesFetched(countOfPages);
            setFetchLessPagesFlag(false);
          }
        } catch (error) {
          console.error("Error fetching less tickets:", error);
          setFetchLessPagesFlag(false); // Reset the flag in case of error
        }
      };
      setIsDataLoading(true);
      fetchLessPages();
    }
  }, [
    tickets,
    fetchMorePagesFlag,
    fetchLessPagesFlag,
    totalPagesFetched,
    setTickets,
    setCurrentTotalTicketsCount,
    setFetchMorePagesFlag,
    setFetchLessPagesFlag,
  ]);

  const handleTicketClick = (ticket: any) => {
    navigate(`/ticket/${ticket.id}`, { state: { ticket } });
  };

  const changePriority = (id: number) => {
    console.log(`Change priority for ticket ID: ${id}`);
  };

  const pinTicket = (id: number) => {
    console.log(`Pin ticket ID: ${id}`);
  };

  const replyToTicket = (id: number) => {
    console.log(`Reply to ticket ID: ${id}`);
  };

  const ticketsPerPage = 6; // tickets to show in 1 page

  // const updatePaginatedTickets = () => {
  //   const startIdx = (currentTicketsPage - 1) * ticketsPerPage;
  //   const endIdx = currentTicketsPage * ticketsPerPage;
  //   const hasEmptyFilterValue = (filterObj: Record<string, string>) => {
  //     return Object.values(filterObj).some((value) => value.trim() === "");
  //   };

  //   if (toolbarSearch.trim()) {
  //     setPaginatedTickets(ticketsSearchFiltered.slice(startIdx, endIdx)); // Paginate the filtered results
  //   } else if (frontFilter && !hasEmptyFilterValue(frontFilter)) {
  //     setPaginatedTickets(filteredTickets.slice(startIdx, endIdx)); // Paginate the front-filtered results
  //   } else {
  //     setPaginatedTickets(tickets.slice(startIdx, endIdx)); // Paginate the full list of tickets
  //   }
  // };
  // useEffect(() => {
  //   updatePaginatedTickets();
  // }, [currentTicketsPage, ticketsSearchFiltered, frontFilter, pinnedTicketIds]);
  useEffect(() => {
    setCurrentTicketsPage(1);
  }, [toolbarSearch, frontFilter]);

  useEffect(() => {
    if (toolbarSearch.trim() === "") {
      setTicketsSearchFiltered(tickets); // Reset to all tickets if search is empty or whitespace
    } else {
      const keywords = toolbarSearch.toLowerCase().trim().split(/\s+/);
      setTicketsSearchFiltered(
        tickets.filter((item) => {
          const fieldsToFilter = [
            item.name,
            item.date,
            item.closedate,
            item.solvedate,
            item.takeintoaccountdate,
            item.date_mod,
            item.users_lastupdater,
            item.status_label,
            item.users_recipient,
            item.content,
            item.urgency_label,
            item.impact_label,
            item.priority_label,
            item.type_label,
            item.date_creation,
          ];
          const itemValuesString = fieldsToFilter.join(" ").toLowerCase();
          return keywords.every((keyword) =>
            itemValuesString.includes(keyword)
          );
        })
      );
    }
  }, [toolbarSearch, tickets]);
  useEffect(() => {
    if (tickets.length > 0) {
      const sortedTickets = [...tickets].sort((a, b) => {
        if (pinnedTicketIds.includes(a.id) && !pinnedTicketIds.includes(b.id)) {
          return -1;
        }
        if (!pinnedTicketIds.includes(a.id) && pinnedTicketIds.includes(b.id)) {
          return 1;
        }
        return 0;
      });
      const filtered = sortedTickets.filter((ticket) => {
        const matchesStatus =
          frontFilter.status.value === "" ||
          String(ticket.status) === frontFilter.status.value;
        const matchesUrgency =
          frontFilter.urgency.value === "" ||
          String(ticket.urgency) === frontFilter.urgency.value;
        const matchesPriority =
          frontFilter.priority.value === "" ||
          String(ticket.priority) === frontFilter.priority.value;
        const matchesType =
          frontFilter.type.value === "" ||
          String(ticket.type) === frontFilter.type.value;
        const matchesRequester =
          frontFilter.requester.value === "" ||
          String(ticket.requester) === frontFilter.requester.value;
        const matchesBranch =
          frontFilter.branch.value === "" ||
          String(ticket.areas_id) === frontFilter.branch.value;
        const matchesAssignee =
          frontFilter.assignee.value === "" ||
          String(ticket.users_id_recipient) === frontFilter.assignee.value;
        return (
          matchesStatus &&
          matchesUrgency &&
          matchesPriority &&
          matchesType &&
          matchesRequester &&
          matchesBranch &&
          matchesAssignee
        );
      });
      // fix how many pages number is show in tool bar tickets
      // make the pages number to be in footer maybe fixed at end of page
      const paginatedTickets = filtered.slice(
        (currentTicketsPage - 1) * ticketsPerPage,
        currentTicketsPage * ticketsPerPage
      );
      const hasEmptyFilterValue = (
        filterObj: Record<string, { value: string; label: string }>
      ) => {
        return Object.values(filterObj).some(
          (filter) => filter.label.trim() === ""
        );
      };
      const startIdx = (currentTicketsPage - 1) * ticketsPerPage;
      const endIdx = currentTicketsPage * ticketsPerPage;
      if (toolbarSearch.trim()) {
        setPaginatedTickets(ticketsSearchFiltered.slice(startIdx, endIdx)); // Paginate the filtered results
      } else if (
        frontFilter &&
        !hasEmptyFilterValue(
          frontFilter as Record<string, { value: string; label: string }>
        )
      ) {
        setPaginatedTickets(paginatedTickets); // Paginate the front-filtered results
      } else {
        setPaginatedTickets(paginatedTickets); // Paginate the full list of tickets
      }
    }
  }, [
    currentTicketsPage,
    tickets,
    frontFilter,
    setPinnedTicketIds,
    pinnedTicketIds,
    ticketsSearchFiltered,
  ]);
  const calculateFilteredTickets = () => {
    if (tickets && tickets.length > 0) {
      return tickets.filter((ticket) => {
        const matchesStatus =
          frontFilter.status.value === "" ||
          String(ticket.status) === frontFilter.status.value;
        const matchesUrgency =
          frontFilter.urgency.value === "" ||
          String(ticket.urgency) === frontFilter.urgency.value;
        const matchesPriority =
          frontFilter.priority.value === "" ||
          String(ticket.priority) === frontFilter.priority.value;
        const matchesType =
          frontFilter.type.value === "" ||
          String(ticket.type) === frontFilter.type.value;
        const matchesRequester =
          frontFilter.requester.value === "" ||
          String(ticket.requester) === frontFilter.requester.value;
        const matchesBranch =
          frontFilter.branch.value === "" ||
          String(ticket.areas_id) === frontFilter.branch.value;
        const matchesAssignee =
          frontFilter.assignee.value === "" ||
          String(ticket.users_id_recipient) === frontFilter.assignee.value;
        return (
          matchesStatus &&
          matchesUrgency &&
          matchesPriority &&
          matchesType &&
          matchesRequester &&
          matchesBranch &&
          matchesAssignee
        );
      });
    }
  };

  const filteredTickets = frontFilter ? calculateFilteredTickets() : tickets;

  const totalPages = Math.ceil(
    toolbarSearch.trim()
      ? ticketsSearchFiltered.length / ticketsPerPage
      : frontFilter
      ? (filteredTickets?.length || 0) / ticketsPerPage
      : tickets.length / ticketsPerPage
  );
  const handleFirstPage = () => setCurrentTicketsPage(1);
  const handlePreviousPage = () =>
    setCurrentTicketsPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentTicketsPage((prev) => Math.min(prev + 1, totalPages));
  const handleLastPage = () => setCurrentTicketsPage(totalPages);
  const handlePageChange = (page: number) => {
    setCurrentTicketsPage(page);
  };
  const minPagesToShow = 5;
  const maxPagesToShow = Math.min(totalPages, minPagesToShow);
  const startPage =
    Math.floor((currentTicketsPage - 1) / minPagesToShow) * minPagesToShow + 1;
  const endPage = Math.min(startPage + minPagesToShow - 1, totalPages);
  const xx = 0;
  useEffect(() => {
    const fetchPinnedTicketIds = async () => {
      const pinnedIds = await getPinnedTicketIds();
      setPinnedTicketIds(pinnedIds);
    };
    fetchPinnedTicketIds();
    return () => {
      setPinnedTicketIds([]);
    };
  }, [setPinnedTicketIds]);
  // const [filteredFrontTickets, setFilteredFrontTickets] = useState<any[]>([]);
  useEffect(() => {
    return () => {
      // Check if the navigation is to the details page
      if (!window.location.pathname.startsWith("/ticket/")) {
        // Reset the front filters when the component unmounts and not navigating to details page
        setFrontFilter({
          status: { value: "", label: "" },
          urgency: { value: "", label: "" },
          priority: { value: "", label: "" },
          type: { value: "", label: "" },
          requester: { value: "", label: "" },
          branch: { value: "", label: "" },
          assignee: { value: "", label: "" },
        });
      }
    };
  }, [setFrontFilter]);
  useEffect(() => {
    return () => {
      // Check if the navigation is to the details page
      if (!window.location.pathname.startsWith("/ticket/")) {
        // Reset the backend filters when the component unmounts and not navigating to details page
        setBackendFilters({
          status: { value: "", label: "" },
          urgency: { value: "", label: "" },
          priority: { value: "", label: "" },
          type: { value: "", label: "" },
          requester: { value: "", label: "" },
          branch: { value: "", label: "" },
          assignee: { value: "", label: "" },
          from: { value: "", label: "" },
          to: { value: "", label: "" },
        });
      }
    };
  }, [setBackendFilters]);

  const [isCurrentUserMaster, setIsCurrentUserMaster] = useAtom(
    isCurrentUserMasterAtom
  );
  const [toolbarNewTickets, setToolbarNewTickets] = useAtom(
    toolbarNewTicketsAtom
  );

  useEffect(() => {
    if (toolbarNewTickets) {
      if (intervalFetchedTicketsResponse) {
        setInitialFetchedTickets(intervalFetchedTicketsResponse.data);
        setInitialFetchedTicketsTotal(
          intervalFetchedTicketsResponse.totalcount
        );
        setMaxTotalTickets(intervalFetchedTicketsResponse.totalcount);
        setCurrentTotalTicketsCount(intervalFetchedTicketsResponse.data.length);
        setTickets(intervalFetchedTicketsResponse.data);
        console.log("response", intervalFetchedTicketsResponse);
        setToolbarNewTickets(false);
        setCurrentTicketsPage(1);
        setMismatchCount(0);
        setIntervalFetchedTicketsResponse(null);
      }
      else{
        console.log(`iam here `)
        const reqBody: ApiRequestBody = {
          range: `0-${numOfRecordsToFetch}`,
          order: "desc",
          opening_date: {},
        };
        setIsTicketsFetch(true);
        setIsDataLoading(true);
        GetTicketsMutation.mutate({ body: reqBody, initialFetching: true });
        setMismatchCount(0);
        setIsTicketsFetch(false);
        setToolbarNewTickets(false);

      }
    }
  }, [toolbarNewTickets]);
  // Cleanup function to reset mismatchCount on component unmount
  useEffect(() => {
    return () => {
      setMismatchCount(0); // Reset mismatchCount to 0
    };
  }, [setMismatchCount]);
  // const [selectedAssignees] = useAtom(selectedAssigneesAtom);
  const [ticketChangeAssigneenOn, setChangeAssigneeOn] = useAtom(
    ticketPerformingActionOnAtom
  );

  useEffect(() => {
    if (ticketChangeAssigneenOn) {
      console.log("Ticket performing action on:", ticketChangeAssigneenOn.ticketId);
      const updatedTicket = tickets.find(
        (ticket) => ticket.id === ticketChangeAssigneenOn.ticketId
      );
      if (updatedTicket) {
        const newTicket = {
          ...updatedTicket,
          assignees: ticketChangeAssigneenOn.assigneeNewData,
        };

        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === ticketChangeAssigneenOn.ticketId
              ? { ...ticket, ...newTicket }
              : ticket
          )
        );
        console.log("Updated ticket:", newTicket);
        // You can now use newTicket as needed, e.g., update state or make an API call
      }
    }
  }, [ticketChangeAssigneenOn]);

  return (
    <>
      <ToolbarWrapper source={"tickets"} />
      <Content>
        <div className="tickets-component-container align-self-stretch">
          <div className="d-flex flex-column justify-content-between">
            {isDataLoading ? (
              <div className="spinner-wrapper">
                <div
                  className="spinner-border spinner-loading-data"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              paginatedTickets.map((ticket) => {
                const assignees: Assignee[] = JSON.parse(ticket?.assignees || "[]");
              return (
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
                  onClick={() => handleTicketClick(ticket)} // Add onClick handler
                  onPin={handlePinTicket} // Pass the handlePinTicket function
                  isPinned={pinnedTicketIds.includes(ticket.id)} // Pass the pinned status
                  isStarred={ticket.starred} // Pass the pinned status
                  onStarred={handleStarringTicket} // Pass the handlePinTicket function
                  isCurrentUserMaster={isCurrentUserMaster}
                  assignees={assignees}
                />
              );
            })
          )}
          </div>
        </div>
      </Content>
      <div className=" tickets-pagination-controls">
        <button
          className="btn btn-sm btn-light me-2"
          onClick={handleFirstPage}
          disabled={currentTicketsPage === 1}
        >
          First
        </button>
        <button
          className="btn btn-sm btn-light me-2"
          onClick={handlePreviousPage}
          disabled={currentTicketsPage === 1}
        >
          Previous
        </button>
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, index) => startPage + index
        ).map((page) => (
          <button
            key={page}
            className={clsx("btn btn-sm me-2", {
              "btn-primary": currentTicketsPage === page,
              "btn-light": currentTicketsPage !== page,
            })}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="btn btn-sm btn-light me-2"
          onClick={handleNextPage}
          disabled={currentTicketsPage === totalPages}
        >
          Next
        </button>
        <button
          className="btn btn-sm btn-light"
          onClick={handleLastPage}
          disabled={currentTicketsPage === totalPages}
        >
          Last
        </button>
      </div>
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
  );
};

export { TicketsPage };
