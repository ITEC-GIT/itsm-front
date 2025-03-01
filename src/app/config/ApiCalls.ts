import {ErrorResponse} from "../types/AuthTypes";
import {
    CreateSoftInstRequestType,
    GetAllSoftwareInstallationRequestType,
} from "../types/softwareInstallationTypes";

import {ApiRequestBody, UpdateTicketRequestBody, UpdateTicketReplyRequestBody} from "./ApiTypes";
import {PrivateApiCall, PublicApiCall, getSessionTokenFromCookie, ImageUploadApiCall} from "./Config";
import {ImageUploadData, ImageUploadResponse} from "../types/TicketTypes.ts";
import axios from "axios";

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


const FetchFilteredTickets = async (body: ApiRequestBody): Promise<any> => {
    try {
        const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
        const sessionToken = getSessionTokenFromCookie();
        const params: any = {
            range: body.range,
            order: body.order,
        };

        if (body.idgt !== undefined) {
            params.idgt = body.idgt;
        }
        const response = await PrivateApiCall.post("/searchTickets", body, {
            headers: {
                "App-Token": appToken,
                "Session-Token": sessionToken,
                "Content-Type": "application/json",
            },
        });

        return response.data; // Return only the data
    } catch (error: any) {
        errorCatch(error); // Use your existing error handler
        throw error; // Rethrow the error for additional handling if necessary
    }
};

const UpdateTicket = async (body: UpdateTicketRequestBody): Promise<any> => {
    try {
        const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
        const sessionToken = getSessionTokenFromCookie();


        const response = await PrivateApiCall.post("/UpdateTicket", body, {
            headers: {
                "App-Token": appToken,
                "Session-Token": sessionToken,
                "Content-Type": "application/json",
            },
        });

        return response; // Return only the data
    } catch (error: any) {
        errorCatch(error); // Use your existing error handler
        throw error; // Rethrow the error for additional handling if necessary
    }
};
/** ******************************************************************************************* */

/** ************************************** User *********************************************** */
/** ******************************************************************************************* */


const SendRepliesAsync = async (ticketId: number, text: string): Promise<any> => {
    const url = `https://cobalt.pulsar.ao/apirest.php/Ticket/${ticketId}/ITILFollowup`;


    const headers = {
        "Content-Type": "application/json",
        "Session-Token": getSessionTokenFromCookie(),
        "App-Token": import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN
    };

    const payload = {
        input: {
            itemtype: "Ticket",
            items_id: ticketId,
            content: text,
        },
    };

    axios.post(url, payload, {headers})
        .then(response => {
            console.log(`Response for Ticket ${ticketId}: ${response.status}`);
            console.log(response.data);
        })
        .catch(error => {
            console.error("Error posting follow-up:", error);
        });

};

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

async function UpdateActions(ticketId: number, ticketStatusId: number, ticketUrgencyId: number, ticketPriorityId: number, ticketTypeID: number) {
    const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
    const sessionToken = getSessionTokenFromCookie();

    const ticketUpdateBody = {
        "id": ticketId,
        "status": ticketStatusId,
        "urgency": ticketUrgencyId,
        "priority": ticketPriorityId,
        "type": ticketTypeID,
        "due_date": ""
    }

    const response = await PrivateApiCall.post("/UpdateTicket", ticketUpdateBody, {
        headers: {
            "App-Token": appToken,
            "Session-Token": sessionToken,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response)
        .catch((error: any) => errorCatch(error));


}

async function UpdateStarred(ticketId: number, starred: number) {
    const appToken = import.meta.env.VITE_APP_ITSM_GLPI_APP_TOKEN;
    const sessionToken = getSessionTokenFromCookie();

    const ticketStarredBody = {
        "id": ticketId,
        "starred": starred
    }

    const response = await PrivateApiCall.post("/UpdateTicket", ticketStarredBody, {
        headers: {
            "App-Token": appToken,
            "Session-Token": sessionToken,
            "Content-Type": "application/json",
        },
    })
        .then((response) => response)
        .catch((error: any) => errorCatch(error));


}

async function GetUsersAndAreas() {
    return await PrivateApiCall.get(`/UsersAndAreas`)
        .then((response) => response)
        .catch((error: any) => errorCatch(error));
}
async function GetTicketWithReplies(ticketId: number) {
    return await PrivateApiCall.get(`/ticketitilfollowups?id=${ticketId}`)
        .then((response) => response)
        .catch((error: any) => errorCatch(error));
}
async function PostReplyImages(formData: any) {
    try {

        const nginxServer = import.meta.env.VITE_APP_ITSM_NGINX_IMAGES_URL;
        const response = await fetch(`${nginxServer}/upload-image`, {
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
        return {success: false, message: "Failed to upload image."};
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
            body: JSON.stringify({urls: urlsToDelete}), // Send the URLs as JSON
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Bulk deletion result:", data);
        return data; // Assuming the response is a JSON object with the status
    } catch (error) {
        console.error("Error deleting images in bulk:", error);
        return {success: false, message: "Failed to delete images."};
    }
}


export {
    LoginApi,
    GetUserProfile,
    GetTicketsViewById,
    GetUsers,
    GetDashboardAnalytics,
    InitiateSoftwareInstallation,
    FetchAllSoftwareInstallations,
    CancelSoftwareInstallation,
    GetAllSoftwareInstallations,
    GetAllComputers,
    GetAllLocations,
    GetStaticData,
    GetUsersAndAreas,
    FetchFilteredTickets,
    UpdateStarred,
    UpdateTicket,
    PostReplyImages,
    bulkDeleteImages,
    SendRepliesAsync,GetTicketWithReplies
};
