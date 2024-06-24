import React from "react";
import UserDropdown from "@app/modules/main/header/user-dropdown/UserDropdown";
import HeaderPartner from "./Header_Partner";

interface HeaderNavbarProps {
  toggleSidebar: () => void;
}
const HeaderNavbar: React.FC<HeaderNavbarProps> = ({ toggleSidebar }) => {
  return (
    <div style={{ padding: "2px 13px", backgroundColor: "black" }}>
      <div className=" d-flex">
        <div className="info mt-3">
          <i
            className="fas fa-bars"
            style={{ color: "white", cursor: "pointer" }}
            onClick={toggleSidebar}
          />
        </div>
        <ul className="navbar-nav ml-auto">
          <HeaderPartner />
        </ul>
      </div>
    </div>
  );
};

export default HeaderNavbar;
