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
import { fetchStaticData } from "../../utils/fetchStaticData";

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
