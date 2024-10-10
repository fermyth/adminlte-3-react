/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation, Location } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { IMenuItem } from "@app/modules/main/menu-sidebar/MenuSidebar";
import { useAppSelector } from "@app/store/store"; // Assuming this hook is for accessing Redux store

const MenuItem = ({ menuItem }: { menuItem: IMenuItem }) => {
  const [t] = useTranslation();
  const [isMenuExtended, setIsMenuExtended] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuSidebarCollapsed = useAppSelector(
    (state) => state.ui.menuSidebarCollapsed
  ); // Accessing the sidebar collapsed state

  const toggleMenu = () => {
    setIsMenuExtended(!isMenuExtended);
  };

  const handleMainMenuAction = () => {
    if (isExpandable) {
      toggleMenu();
    } else {
      navigate(menuItem.path ? menuItem.path : "/");
    }
  };

  const calculateIsActive = (url: Location) => {
    let mainActive = false;
    let childrenActive = false;

    if (isExpandable && menuItem.children) {
      menuItem.children.forEach((item) => {
        if (item.path === url.pathname) {
          childrenActive = true;
          mainActive = true; // If a child is active, consider main menu active too
        }
      });
    } else if (menuItem.path === url.pathname) {
      mainActive = true;
    }

    setIsMainActive(mainActive);
    setIsOneOfChildrenActive(childrenActive);
    setIsMenuExtended(mainActive || childrenActive); // Extend menu if either main or child is active
  };

  useEffect(() => {
    if (location) {
      calculateIsActive(location);
    }
  }, [location, menuItem]);

  useEffect(() => {
    setIsExpandable(
      Boolean(menuItem && menuItem.children && menuItem.children.length > 0)
    );
  }, [menuItem]);

  return (
    <li className={`nav-item${isMenuExtended ? " menu-open" : ""}`}>
      <style>
        {`
          .nav-item .active {
            background-color: ${!menuSidebarCollapsed ? "#009879" : "transparent"};
            color: ${!menuSidebarCollapsed ? "white" : "#333333"};
            border-radius: 9px;
          }

          .nav-item .active p {
            color: ${!menuSidebarCollapsed ? "white" : "#333333"};
          }

          .nav-item .active i {
            color: ${!menuSidebarCollapsed ? "white" : "#333333"};
          }

          .nav-item i {
            color: ${!menuSidebarCollapsed ? "#009879" : "#009879"};
          }

          /* Styles for nested items */
          .nav-treeview {
            padding-left: 20px; /* Indent nested items */
            margin-top: 5px; /* Spacing between parent and child items */
          }

          .nav-treeview .nav-item .nav-link {
            padding-left: 30px; /* Indent nested link for better hierarchy */
            color: #333; /* Default color for nested items */
          }

          .nav-treeview .nav-item .nav-link:hover {
            background-color: ${!menuSidebarCollapsed ? "#e9ecef" : "transparent"};
            color: #007bff; /* Change color on hover */
          }

          .nav-treeview .nav-item .active {
            background-color: #009879; /* Highlight active child item */
            color: white;
          }

          /* Styling for the arrow icon */
          .arrow {
            margin-left: auto; /* Push the arrow to the right */
            display: flex;
            align-items: center; /* Center vertically */
            transition: transform 0.3s ease; /* Smooth transition */
            color: ${!menuSidebarCollapsed ? "#009879" : "#333333"}; /* Arrow color */
          }

          .arrow.open {
            transform: rotate(90deg); /* Rotate arrow when menu is open */
          }

          /* Adjusting the main menu link for better alignment */
          .nav-link {
            display: flex; /* Flex layout for main link */
            align-items: center; /* Center items vertically */
            padding: 10px 15px; /* Better padding for clickable area */
            text-decoration: none; /* Remove underline from links */
            color: inherit; /* Inherit color from parent */
          }

          .nav-link:hover {
            background-color: ${!menuSidebarCollapsed ? "#e0f7fa" : "transparent"}; /* Light background on hover */
          }

          /* Main menu text */
          .nav-link p {
            margin: 0; /* Remove default margin for better alignment */
          }
        `}
      </style>
      <a
        className={`nav-link${(isMainActive || isOneOfChildrenActive) && !menuSidebarCollapsed ? " active" : ""}`}
        role="link"
        onClick={handleMainMenuAction}
      >
        <i
          className={`${menuItem.icon}`}
          style={{ marginRight: "10px" }} // Adjust icon spacing
        />
        <p className="font-weight-bold">{t(menuItem.name)}</p>
        {isExpandable && (
          <i className={`right fas fa-angle-left arrow${isMenuExtended ? ' open' : ''}`} />
        )}
      </a>

      {isExpandable && menuItem.children && (
        <ul className="nav nav-treeview">
          {menuItem.children.map((item) => (
            <li key={item.name} className="nav-item">
              <NavLink className="nav-link" to={item.path || "/"}>
                <i className={`${item.icon}`} />
                <p>{t(item.name)}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default MenuItem;
