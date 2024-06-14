/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation, Location } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IMenuItem } from '@app/modules/main/menu-sidebar/MenuSidebar';

const MenuItem = ({ menuItem }: { menuItem: IMenuItem }) => {
  const [t] = useTranslation();
  const [isMenuExtended, setIsMenuExtended] = useState(false);
  const [isExpandable, setIsExpandable] = useState(false); 
  const [isMainActive, setIsMainActive] = useState(false);
  const [isOneOfChildrenActive, setIsOneOfChildrenActive] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuExtended(!isMenuExtended);
  };

  const handleMainMenuAction = () => {
    if (isExpandable) {
      toggleMenu();
      return;
    }
    navigate(menuItem.path ? menuItem.path : '/');
  };

  const calculateIsActive = (url: Location) => {
    setIsMainActive(false);
    setIsOneOfChildrenActive(false);
    if (isExpandable && menuItem && menuItem.children) {
      menuItem.children.forEach((item) => {
        if (item.path === url.pathname) {
          setIsOneOfChildrenActive(true);
          setIsMenuExtended(true);
        }
      });
    } else if (menuItem.path === url.pathname) {
      setIsMainActive(true);
    }
  };

  useEffect(() => {
    if (location) {
      calculateIsActive(location);
    }
  }, [location, isExpandable, menuItem]);

  useEffect(() => {
    if (!isMainActive && !isOneOfChildrenActive) {
      setIsMenuExtended(false);
    }
  }, [isMainActive, isOneOfChildrenActive]);

  useEffect(() => {
    setIsExpandable(
      Boolean(menuItem && menuItem.children && menuItem.children.length > 0)
    );
  }, [menuItem]);

  return (
    <li className={`nav-item${isMenuExtended ? ' menu-open' : ''}`}>
  <style>
    {`
    .nav-item .active {
      background-color: #009879;
      color: white;
      border-radius: 9px;
    }
    .nav-item .active p {
      color: white;
    }
      .nav-item p{
       color: #333333,
      }
    .nav-item .active i {
      color: white;
    }
    .nav-item i {
      color: #009879;
    }
    `}
  </style>
  <a
    className={isMainActive ? 'd-flex text-black ml-3 active' : 'd-flex text-black ml-3'}
    role="link"
    onClick={handleMainMenuAction}
    style={{ cursor: 'pointer' }}
  >
    <i className={`${menuItem.icon}`} style={{ marginRight: '20px', marginTop: '15px' }} />
    <p className="font-weight-bold" style={{ marginTop: '14px' }}>{t(menuItem.name)}</p>
    {isExpandable ? <i className="right fas fa-angle-left" /> : null}
  </a>

  {isExpandable && menuItem && menuItem.children && menuItem.children.map((item) => (
    <ul key={item.name} className="nav nav-treeview">
      <li className="nav-item">
        <NavLink className="nav-link" to={`${item.path}`}>
          <i className={`${item.icon}`} />
          <p>{t(item.name)}</p>
        </NavLink>
      </li>
    </ul>
  ))}
</li>

  );
};


export default MenuItem;
