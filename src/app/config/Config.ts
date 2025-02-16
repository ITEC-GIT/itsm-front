import axios from "axios";
import Cookies from "js-cookie";

export const PublicApiCall = axios.create({
  baseURL: import.meta.env.VITE_APP_ITSM_GLPI_API_BASE_URL,
});

export const PrivateApiCall = axios.create({
  baseURL: import.meta.env.VITE_APP_ITSM_GLPI_API_BASE_URL,
  withCredentials: true,
});

export function getSessionTokenFromCookie() {
  const match = document.cookie.match(/session_token=([^;]+)/);
  return match ? match[1] : null;
}

// PrivateApiCall.interceptors.request.use(
//   (req: any) => {
//     const sessionToken = getSessionTokenFromCookie();
//     const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
//     if (sessionToken) {
//       req.headers["Session-Token"] = sessionToken;
//     }
//     if (appToken) {
//       req.headers["App-Token"] = appToken;
//     }
//     req.headers["Content-Range"] = "bytes 0-499/10000";

//     return req;
//   },
//   (err: any) => {
//     throw err;
//   }
// );

// PrivateApiCall.interceptors.response.use(
//   (res: any) => {
//     return res;
//   },
//   (error: any) => {
//     if (error.response?.status === 401) {
//       window.location.href = "/pulsar/itsm/auth/login";
//       Cookies.set("isAuthenticated", "false");
//       Cookies.remove("session_token");
//     }
//     throw error;
//   }
// );

// PublicApiCall.interceptors.request.use(
//   (req: any) => {
//     const sessionToken = getSessionTokenFromCookie();
//     const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
//     if (sessionToken) {
//       req.headers["Session-Token"] = sessionToken;
//     }
//     if (appToken) {
//       req.headers["App-Token"] = appToken;
//     }
//     req.headers["Content-Range"] = "bytes 0-499/10000";

//     return req;
//   },
//   (err: any) => {
//     throw err;
//   }
// );

// PublicApiCall.interceptors.response.use(
//   (res: any) => {
//     return res;
//   },
//   (error: any) => {
//     if (error.response?.status === 401) {
//       // window.location.href = "/pulsar/itsm/auth/login";
//       Cookies.set("isAuthenticated", "false");
//       Cookies.remove("session_token");
//     }
//     throw error;
//   }
// );
