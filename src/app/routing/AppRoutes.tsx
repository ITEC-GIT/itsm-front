import {FC, useEffect, useState} from "react";
import {
    Routes,
    Route,
    BrowserRouter,
    Navigate,
    useNavigate,
} from "react-router-dom";
import {PrivateRoutes} from "./PrivateRoutes";
import {ErrorsPage} from "../modules/errors/ErrorsPage";
import {AnimatePresence, motion} from 'framer-motion'

import {Logout, AuthPage, useAuth} from "../modules/auth";
import {App} from "../App";
import {useAtom, useAtomValue} from "jotai";
import {isAuthenticatedAtom, userAtom} from "../atoms/auth-atoms/authAtom";
import {authChannel} from "../pages/login-page/authChannel";
import {getSessionTokenFromCookie} from "../config/Config";
import {GetStaticData, GetUsersAndAreas} from "../config/ApiCalls";
import {loadFromIndexedDB, saveToIndexedDB} from "../indexDB/IndexDBConfig";
import {
    isCurrentUserMasterAtom,
    staticDataAtom,
} from "../atoms/app-routes-global-atoms/approutesAtoms";
import {useQuery} from "@tanstack/react-query";
import {
    branchesAtom,
    mastersAtom,
    slavesAtom,
} from "../atoms/app-routes-global-atoms/globalFetchedAtoms";
import useWebSocket from "../sockets/useWebSocket.ts";


/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const {BASE_URL} = import.meta.env;

const RoutesContent: FC = () => {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const isAuthAtom = useAtomValue(isAuthenticatedAtom);
    const [user, setUser] = useAtom(userAtom);
    useEffect(() => {
        if (user && user.access_token != '') {
            const userName = user.user_name;
        }
    }, [user]);
    const { messages } = useWebSocket(Number(user?.user_id));

    const navigate = useNavigate();
    const [staticData, setStaticData] = useAtom(staticDataAtom);

    useEffect(() => {
        if (getSessionTokenFromCookie() == null && !isAuthAtom) {
            setCurrentUser(null);
            navigate("/auth/login");
        } else {
            const fetchStaticDataWithAtom = async () => {
                try {
                    const [usersAndAreasResponse, staticDataResponse] = await Promise.all(
                        [GetUsersAndAreas(), GetStaticData()]
                    );

                    if (
                        usersAndAreasResponse.status !== 200 ||
                        staticDataResponse.status !== 200
                    ) {
                        throw new Error(
                            `Network response was not ok: 
            UsersAndAreas: ${usersAndAreasResponse.status} ${usersAndAreasResponse.statusText}, 
            StaticData: ${staticDataResponse.status} ${staticDataResponse.statusText}`
                        );
                    }

                    const data = {
                        ...staticDataResponse.data,
                        ...usersAndAreasResponse.data,
                    };

                    if (typeof data === "object" && data !== null) {
                        setStaticData(data);
                    } else {
                        console.error("Invalid data received from the API:", data);
                    }
                } catch (error) {
                    console.error("Error checking IndexedDB or fetching data:", error);
                }
            };
            fetchStaticDataWithAtom();
            setCurrentUser(getSessionTokenFromCookie());
        }
    }, [isAuthAtom, navigate]);

    useEffect(() => {
        const handleBroadcast = (event: MessageEvent) => {
            if (event.data === "logout") {
                setCurrentUser(null);
                navigate("/auth/login");
            }
        };

        authChannel.addEventListener("message", handleBroadcast);

        return () => {
            authChannel.removeEventListener("message", handleBroadcast);
        };
    }, [navigate]);

    const fetchStaticData = async (user: any) => {
        try {
            const userId = user || 'assignee'; // Replace with actual user ID
            const DB_NAME = "StaticDataDB";
            const STORE_NAME = "StaticData";

            // Check if data exists in IndexedDB
            const storedData = await loadFromIndexedDB(userId, DB_NAME, STORE_NAME);
            if (storedData.length === 0) {
                // Data not found in IndexedDB, fetch from API
                const response = await GetStaticData();
                const data = response.data;

                // Ensure data is an array before saving to IndexedDB
                const dataArray = Array.isArray(data) ? data : [data];

                // Store the fetched data in IndexedDB

                // Set the data in the atom
                setStaticData(dataArray);

                console.log("Fetched and stored data:", dataArray);
            } else {
                // Set the data in the atom
                setStaticData(storedData);

                console.log("Data loaded from IndexedDB:", storedData);
            }
        } catch (error) {
            console.error("Error fetching static data:", error);
        }
    };

    const {
        data: userBranches,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["userBranches"], // Ensure you have a unique query key
        queryFn: GetUsersAndAreas, // Directly pass the function reference
        refetchOnWindowFocus: false, // Refetch when window regains focus
        refetchInterval: 180000, // Refetch every 3 minutes (in milliseconds)
        enabled: false, // Start fetching as soon as the component is mounted
        retry: true,
    });
    const [itsmBranches, setItsmBranches] = useAtom(branchesAtom);
    const [itsmSlaves, setItsmSlaves] = useAtom(slavesAtom);
    const [itsmMaster, setItsmMaster] = useAtom(mastersAtom);
    const [isCurrentUserMaster, setIsCurrentUserMaster] = useAtom(
        isCurrentUserMasterAtom
    );
    useEffect(() => {
        const sessionCookie = getSessionTokenFromCookie()
        if (sessionCookie == null && !isAuthAtom) {
            setCurrentUser(null);
            navigate("/auth/login");
        } else {
            refetch();
            setCurrentUser(sessionCookie);
        }
    }, [isAuthAtom, navigate]);
    useEffect(() => {
        if (userBranches && userBranches.data) {
            setItsmBranches((prev) =>
                prev !== userBranches.data.areas
                    ? userBranches.data.areas
                    : prev
            );
            setItsmSlaves((prev) =>
                prev !== userBranches.data.requesters
                    ? userBranches.data.requesters
                    : prev
            );
            setItsmMaster((prev) =>
                prev !== userBranches.data.assignees
                    ? userBranches.data.assignees
                    : prev
            );
            const currentUser = user.user_name;

            const currentAssignee = userBranches.data.assignees.find(
                (assignee: { name: string; is_admin: number }) => assignee.name === currentUser
            );
            // fetchStaticData(currentUser);

            const isAdmin = currentAssignee ? currentAssignee.is_admin === 1 : false;
            setIsCurrentUserMaster(isAdmin);
            const x = 0;
        }
    }, [userBranches, setItsmBranches, setItsmSlaves]);

    return (
    <AnimatePresence mode="wait" initial={false} >

            <Routes>
                <Route element={<App/>}>

                    <Route path="error/*" element={<ErrorsPage/>}/>
                    <Route path="logout" element={<Logout/>}/>
                    {/* {currentUser !== null ? ( */}
                        <>

                            <Route path="/*" element={<PrivateRoutes />} />
                            <Route index element={<Navigate to="/dashboard"/>}/>
                        </>
                    {/* ) : ( */}
                        <>
                            <Route path="auth/*" element={<AuthPage/>}/>
                            <Route path="*" element={<Navigate to="/auth/login"/>}/>
                        </>
                    {/* )} */}
                </Route>
            </Routes>
        </ AnimatePresence>
    );
};

const AppRoutes: FC = () => (
    <BrowserRouter basename={BASE_URL}>
        <RoutesContent/>
    </BrowserRouter>
);
export {AppRoutes};
