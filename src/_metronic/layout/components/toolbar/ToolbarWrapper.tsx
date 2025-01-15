import clsx from 'clsx'
import { ToolbarType, useLayout } from '../../core'
import { Toolbar } from './Toolbar'
import { PageTitleWrapper } from "./page-title";
import { PageTitleWrapperTickets } from "./page-title";

import { useState } from "react";

const ToolbarWrapper = ({
  setDashboardView,
  source,
}: {
  setDashboardView?: React.Dispatch<React.SetStateAction<"main" | "analytics">>;
  source:string;
}) => {
  console.log("source ==> ", source)
  const [currentView, setCurrentView] = useState<"main" | "analytics">("main");

  const { config, classes } = useLayout();
  if (!config.app?.toolbar?.display) {
    return null;
  }
  const isPageTitleVisible = showPageTitle(
    config.app?.toolbar?.layout,
    config.app?.pageTitle?.display
  )
  const handleToggleView = () => {
    if (setDashboardView) {
      const newView = currentView === "main" ? "analytics" : "main";
      setCurrentView(newView);
      setDashboardView(newView);
    }
  };
  return (
    <div
      id='kt_app_toolbar'
      className={clsx('app-toolbar', classes.toolbar.join(' '), config?.app?.toolbar?.class)}
    >
   
      <div
        id='kt_app_toolbar_container'
        className={clsx(
          'app-container',
          classes.toolbarContainer.join(' '),
          config.app?.toolbar?.containerClass,
          config.app?.toolbar?.minimize?.enabled ? 'app-toolbar-minimize' : '',
          {
            'container-fluid': config.app?.toolbar?.container === 'fluid',
            'container-xxl': config.app?.toolbar?.container === 'fixed',
          }
        )}
      >
       {isPageTitleVisible && setDashboardView ? (
          <div
            className="d-flex align-items-center gap-2"
            onClick={handleToggleView}
            style={{ cursor: "pointer" }}
          >
            <i
              className={
                currentView === "main"
                  ? "bi bi-box"
                  : currentView === "analytics"
                  ? "bi bi-bar-chart"
                  : ""
              }
              style={{
                color: "black",
                fontSize: "medium",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
                padding: "5px",
              }}
            ></i>
            {currentView === "analytics" ? (
              <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
                Analytics
              </h1>
            ) : (
              ""
            )}
            <PageTitleWrapper />
          </div>
        ): source && source === 'tickets' ?  (<><PageTitleWrapperTickets /><Toolbar /> </>) : ( <><PageTitleWrapper /></> 
        )}
      
          
      </div>
    </div>
  )
}

const showPageTitle = (appToolbarLayout?: ToolbarType, appPageTitleDisplay?: boolean): boolean => {
  const viewsWithPageTitles = ['classic', 'reports', 'saas']
  if (!appToolbarLayout || !appPageTitleDisplay) {
    return false
  }

  return appPageTitleDisplay && viewsWithPageTitles.some((t) => t === appToolbarLayout)
}

export { ToolbarWrapper }


// const ToolbarWrapper = ({
//   setDashboardView,
//   isTicketPage,
// }: {
//   setDashboardView?: React.Dispatch<React.SetStateAction<"main" | "analytics">>;
//   isTicketPage?: boolean;
// }) => {
//   const [currentView, setCurrentView] = useState<"main" | "analytics">("main");

//   const { config, classes } = useLayout();
//   if (!config.app?.toolbar?.display) {
//     return null;
//   }
//   const isPageTitleVisible = showPageTitle(
//     config.app?.toolbar?.layout,
//     config.app?.pageTitle?.display
//   )
//   const handleToggleView = () => {
//     if (setDashboardView) {
//       const newView = currentView === "main" ? "analytics" : "main";
//       setCurrentView(newView);
//       setDashboardView(newView);
//     }
//   };
//   return (
//     <div
//       id='kt_app_toolbar'
//       className={clsx('app-toolbar', classes.toolbar.join(' '), config?.app?.toolbar?.class)}
//     >
   
//       <div
//         id='kt_app_toolbar_container'
//         className={clsx(
//           'app-container',
//           classes.toolbarContainer.join(' '),
//           config.app?.toolbar?.containerClass,
//           config.app?.toolbar?.minimize?.enabled ? 'app-toolbar-minimize' : '',
//           {
//             'container-fluid': config.app?.toolbar?.container === 'fluid',
//             'container-xxl': config.app?.toolbar?.container === 'fixed',
//           }
//         )}
//       >
//        {isPageTitleVisible && !isTicketPage ? (
//           <div
//             className="d-flex align-items-center gap-2"
//             onClick={handleToggleView}
//             style={{ cursor: "pointer" }}
//           >
//             <i
//               className={
//                 currentView === "main"
//                   ? "bi bi-box"
//                   : currentView === "analytics"
//                   ? "bi bi-bar-chart"
//                   : ""
//               }
//               style={{
//                 color: "black",
//                 fontSize: "medium",
//                 backgroundColor: "#f0f0f0",
//                 borderRadius: "5px",
//                 padding: "5px",
//               }}
//             ></i>
//             {currentView === "analytics" ? (
//               <h1 className="page-heading d-flex text-gray-900 fw-bold fs-3 my-0 flex-column justify-content-center">
//                 Analytics
//               </h1>
//             ) : (
//               ""
//             )}
//             <PageTitleWrapper />
//           </div>
//         ) : null}
        
//         {isTicketPage && (<>       {isPageTitleVisible && <PageTitleWrapperTickets />}
//           <Toolbar /></> )  }
//       </div>
//     </div>
//   )
// }
