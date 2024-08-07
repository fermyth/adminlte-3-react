import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Main from "@modules/main/Main";
import Login from "@modules/login/Login";
import Register from "@modules/register/Register";
import ForgetPassword from "@modules/forgot-password/ForgotPassword";
import RecoverPassword from "@modules/recover-password/RecoverPassword";
import { useWindowSize } from "@app/hooks/useWindowSize";
import { calculateWindowSize } from "@app/utils/helpers";
import { setWindowSize } from "@app/store/reducers/ui";
import ReactGA from "react-ga4";

import Dashboard from "@pages/Dashboard";
import SubMenu from "@pages/SubMenu";
import Profile from "@pages/profile/Profile";

import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import { setCurrentUser } from "./store/reducers/auth";

import { firebaseAuth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "./store/store";
import Driver from "./pages/Driver/Driver";
import LaporanJamKerja from "@app/pages/Laporan-Jam-Kerja/Laporan_Jam_Kerja";
import LaporanDriver from "./pages/Laporan-driver/Laporan_Driver";
import LaporanHarian from "./pages/Laporan-Harian/Laporan_Harian";
import DashboardPartner from "./pages/partner/Dashboard/Dashboard_Partner";
import DetailCostumer from "./pages/partner/Dashboard/components/Detail_Costumer";
import Sidebar from "./pages/partner/Sidebar/Sidebar";
import Header from "./modules/main/header/Header";
import VehicleData from "./pages/partner/Customer/Customer";
import Service from "./pages/servie_report/service";
import SidebarInternal from "./pages/Internal/Sidebar/Sidebar";
import Laporan_jam_kerja_internal from "./pages/Internal/Laporan_jam_kerja_Internal/Laporan_jam_kerja_internal";
import Profil_Driver from "./pages/Driver/Profil_Driver";
import Jadwal from "./pages/partner/Jadwal/Jadwal";
import FormJadwal from "./pages/partner/Jadwal/form_jadwal";
import Customer from "./pages/partner/Customer/Customer";
import CustomerDetail from "./pages/partner/Customer/Components/DetailCustomer";
import DetailCustomerMobil from "./pages/partner/Customer/Components/DetailCustomerMobil";
import DetailProfilePartner from "./pages/partner/Customer/Components/DetailProfilePartner";
import Laporan_partner_internal from "./pages/Internal/Laporan_partner_internal/Laporan_partner_Internal";
import Form_partner_internal from "./pages/Internal/Laporan_partner_internal/Form_partner_internal";
import UpdateFormPerusahaanInternal from "./pages/partner/Customer/Components/FormEditPerusahaan";
import MobilInternal from "./pages/partner/Customer/Components/MobilPartner";
import MobilPartner from "./pages/partner/Customer/Components/MobilPartner";
import FormMobilPartner from "./pages/partner/Customer/Components/FormMObilPartner";
import FormPerusahaanPartner from "./pages/partner/Customer/Components/FormPerusahaan";
import UpdateJadwal from "./pages/partner/Jadwal/update_jadwal";
import FormUjiEmisi from "./pages/partner/Jadwal/Form_emisi";
import FormServisRutin from "./pages/partner/Jadwal/Form_servis_rutin";
import FormServiseKecelakaan from "./pages/partner/Jadwal/Form_servis_kecelakaan";
import FormStnk from "./pages/partner/Jadwal/Form_stnk";

const { VITE_NODE_ENV } = import.meta.env;

const App = () => {
  const windowSize = useWindowSize();
  const screenSize = useAppSelector((state) => state.ui.screenSize);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const [isAppLoading, setIsAppLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          dispatch(setCurrentUser(user as any));
        } else {
          dispatch(setCurrentUser(undefined));
        }
        setIsAppLoading(false);
      },
      (e) => {
        console.log(e);
        dispatch(setCurrentUser(undefined));
        setIsAppLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    const size = calculateWindowSize(windowSize.width);
    if (screenSize !== size) {
      dispatch(setWindowSize(size));
    }
  }, [windowSize]);

  useEffect(() => {
    if (location && location.pathname && VITE_NODE_ENV === "production") {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname,
      });
    }
  }, [location]);

  if (isAppLoading) {
    return (
      <div style={styles.spinnerContainer}>
        <div style={styles.spinner}></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>
        <Route path="/register" element={<PublicRoute />}>
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="/forgot-password" element={<PublicRoute />}>
          <Route path="/forgot-password" element={<ForgetPassword />} />
        </Route>
        <Route path="/recover-password" element={<PublicRoute />}>
          <Route path="/recover-password" element={<RecoverPassword />} />
        </Route>

        {/* <Route path="/profil_driver" element={<PublicRoute />}>
          <Route path="/profil_driver" element={<Profil_Driver />} />
        </Route> */}

        <Route path="/" element={<PrivateRoute />}>
          <Route path="/" element={<Main />}>
            <Route path="/sub-menu-2" element={<LaporanJamKerja />} />
            <Route path="/sub-menu-1" element={<SubMenu />} />
            <Route path="/admin/report_awh" element={<LaporanJamKerja />} />
            <Route path="/admin/driver" element={<Driver />} />
            <Route path="/admin/profil_driver" element={<Profil_Driver />} />
            <Route path="/admin/sigaps_company" element={<LaporanDriver />} />
            <Route path="/admin/sigaps_driver" element={<LaporanHarian />} />
            <Route path="/admin/service_report" element={<Service />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Dashboard />} />
          </Route>
          <Route path="/partner-dashboard" element={<Sidebar />}>
            <Route path="/partner-dashboard" element={<DashboardPartner />} />
            <Route path="customer" element={<Customer />} />
            <Route path="jadwal" element={<Jadwal />} />
            <Route path="form_jadwal" element={<FormJadwal/>}/>
            <Route path="update_jadwal" element={<UpdateJadwal/>}/>
            <Route path="detail-costumer" element={<DetailCostumer />} />
            <Route path="form-perusahaan/:idpartner" element={<FormPerusahaanPartner />} />
            <Route path="jadwal/update_emisi/:id/:type" element={<FormUjiEmisi />} />
            <Route path="jadwal/update_service_rutin/:id/:type" element={<FormServisRutin />} />
            <Route path="jadwal/update_service_kecelakaan/:id/:type" element={<FormServiseKecelakaan />} />
            <Route path="jadwal/update_stnk/:id/:type" element={<FormStnk />} />
            <Route
              path="update-form-perusahaan"
              element={<UpdateFormPerusahaanInternal />}
            />
            <Route path="add-mobil-partner/:perusahaanID" element={<FormMobilPartner />} />
            <Route path="add-mobil/:perusahaanID" element={<MobilPartner />} />
            <Route
              path="/partner-dashboard/customer/costumer-detail"
              element={<CustomerDetail />}
            />
            <Route
              path="/partner-dashboard/customer/costumer-detail/detail-mobil/:nopol"
              element={<DetailCustomerMobil />}
            />
            <Route
              path="/partner-dashboard/customer/costumer-detail/detail-profile-partner"
              element={<DetailProfilePartner />}
            />
          </Route>
          {/* <Route path="/internal" element={<SidebarInternal />}>
            <Route
              path="internal_laporan_jam_kerja"
              element={<Laporan_jam_kerja_internal />}
            />

            <Route
              path="partner_internal"
              element={<Laporan_partner_internal />}
            />

            <Route
              path="form-partner-internal"
              element={<Form_partner_internal />}
            />
          </Route> */}
        </Route>
      </Routes>
      <ToastContainer
        autoClose={3000}
        draggable={false}
        position="top-right"
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
      />
    </>
  );
};

const styles = {
  spinnerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },
  spinner: {
    border: "8px solid rgba(0, 0, 0, 0.1)",
    borderTop: "8px solid #009879",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    animation: "spin 1s linear infinite",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

export default App;
