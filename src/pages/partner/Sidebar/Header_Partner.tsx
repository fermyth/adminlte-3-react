import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import UserDropdown from "@app/modules/main/header/user-dropdown/UserDropdown";
import { useAppDispatch, useAppSelector } from "@app/store/store";

const HeaderPartner = () => {
  const [t] = useTranslation();
  const navbarVariant = useAppSelector((state) => state.ui.navbarVariant);
  const headerBorder = useAppSelector((state) => state.ui.headerBorder);

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
        <nav
          className={getContainerClasses()}
          style={{ backgroundColor: "black" }}
        >
          <ul className=" navbar-nav d-flex align-items-center ">
            <UserDropdown />
          </ul>
        </nav>
      </div>
    </>
  );
};

export default HeaderPartner;
