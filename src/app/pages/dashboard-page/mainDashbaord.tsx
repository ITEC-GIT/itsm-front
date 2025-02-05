import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { SidebarMain } from "../../components/dashboard/sidebarMain";

const MainDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const userId = Number(Cookies.get("user"));
  console.log("userId ==>>", userId);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div className="container-fluid">
      <div className="row">
        <div
          className={`col-md-4 bg-primary text-white position-fixed ${
            isSidebarOpen ? "d-block" : "d-none d-md-block"
          }`}
          style={{
            width: isSidebarOpen ? "80%" : "250px",
            height: "100%",
            maxHeight: "68%",
            borderRadius: isSidebarOpen ? "0" : "10px",
            boxShadow: "0 0 10px 0 rgba(100,100,100,0.1)",
            overflowY: "auto",
            zIndex: 99,
          }}
        >
          <SidebarMain />
        </div>

        <button
          className="btn btn-primary position-fixed d-md-none"
          style={{
            width: "40px",
            height: "100px",
            borderRadius: " 0 50%  50% 0",
            fontWeight: "bold",
            top: "50%",
            left: isSidebarOpen ? "84%" : "0",
            transform: "translateY(-50%)",
            writingMode: "vertical-rl",
            textOrientation: "upright",

            zIndex: 100,
          }}
          onClick={toggleSidebar}
        >
          {isSidebarOpen ? "Back" : "Menu"}
        </button>

        <div
          className={`col-md-8 offset-md-3 p-4 `}
          style={{
            maxHeight: "calc(100vh - 250px)",
            overflowY: "auto",
          }}
        >
          <div className="row"></div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
