import Cookies from "js-cookie";
import { dataMissingInIndexedDB, saveToIndexedDB } from "../app/indexDB/Config";
import { GetStaticData, GetUsersAndAreas } from "../app/config/ApiCalls";
import { useAtom } from "jotai";

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
  "SoftwareDeploymentStatus",
];

// export const fetchStaticData = async () => {
//   const userId = Number(Cookies.get("user"));
//   if (isNaN(userId)) {
//     console.error("User ID is not a valid number.");
//     return;
//   }

//   try {
//     const missingStores = await dataMissingInIndexedDB(
//       userId,
//       "static_fields",
//       STORE_NAMES
//     );

//     if (missingStores.length > 0) {
//       try {
//         const [usersAndAreasResponse, staticDataResponse] = await Promise.all([
//           GetUsersAndAreas(),
//           GetStaticData(),
//         ]);

//         if (
//           usersAndAreasResponse.status !== 200 ||
//           staticDataResponse.status !== 200
//         ) {
//           throw new Error(
//             `Network response was not ok:
//             UsersAndAreas: ${usersAndAreasResponse.status} ${usersAndAreasResponse.statusText},
//             StaticData: ${staticDataResponse.status} ${staticDataResponse.statusText}`
//           );
//         }

//         const data = {
//           ...staticDataResponse.data,
//           ...usersAndAreasResponse.data,
//         };

//         if (typeof data === "object" && data !== null) {
//           for (const store of missingStores) {
//             if (store === "SoftwareDeploymentStatus") {
//               const softwareDeploymentStatus = [];

//               if (data["Received softwares"] !== undefined) {
//                 softwareDeploymentStatus.push({
//                   key: "received",
//                   value: data["Received softwares"],
//                 });
//               }

//               if (data["Initialized softwares"] !== undefined) {
//                 softwareDeploymentStatus.push({
//                   key: "initialized",
//                   value: data["Initialized softwares"],
//                 });
//               }

//               if (softwareDeploymentStatus.length > 0) {
//                 await saveToIndexedDB(
//                   userId,
//                   "static_fields",
//                   "SoftwareDeploymentStatus",
//                   softwareDeploymentStatus
//                 );
//               }
//             } else if (
//               data.hasOwnProperty(store) &&
//               data[store] !== undefined
//             ) {
//               await saveToIndexedDB(
//                 userId,
//                 "static_fields",
//                 store,
//                 data[store]
//               );
//             } else {
//               console.warn(
//                 `Data for store "${store}" is missing or undefined in the API response.`
//               );
//             }
//           }
//           console.log("Fetched from API and saved to IndexedDB");
//         } else {
//           console.error("Invalid data received from the API:", data);
//         }
//       } catch (error) {
//         console.error("Failed to fetch or save data:", error);
//       }
//     } else {
//       console.log("Using cached data");
//     }
//   } catch (error) {
//     console.error("Error checking IndexedDB or fetching data:", error);
//   }
// };

export const fetchStaticDataWithAtom = async () => {
  try {
    // const [staticData, setStaticData] = useAtom(staticDataAtom);

    const [usersAndAreasResponse, staticDataResponse] = await Promise.all([
      GetUsersAndAreas(),
      GetStaticData(),
    ]);

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
      const x = 0;
      // setStaticData(data);
    } else {
      console.error("Invalid data received from the API:", data);
    }
  } catch (error) {
    console.error("Error checking IndexedDB or fetching data:", error);
  }
};
