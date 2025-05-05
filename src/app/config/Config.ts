import axios from "axios";
import Cookies from "js-cookie";

export const PublicApiCall = axios.create({
  baseURL: "https://cobalt.pulsar.ao/apirest.php",
});

export const PrivateApiCall = axios.create({
  baseURL: "https://cobalt.pulsar.ao/apirest.php",
  withCredentials: true,
});
export const PublicApiCallFastApi = axios.create({
    baseURL: import.meta.env.VITE_APP_ITSM_BACKEND_SERVICE,
});

export const PrivateApiCallFastApi = axios.create({
    baseURL: import.meta.env.VITE_APP_ITSM_BACKEND_SERVICE,
});
export const ImageUploadApiCall = axios.create({
  baseURL: import.meta.env.VITE_APP_ITSM_NGINX_IMAGES_URL,
});

export function getSessionTokenFromCookie() {
  const match = document.cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

PrivateApiCallFastApi.interceptors.request.use(
  (req: any) => {
    const sessionToken = getSessionTokenFromCookie(); // Get token from cookie or local storage
    if (sessionToken) {
      req.headers["Authorization"] = `Bearer ${sessionToken}`; // Use Bearer token
    }

    req.headers["Content-Range"] = "bytes 0-499/10000";

    return req;
  },
  (err: any) => {
    return Promise.reject(err);
  }
);

PrivateApiCallFastApi.interceptors.response.use(
  (res: any) => {
    return res;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      window.location.href = "/auth/login";
      Cookies.set("isAuthenticated", "false");
      Cookies.remove("access_token");
    }
    throw error;
  }
);

PublicApiCallFastApi.interceptors.request.use(
  (req: any) => {
    // const sessionToken = getSessionTokenFromCookie();
    // if (sessionToken) {
    //     req.headers["Authorization"] = `Bearer ${sessionToken}`; // Use Bearer token
    // }

    req.headers["Content-Range"] = "bytes 0-499/10000";

    return req;
  },
  (err: any) => {
    throw err;
  }
);

PublicApiCallFastApi.interceptors.response.use(
  (res: any) => {
    return res;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      window.location.href = "/auth/login";
      Cookies.set("isAuthenticated", "false");
      Cookies.remove("access_token");
    }
    throw error;
  }
);

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
    req.headers["Content-Range"] = "bytes 0-499/10000";

    return req;
  },
  (err: any) => {
    throw err;
  }
);

PublicApiCall.interceptors.request.use(
  (req: any) => {
    const sessionToken = getSessionTokenFromCookie();
    const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
    if (sessionToken) {
      req.headers["Session-Token"] = sessionToken;
    }
    if (appToken) {
      req.headers["App-Token"] = appToken;
    }
    req.headers["Content-Range"] = "bytes 0-499/10000";

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
  (error: any) => {
    if (error.response?.status === 401) {
      // window.location.href = "/auth/login";
      // Cookies.set("isAuthenticated", "false");
      // Cookies.remove("access_token");
    }
    throw error;
  }
);

PublicApiCall.interceptors.response.use(
  (res: any) => {
    return res;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      // window.location.href = "/pulsar/itsm/auth/login";
      // Cookies.set("isAuthenticated", "false");
      // Cookies.remove("access_token");
    }
    throw error;
  }
);
