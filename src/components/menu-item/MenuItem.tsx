/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IMenuItem } from '@app/modules/main/menu-sidebar/MenuSidebar';
import { useAppSelector } from '@app/store/store'; // Assuming this hook is for accessing Redux store

const MenuItem = ({ menuItem }: { menuItem: IMenuItem }) => {
  const [t] = useTranslation();
  const [isMenuExtended, setIsMenuExtended] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false);
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuSidebarCollapsed = useAppSelector((state) => state.ui.menuSidebarCollapsed); // Accessing the sidebar collapsed state

  const toggleMenu = () => {
    setIsMenuExtended(!isMenuExtended);
  };

  const handleMainMenuAction = () => {
    if (isExpandable) {
      toggleMenu();
    } else {
      navigate(menuItem.path ? menuItem.path : '/');
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
    setIsExpandable(Boolean(menuItem && menuItem.children && menuItem.children.length > 0));
  }, [menuItem]);

  return (
    <li className={`nav-item${isMenuExtended ? ' menu-open' : ''}`}>
      <style>
        {`
          .nav-item .active {
            background-color: ${!menuSidebarCollapsed ? '#009879' : 'transparent'};
            color: ${!menuSidebarCollapsed ? 'white' : '#333333'};
            border-radius: 9px;
          }

          .nav-item .active p {
            color: ${!menuSidebarCollapsed ? 'white' : '#333333'};
          }

          .nav-item .active i {
            color: ${!menuSidebarCollapsed ? 'white' : '#333333'};
          }

          .nav-item i {
            color: ${!menuSidebarCollapsed ? '#009879' : '#009879'};
          }
        `}
      </style>
      <a
        className={`d-flex text-black ml-3${(isMainActive || isOneOfChildrenActive) && !menuSidebarCollapsed ? ' active' : ''}`}
        role="link"
        onClick={handleMainMenuAction}
        style={{ cursor: 'pointer' }}
      >
        <i className={`${menuItem.icon}`} style={{ marginRight: '20px', marginTop: '15px' }} />
        <p className="font-weight-bold" style={{ marginTop: '14px' }}>{t(menuItem.name)}</p>
        {isExpandable ? <i className="right fas fa-angle-left" /> : null}
      </a>

      {isExpandable && menuItem.children && (
        <ul className="nav nav-treeview">
          {menuItem.children.map((item) => (
            <li key={item.name} className="nav-item">
              {/* Ensure item.path is not undefined */}
              <NavLink className="nav-link" to={item.path || '/'}>
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
