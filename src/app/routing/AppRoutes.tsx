import { FC, useEffect, useState } from "react";
import Cookies from "js-cookie";
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
import { dataMissingInIndexedDB, saveToIndexedDB } from "../indexDB/Config";
import { GetStaticData, GetUsersAndAreas } from "../config/ApiCalls";

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

  useEffect(() => {
    const fetchStaticData = async () => {
      const STORE_NAMES = [
        "assignees",
        "requesters",
        "Departments",
        "statusOptions",
        "urgencyOptions",
        "priorityOptions",
        "typeOptions",
        "SoftwareStatus",
        "Computers",
        "Locations",
      ];
      const userId = Number(Cookies.get("user"));

      if (isNaN(userId)) {
        console.error("User ID is not a valid number.");
        return;
      }

      try {
        const missingStores = await dataMissingInIndexedDB(
          userId,
          "static_fields",
          STORE_NAMES
        );

        if (missingStores.length > 0) {
          try {
            const [usersAndAreasResponse, staticDataResponse] =
              await Promise.all([GetUsersAndAreas(), GetStaticData()]); //temporary users and area with websocket

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
              for (const store of missingStores) {
                if (data.hasOwnProperty(store) && data[store] !== undefined) {
                  await saveToIndexedDB(
                    userId,
                    "static_fields",
                    store,
                    data[store]
                  );
                } else {
                  console.warn(
                    `Data for store "${store}" is missing or undefined in the API response.`
                  );
                }
              }
              console.log("Fetched from API and saved to IndexedDB");
            } else {
              console.error("Invalid data received from the API:", data);
            }
          } catch (error) {
            console.error("Failed to fetch or save data:", error);
          }
        } else {
          console.log("Using cached data");
        }
      } catch (error) {
        console.error("Error checking IndexedDB or fetching data:", error);
      }
    };

    fetchStaticData();
  }, []);

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
