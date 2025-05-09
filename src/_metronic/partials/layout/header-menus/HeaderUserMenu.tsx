import { FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../../app/modules/auth";
import { Languages } from "./Languages";
import { toAbsoluteUrl } from "../../../helpers";
import { useSetAtom } from "jotai";
import {
  isAuthenticatedAtom,
  userAtom,
} from "../../../../app/atoms/auth-atoms/authAtom";
import { authChannel } from "../../../../app/pages/login-page/authChannel";
import Cookies from "js-cookie";
import { UserAtomType } from "../../../../app/types/AuthTypes";
// import { UserAtomType } from "../../../../app/atoms/auth-atoms/authAtom";

const HeaderUserMenu: FC = () => {
  const { currentUser } = useAuth();
  const setUserAtom = useSetAtom(userAtom);
  const setIsAuthAtom = useSetAtom(isAuthenticatedAtom);
  const navigate = useNavigate();
  const logout = () => {
    console.log("logout");
    Cookies.set("isAuthenticated", "false");
    Cookies.remove("session_token");
    setUserAtom({} as UserAtomType);
    setIsAuthAtom(false);

    authChannel.postMessage("logout");
    navigate("/auth/login");
  };
  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <img alt="Logo" src={toAbsoluteUrl("media/avatars/300-3.jpg")} />
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {currentUser?.first_name} {currentUser?.first_name}
              <span className="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">
                Pro
              </span>
            </div>
            <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className="separator my-2"></div>

      <div className="menu-item px-5">
        <Link to={"#"} className="menu-link px-5 disabled-link">
          My Profile
        </Link>
      </div>

      <div className="separator my-2"></div>

      <Languages />

      <div className="menu-item px-5 my-1">
        <Link to="#" className="menu-link px-5 disabled-link">
          Account Settings
        </Link>
      </div>

      <div className="menu-item px-5">
        <a onClick={() => logout()} className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
