import axios from "axios";
import Cookies from "js-cookie";

import { ErrorResponse } from "../types/AuthTypes";
import {
  CreateSoftInstRequestType,
  GetAllSoftwareInstallationRequestType,
} from "../types/softwareInstallationTypes";
import {
  PrivateApiCall,
  PublicApiCall,
  getSessionTokenFromCookie,
} from "./Config";
const BASE_URL = import.meta.env.VITE_APP_ITSM_GLPI_SSH_URL;

const errorCatch = (error: ErrorResponse) => {
  console.log("ERROR API CALL", error, error?.response);
  if (error.response) {
    if (error.response?.data) {
      return error.response?.data;
    }
    return error.response;
  } else {
    return error;
  }
};

/** ******************************************************************************************* */
/** ************************************** Login *********************************************** */
/** ******************************************************************************************* */

async function LoginApi(login: string, password: string) {
  const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
  const authHeader = `Basic ${btoa(`${login}:${password}`)}`;

  return await PublicApiCall.get(`/initSession/`, {
    params: {
      get_full_session: true,
    },
    headers: {
      "app-token": appToken,
      Authorization: authHeader,
    },
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** ******************************************************************************************* */
/** ************************************** User *********************************************** */
/** ******************************************************************************************* */

async function GetUserProfile() {
  return await PrivateApiCall.get(`/getActiveProfile/`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetUsers() {
  return await PublicApiCall.get(`//`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}
/** *********************************************************************************************/
/** ************************************** Tickets **********************************************/
/** *********************************************************************************************/

async function GetTicketsView() {
  return await PrivateApiCall.get(`/TicketsView/`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

// http://192.168.151.22/apirest.php/TicketsView?idgt=1&range=0-3&order=asc , starting from max id 1 , we get 4 items
async function GetTicketsViewById(range: string, order: string, idgt?: number) {
  const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
  const sessionToken = getSessionTokenFromCookie();
  const params: any = {
    range,
    order,
  };

  if (idgt !== undefined) {
    params.idgt = idgt;
  }
  return await PublicApiCall.get(`/TicketsView`, {
    params,
    headers: {
      "App-Token": appToken,
      "Session-Token": sessionToken,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** ********************************************************************************************/
/** ************************************** Dashboard *******************************************/
/** ********************************************************************************************/

async function GetDashboardAnalytics() {
  return await PrivateApiCall.get(`/AnalyticsDashboard/`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/
/** ************************************** Branches *********************************************/
/** *********************************************************************************************/

async function GetBranches() {
  return await PublicApiCall.get(`//`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/
/** ************************************** Remote SSH *******************************************/
/** *********************************************************************************************/

function getXsrfTokenFromCookies(): string {
  const match = Cookies.get("xyz");
  console.log("match ==>>", match);
  return match ?? "";
}

const fetchXSRFToken = async () => {
  // const tokenResponse = await fetch(`${BASE_URL}/xsrf-token`, {
  //   method: "GET",
  //   credentials: "include",
  // });
  // const { _xsrf } = await tokenResponse.json();
  // console.log("_xsrf ==>", _xsrf);
  // return _xsrf;

  // const response = await axios.get(`${BASE_URL}/xsrf-token`, {
  //   withCredentials: true,
  // });
  const response = await axios.get(`${BASE_URL}/xsrf-token`);
  return response.data._xsrf;
};

async function RemoteSSHConnect(
  hostname: string,
  port: number,
  username: string,
  pass: string
) {
  try {
    const xsrfToken = await fetchXSRFToken();

    const requestData = new URLSearchParams({
      hostname: hostname,
      port: port.toString(),
      username: username,
      password: pass,
      term: "xterm-256color",
      _xsrf: xsrfToken,
    });

    const response = await fetch(`${BASE_URL}/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-XSRFToken": xsrfToken,
      },
      body: requestData,
    });

    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("SSH Connection Error:", error);
    throw error;
  }
}

// const xsrfToken = getXsrfTokenFromCookies();
// if (!xsrfToken) {
//   console.warn("XSRF token missing from cookies. Fetching a new one...");
//   await fetchXSRFToken();
// }

// const xsrfToken = await fetchXSRFToken();

// const requestData = new URLSearchParams({
//   hostname: hostname,
//   port: port.toString(),
//   username: username,
//   password: pass,
//   term: "xterm-256color",
//   _xsrf: xsrfToken,
// }).toString();

// const response = await axios.post(`${BASE_URL}/`, requestData, {
//   withCredentials: true,
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//     "X-Xsrf-Token": xsrfToken,
//     Cookie: `_xsrf=${xsrfToken}`,
//   },
// });

// console.log(response);
// return response.data;
// } catch (error) {
//   console.error("SSH Connection Error:", error);
//   throw error;
// }
// }

// async function RemoteSSHConnect(
//   hostname: string,
//   port: number,
//   username: string,
//   pass: string
// ) {
//   try {
//     const response = await axios.post(
//       `${BASE_URL}/?hostname=${hostname}&username=${username}&password=${btoa(
//         pass
//       )}`,
//       new URLSearchParams({
//         hostname: hostname,
//         port: port.toString(),
//         username: username,
//         password: pass,
//         term: "xterm-256color",
//         _xsrf: getXsrfTokenFromCookies(),
//       }).toString(),
//       {
//         withCredentials: true,
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       }
//     );
//     console.log(response);
//     return response.data;
//   } catch (error) {
//     console.error("SSH Connection Error:", error);
//     throw error;
//   }
// }

/** *********************************************************************************************/
/** ************************************** Software Installation ********************************/
/** *********************************************************************************************/
async function FetchAllSoftwareInstallations(
  range: string,
  order: string,
  idgt?: number,
  searchQuery?: string
) {
  return await PrivateApiCall.get(`/CTSoftwareInstallation/`, {
    params: {
      expand_dropdowns: 1,
      range,
      order,
      idgt,
    },
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function InitiateSoftwareInstallation(data: FormData) {
  return await PrivateApiCall.post(`/antitheft/software_installation`, data)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function CancelSoftwareInstallation(id: number) {
  const body = {
    input: {
      status: "cancelled",
    },
  };

  return await PrivateApiCall.patch(`/CTSoftwareInstallation/${id}`, body)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetAllSoftwareInstallations(
  data?: GetAllSoftwareInstallationRequestType
) {
  return await PrivateApiCall.post(`/GetSoftwareInstallation/`, data)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/
/** ************************************** Computers ********************************************/
/** *********************************************************************************************/
async function GetAllComputers() {
  return await PrivateApiCall.get(`/Computer`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetComputer(id: number) {
  return await PrivateApiCall.get(`/Computer/${id}`, {
    params: {
      expand_dropdowns: 1,
    },
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetPrivateIPAddress(id: number) {
  return await PrivateApiCall.get(`/AntComputerIP/`, {
    params: {
      get_hateoas: false,
      order: "DESC",
      "searchText[computers_id]": id,
      range: "0-0",
    },
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/
/** ************************************** Locations ********************************************/
/** *********************************************************************************************/
async function GetAllLocations() {
  return await PrivateApiCall.get(`/location`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/
/** ************************************** Static Data ******************************************/
/** *********************************************************************************************/
async function GetStaticData() {
  return await PrivateApiCall.get(`/GetStaticData`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetUsersAndAreas() {
  return await PrivateApiCall.get(`/UsersAndAreas`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

export {
  LoginApi,
  GetUserProfile,
  GetTicketsViewById,
  GetUsers,
  GetBranches,
  GetDashboardAnalytics,
  InitiateSoftwareInstallation,
  FetchAllSoftwareInstallations,
  CancelSoftwareInstallation,
  RemoteSSHConnect,
  GetAllComputers,
  GetComputer,
  GetPrivateIPAddress,
  GetAllSoftwareInstallations,
  GetAllLocations,
  GetStaticData,
  fetchXSRFToken,
  GetUsersAndAreas,
};
