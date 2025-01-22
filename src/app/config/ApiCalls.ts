import { ErrorResponse } from "../types/AuthTypes";
import { CreateSoftInstRequestType } from "../types/softwareInstallation";
import {
  PrivateApiCall,
  PublicApiCall,
  getSessionTokenFromCookie,
} from "./Config";

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
/** ************************************** Software Installation ********************************/
/** *********************************************************************************************/
async function GetAllSoftwareInstallations() {
  return await PrivateApiCall.get(`/CTSoftwareInstallation`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function CreateSoftwareInstallation(data: CreateSoftInstRequestType) {
  return await PrivateApiCall.post(`/antitheft/software_installation`)
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

export {
  LoginApi,
  GetUserProfile,
  GetTicketsViewById,
  GetUsers,
  GetBranches,
  GetDashboardAnalytics,
  CreateSoftwareInstallation,
  GetAllSoftwareInstallations,
  GetAllComputers,
};
