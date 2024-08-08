import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FaHome, FaCar, FaClock } from "react-icons/fa"; // Import ikon baru
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { Image } from "@profabric/react-components";
import HeaderNavbar from "./Navbar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "@app/store/store";
import { EventEmitter } from "events";
import Footer from "@app/pages/Footer";

const eventEmitter = new EventEmitter();

const StyledBrandImage = styled(Image)`
  float: left;
  line-height: 0.8;
  margin: -1px 8px 0 6px;
  opacity: 0.8;
  --pf-box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19),
    0 6px 6px rgba(0, 0, 0, 0.23) !important;
`;
const StyledUserImage = styled(Image)`
  --pf-box-shadow: 0 3px 6px #00000029, 0 3px 6px #0000003b !important;
`;

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const currentUser = useAppSelector((state) => state.auth);
  const [namapt, setnamapt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarWidth = isCollapsed ? "80px" : "250px";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          let getstorage = JSON.parse(userData);
          console.log("userData:", getstorage);
          setnamapt(getstorage.nama_perusahaan);
        } else {
          console.log("id_company is not available");
          setnamapt(null);
        }
      } catch (error) {
        console.error("Error fetching id_company from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const handleStorageChange = () => {
      fetchData();
    };

    eventEmitter.on("storageChange", handleStorageChange);

    return () => {
      eventEmitter.off("storageChange", handleStorageChange);
    };
  }, [currentUser]);

  return (
    <>
      <style>
        {`
        body, html {
          overflow-x: hidden;
        }
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
        .version-info {
          font-size: 0.875rem;
          color: #6c757d;
          margin-top: 1rem;
          text-align: center;
        }
      `}
      </style>
      <div style={{ marginLeft: sidebarWidth }}>
        <HeaderNavbar toggleSidebar={toggleSidebar} />
      </div>

      <div className="d-flex">
        <div
          className={`bg-white text-dark position-fixed shadow top-0 left-0 sidebar p-0`}
          style={{
            width: sidebarWidth,
            height: "100vh",
            transition: "width 0.3s",
          }}
        >
          <Link
            to="/"
            className="brand-link"
            style={{ backgroundColor: "#009879", padding: "14px 13px" }}
          >
            <StyledBrandImage
              src="https://www.freepik.com/free-vector/light-bulb-rocket-design_1130795.htm#fromView=search&page=1&position=37&uuid=bee3cde6-714d-41df-99b2-d0353ae6cd72"
              alt="AdminLTE Logo"
              width={33}
              height={33}
              rounded
            />
            <span className="brand-text ml-2 font-weight-bold text-light">
              SIGAP PORTAL
            </span>
          </Link>
          <div className="">
            <div className="ml-4 mtuser-panel mt-3 mb-1 d-flex">
              <div className="image">
                <StyledUserImage
                  src="https://portal.sigapdriver.com/icon_admin.png"
                  fallbackSrc="/img/default-profile.png"
                  alt="User"
                  width={34}
                  height={34}
                  rounded
                />
              </div>
              <div className="info ml-4">
                <p
                  className="d-block text-black font-weight-bold"
                  style={{ fontSize: "20px" }}
                >
                  {namapt}
                </p>
              </div>
            </div>
          </div>
          <div className="p-3">
            <ul className="nav flex-column">
              <li className="nav-item mb-2">
                <Link
                  to="/partner-dashboard"
                  className={`nav-link ${location.pathname === "/partner-dashboard" ? "active" : ""}`}
                  style={{ fontWeight: "bold" }}
                >
                  <FaHome className="icon" />{" "}
                  {!isCollapsed && <span>Dashboard</span>}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/partner-dashboard/customer"
                  className={`nav-link ${location.pathname === "/partner-dashboard/customer" ? "active" : ""}`}
                  style={{ fontWeight: "bold" }}
                >
                  <FaCar className="icon" />{" "}
                  {!isCollapsed && <span> Customer </span>}
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/partner-dashboard/jadwal"
                  className={`nav-link ${location.pathname === "/partner-dashboard/jadwal" ? "active" : ""}`}
                  style={{ fontWeight: "bold" }}
                >
                  <FaClock className="icon" />{" "}
                  {!isCollapsed && <span>Jadwal</span>}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="content-wrapper"
          style={{
            marginLeft: sidebarWidth,
            width: `calc(100% - ${sidebarWidth})`,
            transition: "margin-left 0.3s, width 0.3s",
            overflowX: "hidden",
          }}
        >
          <Outlet />
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Sidebar;
