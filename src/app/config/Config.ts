import axios from "axios";

export const PublicApiCall = axios.create({
  baseURL: 'https://cobalt.pulsar.ao/apirest.php'
});

export const PrivateApiCall = axios.create({
  baseURL: 'https://cobalt.pulsar.ao/apirest.php',
  withCredentials: true,
});

export function getSessionTokenFromCookie() {
  const match = document.cookie.match(/session_token=([^;]+)/);
  return match ? match[1] : null;
}

PrivateApiCall.interceptors.request.use(
  (req: any) => {
    const sessionToken = getSessionTokenFromCookie();
    const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
    if (sessionToken) {
      req.headers["Session-Token"] = sessionToken;
    }
    if (appToken) {
      req.headers["App-Token"] = appToken;
    }
    return req;
  },
  (err: any) => {
    throw err;
  }
);

PrivateApiCall.interceptors.response.use(
  (res: any) => {
    return res;
  },
  (err: any) => {
    throw err;
  }
);
