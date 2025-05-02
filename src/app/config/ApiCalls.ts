import { ErrorResponse } from "../types/AuthTypes";
import {
  CreateSoftInstRequestType,
  GetAllSoftwareInstallationRequestType,
} from "../types/softwareInstallationTypes";
import Cookies from "js-cookie";

import {
  ApiRequestBody,
  UpdateTicketRequestBody,
  UpdateTicketReplyRequestBody,
} from "./ApiTypes";
import {
  PrivateApiCall,
  PublicApiCall,
  getSessionTokenFromCookie,
  ImageUploadApiCall,
  PrivateApiCallFastApi,
  PublicApiCallFastApi,
} from "./Config";
import { ImageUploadData, ImageUploadResponse } from "../types/TicketTypes.ts";
import axios from "axios";
import { CreateUserType } from "../types/user-management.ts";
import {
  ExecuteAntitheftType,
  GetAntitheftType,
} from "../types/antitheftTypes.ts";

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
  // const authHeader = `Basic ${btoa(`${login}:${password}`)}`;
  const baseURL = import.meta.env.VITE_APP_ITSM_BACKEND_SERVICE;

  return await axios
    .post(
        `${baseURL}/session/init_session`,
      new URLSearchParams({
        username: login,
        password: password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

const FetchFilteredTickets = async (body: ApiRequestBody): Promise<any> => {
  try {
    const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
    const sessionToken = getSessionTokenFromCookie();
    const params: any = {
      range: body.range,
      order: body.order,
    };
    if (body.starred === 1) {
      const asd = 0;
    }
    if (body.idgt !== undefined) {
      params.idgt = body.idgt;
    }
    console.log(body);
    const response = await PrivateApiCallFastApi.post(
      "/tickets/filter_tickets",
      body,
      {
        headers: {
          "App-Token": appToken,
          "Session-Token": sessionToken,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return only the data
  } catch (error: any) {
    errorCatch(error); // Use your existing error handler
    throw error; // Rethrow the error for additional handling if necessary
  }
};

const UpdateTicket = async (body: UpdateTicketRequestBody): Promise<any> => {
  try {
    const response = await PrivateApiCallFastApi.put(
      "/tickets/update_ticket",
      body,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response; // Return only the data
  } catch (error: any) {
    errorCatch(error); // Use your existing error handler
    throw error; // Rethrow the error for additional handling if necessary
  }
};

/** ******************************************************************************************* */
/** ************************************** User *********************************************** */
/** ******************************************************************************************* */
async function GetTicketWithReplies(ticketId: number) {
  return await PrivateApiCallFastApi.get(`/tickets/get_replies/${ticketId}`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetTicketAttachments(ticketId: number) {
  return await PrivateApiCall.get(`/Ticket/${ticketId}/Document/`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

const SendRepliesAsync = async (
  ticketId: number,
  text: string
): Promise<any> => {
  const headers = {
    "Content-Type": "application/json",
    "Session-Token": getSessionTokenFromCookie(),
    "App-Token": import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN,
  };

  const payload = {
    itemtype: "Ticket",
    ticket_id: ticketId,
    content: text,
  };
  await PrivateApiCallFastApi.post(`/tickets/create_reply`, payload, {
    headers: headers,
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
};

async function GetUserProfile() {
  return await PrivateApiCall.get(`/getActiveProfile/`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetAllUsersAPI() {
  return await PrivateApiCallFastApi.get(`/users/get_users`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function CreateUserAPI(userData: CreateUserType) {
  return await PrivateApiCallFastApi.post(`/users/create_user`, userData)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function UpdateUserAPI(userId: number, userData: CreateUserType) {
  return await PrivateApiCallFastApi.put(
    `/users/update_user/${userId}`,
    userData
  )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function DeleteUserAPI(userId: number) {
  return await PrivateApiCallFastApi.delete(`/users/delete_user/${userId}`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/

/** ************************************** Tickets **********************************************/
/** *********************************************************************************************/

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
  return await PrivateApiCall.get(`/AnalyticsDashboard`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetDashboardLandingData() {
  return await PrivateApiCallFastApi.get(`/dashboard/metrics`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetTicketCountsByStatusAndMonth(
  status: string,
  from_date?: Date,
  to_date?: Date
) {
  return await PrivateApiCallFastApi.get(`/dashboard/status-counts`, {
    params: {
      status: status,
      from_date: from_date,
      to_date: to_date,
    },
  })
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
async function GetAllComputersAPI() {
  return await PrivateApiCall.get(`/Computer`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetComputer(id: number) {
  return await PrivateApiCallFastApi.get(`/inventories/computers/${id}`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetPrivateIPAddressAPI() {
  return await PrivateApiCallFastApi.get(
    `/inventories/computer/get_private_ip_latest`
  )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetComputerDetailsAPI(computerId: number) {
  return await PrivateApiCallFastApi.get(`/inventories/assets/${computerId}`)
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
async function GetPrerequisitesAPI() {
  return await PrivateApiCallFastApi.get(`/users/get_prerequisites`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetStaticData() {
  return await PrivateApiCallFastApi.get(`/static/static_data`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function UpdateActions(
  ticketId: number,
  ticketStatusId: number,
  ticketUrgencyId: number,
  ticketPriorityId: number,
  ticketTypeID: number
) {
  const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
  const sessionToken = getSessionTokenFromCookie();

  const ticketUpdateBody = {
    id: ticketId,
    status: ticketStatusId,
    urgency: ticketUrgencyId,
    priority: ticketPriorityId,
    type: ticketTypeID,
    due_date: "",
  };

  const response = await PrivateApiCall.put(
    "/update_ticket",
    ticketUpdateBody,
    {
      headers: {
        "App-Token": appToken,
        "Session-Token": sessionToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function UpdateStarred(ticketId: number, starred: number) {
  const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
  const sessionToken = getSessionTokenFromCookie();

  const ticketStarredBody = {
    id: ticketId,
    starred: starred,
  };

  const response = await PrivateApiCallFastApi.put(
    "/tickets/update_ticket",
    ticketStarredBody,
    {
      headers: {
        "App-Token": appToken,
        "Session-Token": sessionToken,
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetUsersAndAreas() {
  return await PrivateApiCallFastApi.get(`/static/users_areas`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function PostReplyImages(formData: any, filetype: string) {
  try {
    const nginxServer = import.meta.env.VITE_APP_ITSM_NGINX_IMAGES_URL;
    const url = new URL(`${nginxServer}/upload-image`);
    url.searchParams.append("filetype", filetype);

    const response = await fetch(url.toString(), {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: ImageUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, message: "Failed to upload image." };
  }
}

async function bulkDeleteImages(urlsToDelete: any) {
  try {
    const nginxServer = import.meta.env.VITE_APP_ITSM_NGINX_IMAGES_URL;

    // Send the list of URLs in the DELETE request
    const response = await fetch(`${nginxServer}/delete-images`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls: urlsToDelete }), // Send the URLs as JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Bulk deletion result:", data);
    return data; // Assuming the response is a JSON object with the status
  } catch (error) {
    console.error("Error deleting images in bulk:", error);
    return { success: false, message: "Failed to delete images." };
  }
}

const fetchAndOpenFile = async (url: string) => {
  if (!url || url === "#") return;

  try {
    // const response = await fetch(url, {
    //     method: "GET",
    //     headers: {
    //         Authorization: "Bearer YOUR_AUTH_TOKEN", // Replace with your actual token
    //         "Content-Type": "application/pdf", // Adjust based on file type
    //     },
    // });
    const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
    const sessionToken = getSessionTokenFromCookie();
    const attachmentFiles = import.meta.env
      .VITE_APP_ITSM_GLPI_API_BASE_ATTACHMENT_FILES;

    const attachmentSent = `${attachmentFiles}/${url}`;
    const response = await fetch(attachmentSent, {
      method: "GET",
      headers: {
        "App-Token": appToken,
        "Session-Token": sessionToken || "",
        "Content-Type": "application/json",
      },
    });

    if (response.status != 200) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    window.open(blobUrl, "_blank");
  } catch (error) {
    console.error("Error fetching the file:", error);
  }
};

/** *********************************************************************************************/
/** ************************************** Users Titles ******************************************/
/** *********************************************************************************************/
async function GetAllTitlesAPI() {
  return await PrivateApiCallFastApi.get(`/titles/get_titles`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function CreateTitleAPI(title: string) {
  return await PrivateApiCallFastApi.post(`/titles/create_title`, {
    title: title,
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/
/** ************************************** Assets ******************************************/
/** *********************************************************************************************/
async function GetAssetsAPI(filters: any) {
  return await PrivateApiCallFastApi.post(
    `/inventories/assets/filter`,
    filters,
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetAssetCategories() {
  return await PrivateApiCallFastApi.get(`/inventories/assets/categories`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetAssetActions(asset_type_id: number) {
  return await PrivateApiCallFastApi.get(
    `/inventories/assets/${asset_type_id}/actions/`
  )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function GetAssetSoftwares(computerId: number) {
  return await PrivateApiCallFastApi.get(
    `/inventories/assets/${computerId}/softwares`
  )
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

/** *********************************************************************************************/
/** ************************************** Actions **********************************************/
/** *********************************************************************************************/
async function GetAntitheftActionAPI(data: GetAntitheftType) {
  return await PrivateApiCallFastApi.get(`/anti-theft/commands/results/`)
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

async function ExecuteAntitheftActionAPI(data: ExecuteAntitheftType) {
  return await PrivateApiCallFastApi.post(`/anti-theft/commands/actions/`, {
    data,
  })
    .then((response) => response)
    .catch((error: any) => errorCatch(error));
}

export {
  LoginApi,
  GetUserProfile,
  GetTicketsViewById,
  GetAllUsersAPI,
  CreateUserAPI,
  UpdateUserAPI,
  DeleteUserAPI,
  GetBranches,
  GetDashboardAnalytics,
  InitiateSoftwareInstallation,
  FetchAllSoftwareInstallations,
  CancelSoftwareInstallation,
  GetAllSoftwareInstallations,
  GetAllComputersAPI,
  GetComputerDetailsAPI,
  GetAllLocations,
  GetStaticData,
  GetUsersAndAreas,
  FetchFilteredTickets,
  UpdateStarred,
  UpdateTicket,
  fetchXSRFToken,
  GetPrivateIPAddressAPI,
  PostReplyImages,
  bulkDeleteImages,
  GetComputer,
  RemoteSSHConnect,
  SendRepliesAsync,
  GetTicketWithReplies,
  GetTicketAttachments,
  fetchAndOpenFile,
  GetAssetCategories,
  GetAssetsAPI,
  GetAssetActions,
  GetAssetSoftwares,
  GetDashboardLandingData,
  GetTicketCountsByStatusAndMonth,
  GetPrerequisitesAPI,
  GetAllTitlesAPI,
  CreateTitleAPI,
  GetAntitheftActionAPI,
  ExecuteAntitheftActionAPI,
};
