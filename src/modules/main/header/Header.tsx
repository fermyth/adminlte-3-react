import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  toggleControlSidebar,
  toggleSidebarMenu,
} from '@app/store/reducers/ui';
import UserDropdown from '@app/modules/main/header/user-dropdown/UserDropdown';
import { useAppDispatch, useAppSelector } from '@app/store/store';

const Header = () => {
  const [t] = useTranslation();
  const dispatch = useAppDispatch();
  const navbarVariant = useAppSelector((state) => state.ui.navbarVariant);
  const headerBorder = useAppSelector((state) => state.ui.headerBorder);

  const handleToggleMenuSidebar = () => {
    dispatch(toggleSidebarMenu());
  };

  const handleToggleControlSidebar = () => {
    dispatch(toggleControlSidebar());
  };

  const getContainerClasses = useCallback(() => {
    let classes = `main-header navbar navbar-expand ${navbarVariant}`;
    if (headerBorder) {
      classes = `${classes} border-bottom-0`;
    }
    return classes;
  }, [navbarVariant, headerBorder]);

  return (
    <>
    <div className="">
    <nav className={getContainerClasses()} style={{backgroundColor:"black"}} >
      <ul className="navbar-nav  d-flex align-items-center">
        <li className="nav-item">
          <button
            onClick={handleToggleMenuSidebar}
            type="button"
            className="nav-link"
          >
            <i className="fas fa-bars" style={{ color: "white" }} />
          </button>
        </li>
        <li className="nav-item d-sm-inline-block mt-3">
          <div className="">
            <p className="" style={{ fontWeight: "bold", color: "white", fontSize: "20px" }}>
              
            </p>
          </div>  
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <UserDropdown />
        <li className="nav-item ">
          <button
            type="button"
            className="nav-link "
            onClick={handleToggleControlSidebar}
          >
            <i className="fas fa-th-large" style={{ color: "white" }} />
          </button>
        </li>
      </ul>
    </nav>
    </div>
    </>
  );
};

export default Header;
