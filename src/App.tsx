import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Main from '@modules/main/Main';
import Login from '@modules/login/Login';
import Register from '@modules/register/Register';
import ForgetPassword from '@modules/forgot-password/ForgotPassword';
import RecoverPassword from '@modules/recover-password/RecoverPassword';
import { useWindowSize } from '@app/hooks/useWindowSize';
import { calculateWindowSize } from '@app/utils/helpers';
import { setWindowSize } from '@app/store/reducers/ui';
import ReactGA from 'react-ga4';

import Dashboard from '@pages/Dashboard';
import SubMenu from '@pages/SubMenu';
import Profile from '@pages/profile/Profile';

import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import { setCurrentUser } from './store/reducers/auth';

import { firebaseAuth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from './store/store';
import Driver from './pages/Driver/Driver';
import LaporanJamKerja from '@app/pages/Laporan-Jam-Kerja/Laporan_Jam_Kerja';
import LaporanDriver from './pages/Laporan-driver/Laporan_Driver';
import LaporanHarian from './pages/Laporan-Harian/Laporan_Harian';
import Service from './pages/servie_report/service';
import { motion } from 'framer-motion';

const { VITE_NODE_ENV } = import.meta.env;

const CarAnimation: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const carSoundUrl = '/sound/sound.mp3'; 

  useEffect(() => {
    const handlePlayAudio = () => {
      if (audioRef.current) {
        console.log('Attempting to play audio');
        audioRef.current.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      } else {
        console.log('audioRef.current is null');
      }
    };

    document.addEventListener('click', handlePlayAudio, { once: true });

    return () => {
      document.removeEventListener('click', handlePlayAudio);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', overflow: 'hidden', width: '100%', height: '100vh' }}>
      {/* <motion.img
        src="https://img.freepik.com/free-vector/modern-urban-adventure-suv-vehicle-illustration_1344-200.jpg?t=st=1718352949~exp=1718356549~hmac=60b96437281d838f7d123677a17db16977bb2a8fed66ab66f60ad425730f84cc&w=740"
        alt="Car"
        style={{
          width: '200px',
          position: 'absolute',
          top: '50%',
          left: '-200px', 
          transform: 'translateY(-50%)', 
        }}
        animate={{ left: 'calc(100vw + 200px)' }} 
        transition={{ duration: 4, ease: 'linear', repeat: Infinity }}
      />
      <audio ref={audioRef} src={carSoundUrl} loop /> */}
    </div>
  );
};

const App: React.FC = () => {
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
          dispatch(setCurrentUser(undefined as any));
        }
        setIsAppLoading(false);
      },
      (e) => {
        console.log(e);
        dispatch(setCurrentUser(undefined as any));
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
    if (location && location.pathname && VITE_NODE_ENV === 'production') {
      ReactGA.send({
        hitType: 'pageview',
        page: location.pathname,
      });
    }
  }, [location]);

  return (
    <>
      {isAppLoading ? (
        <div style={styles.spinnerContainer}>
          <CarAnimation />
        </div>
      ) : (
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
          <Route path="/" element={<PrivateRoute />}>
            <Route path="/" element={<Main />}>
              <Route path="/sub-menu-2" element={<LaporanJamKerja />} />
              <Route path="/sub-menu-1" element={<SubMenu />} />
              <Route path="/admin/report_awh" element={<LaporanJamKerja />} />
              <Route path="/admin/driver" element={<Driver />} />
              <Route path="/admin/sigaps_company" element={<LaporanDriver />} />
              <Route path="/admin/sigaps_driver" element={<LaporanHarian />} />
              <Route path="/admin/service_report" element={<Service />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/" element={<Dashboard />} />
            </Route>
          </Route>
        </Routes>
      )}

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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    overflow: 'hidden',
  },
};

export default App;
