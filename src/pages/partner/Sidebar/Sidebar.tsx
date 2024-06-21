import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Outlet,
  useLocation,
} from "react-router-dom";
import { FaHome, FaCar } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardPartner from "../Dashboard/Dashboard_Partner";
import VehicleData from "../Vehicle_Data/Vehicle";
import Header from "@app/modules/main/header/Header";
import styled from "styled-components";
import { Image } from "@profabric/react-components";

const StyledBrandImage = styled(Image)`
  float: left;
  line-height: 0.8;
  margin: -1px 8px 0 6px;
  opacity: 0.8;
  --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23) !important;
`;

const Sidebar = () => {
  const location = useLocation();

  return (
    <>
      <div>
        <Header />
      </div>
      <div className="d-flex">
        <style>
          {`
          .nav-link {
            color: black;
            transition: background-color 0.3s, color 0.3s;
          }

          .nav-link .icon {
            color: #009879;
            margin-right: 8px;
          }

          .nav-link:hover {
            background-color: #009879;
            border-radius: 5px;
            color: white;
          }

          .nav-link:hover .icon {
            color: white;
          }

          .nav-link.active {
            background-color: #009879;
            border-radius: 5px;
            color: white;
          }

          .nav-link.active .icon {
            color: white;
          }

          .shadow {
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
        `}
        </style>

        <div
          className="bg-white text-dark position-fixed shadow top-0 left-0 "
          style={{ width: "250px", height: "100vh" }}
        >
          <Link
            to="/"
            className="brand-link "
            style={{ backgroundColor: "#009879", padding: "14px 13px" }}
          >
            <StyledBrandImage
              src="https://www.freepik.com/free-vector/light-bulb-rocket-design_1130795.htm#fromView=search&page=1&position=37&uuid=bee3cde6-714d-41df-99b2-d0353ae6cd72"
              alt="AdminLTE Logo"
              width={33}
              height={33}
              rounded
            />
            <span className="brand-text font-weight-bold text-light">
              SIGAP PORTAL
            </span>
          </Link>
          <div className="p-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link
                  to="/partner-dashboard"
                  className={`nav-link ${
                    location.pathname === "/partner-dashboard" ? "active" : ""
                  }`}
                  style={{ fontWeight: "bold" }}
                >
                  <FaHome className="icon" /> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="vehicle-data"
                  className={`nav-link ${
                    location.pathname === "vehicle-data" ? "active" : ""
                  }`}
                  style={{ fontWeight: "bold" }}
                >
                  <FaCar className="icon" /> Vehicle Data
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex-grow-1 p-3" style={{ marginLeft: "250px" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
