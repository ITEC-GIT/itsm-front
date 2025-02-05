import { FC, useEffect, useState } from "react";
import {
  Routes,
  Route,
  BrowserRouter,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { PrivateRoutes } from "./PrivateRoutes";
import { ErrorsPage } from "../modules/errors/ErrorsPage";
import { Logout, AuthPage, useAuth } from "../modules/auth";
import { App } from "../App";
import { useAtom, useAtomValue } from "jotai";
import { isAuthenticatedAtom, userAtom } from "../atoms/auth-atoms/authAtom";
import { authChannel } from "../pages/login-page/authChannel";
import { getSessionTokenFromCookie } from "../config/Config";
import { GetStaticData, GetUsersBranch } from "../config/ApiCalls";
import { loadFromIndexedDB, saveToIndexedDB } from "../indexDB/IndexDBConfig";
import {
  isCurrentUserMasterAtom,
  staticDataAtom,
} from "../atoms/app-routes-global-atoms/approutesAtoms";
import { useQuery } from "@tanstack/react-query";
import {
  branchesAtom,
  mastersAtom,
  slavesAtom,
} from "../atoms/app-routes-global-atoms/globalFetchedAtoms";

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { BASE_URL } = import.meta.env;

const RoutesContent: FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const isAuthAtom = useAtomValue(isAuthenticatedAtom);
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const [staticData, setStaticData] = useAtom(staticDataAtom);

  useEffect(() => {
    if (getSessionTokenFromCookie() == null && !isAuthAtom) {
      setCurrentUser(null);
      navigate("/auth/login");
    } else {
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

  const fetchStaticData = async () => {
    try {
      const userId = currentUser?.id || 0; // Replace with actual user ID
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
        await saveToIndexedDB(userId, DB_NAME, STORE_NAME, dataArray);

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
    queryFn: GetUsersBranch, // Directly pass the function reference
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
    if (getSessionTokenFromCookie() == null && !isAuthAtom) {
      setCurrentUser(null);
      navigate("/auth/login");
    } else {
      refetch();
      fetchStaticData();
      setCurrentUser(getSessionTokenFromCookie());
    }
  }, [isAuthAtom, navigate]);
  useEffect(() => {
    if (userBranches && userBranches.data) {
      setItsmBranches((prev) =>
        prev !== userBranches.data.Departments
          ? userBranches.data.Departments
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
      const currentUser = user.session?.glpiname;

      const currentAssignee = userBranches.data.assignees.find(
        (assignee: { name: string; is_admin: number }) => assignee.name === currentUser
      );

      const isAdmin = currentAssignee ? currentAssignee.is_admin === 1 : false;
      setIsCurrentUserMaster(isAdmin);
      const x=0;
    }
  }, [userBranches, setItsmBranches, setItsmSlaves]);

  return (
    <Routes>
      <Route element={<App />}>
        <Route path="error/*" element={<ErrorsPage />} />
        <Route path="logout" element={<Logout />} />
        {currentUser !== null ? (
          <>
            <Route path="/*" element={<PrivateRoutes />} />
            <Route index element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          <>
            <Route path="auth/*" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/auth/login" />} />
          </>
        )}
      </Route>
    </Routes>
  );
};

const AppRoutes: FC = () => (
  <BrowserRouter basename={BASE_URL}>
    <RoutesContent />
  </BrowserRouter>
);
export { AppRoutes };
