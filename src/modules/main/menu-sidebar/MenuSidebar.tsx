import { Link } from 'react-router-dom';
import { MenuItem } from '@components';
import { Image } from '@profabric/react-components';
import styled from 'styled-components';
// import { SidebarSearch } from '@app/components/sidebar-search/SidebarSearch';
import i18n from '@app/utils/i18n';
import { useAppSelector } from '@app/store/store';

export interface IMenuItem {
  name: string;
  icon?: string;
  path?: string;
  children?: Array<IMenuItem>;
}

export const MENU: IMenuItem[] = [
  {
    name: i18n.t('menusidebar.label.dashboard'),
    icon: 'fas fa-tachometer-alt nav-icon',
    path: '/',
  },
  {
    name: i18n.t('menusidebar.label.blank'),
    icon: 'fas fa-tachometer-alt nav-icon',
    path: '/admin/report_awh',
  },
  {
    name: i18n.t('menusidebar.label.driver'),
    icon: 'fas fa-solid fa-id-card nav-icon',
    path: 'admin/driver',
  },
  {
    name: i18n.t('menusidebar.label.bla'),
    icon: 'fas fa-solid fa-book nav-icon',
    path: '/admin/sigaps_company',
  },
  {
    name: i18n.t('menusidebar.label.laporan'),
    icon: 'fas fa-solid fa-user-ninja nav-icon',
    path: '/admin/sigaps_driver',
  },
  {
    name: i18n.t('menusidebar.label.service'),
    icon: 'fas fa-solid fa-book nav-icon',
    path: '/admin/service_report',
  },
];

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

const MenuSidebar = () => {
  const sidebarSkin = useAppSelector((state) => state.ui.sidebarSkin);
  const menuItemFlat = useAppSelector((state) => state.ui.menuItemFlat);
  const menuChildIndent = useAppSelector((state) => state.ui.menuChildIndent);

  return (
    <aside className={`main-sidebar elevation-4 `} style={{ backgroundColor: '#FFFFFF  ' }}>
      <Link to="/" className="brand-link " style={{ backgroundColor: '#009879', padding: '25px 13px' }}>
        <StyledBrandImage
          src="https://www.freepik.com/free-vector/light-bulb-rocket-design_1130795.htm#fromView=search&page=1&position=37&uuid=bee3cde6-714d-41df-99b2-d0353ae6cd72"
          alt="AdminLTE Logo"
          width={33}
          height={33}
          rounded
        />
        <span className="brand-text font-weight-bold text-light">SIGAP PORTAL</span>
      </Link>
      <div className="sidebar">
        <div className="user-panel mt-3 mb-1 d-flex">
          <div className="image">
            <StyledUserImage
              src='https://portal.sigapdriver.com/icon_admin.png'
              fallbackSrc="/img/default-profile.png"
              alt="User"
              width={34}
              height={34}
              rounded
            />
          </div>
          <div className="info">
            <p className="d-block text-black font-weight-bold" style={{ fontSize: '20px' }}>Keyence Indonesia</p>
          </div>
        </div>

        {/* <div className="form-inline">
          <SidebarSearch />
        </div> */}

        <nav className="" style={{ overflowY: 'hidden' }}>
          <ul
            className={`nav nav-pills nav-sidebar flex-column${
              menuItemFlat ? ' nav-flat' : ''
            }${menuChildIndent ? ' nav-child-indent' : ''}`}
            role="menu"
          >
            {MENU.map((menuItem: IMenuItem) => (
              <MenuItem
                key={menuItem.name + menuItem.path}
                menuItem={menuItem}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};

export default MenuSidebar;
