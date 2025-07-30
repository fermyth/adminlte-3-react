import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StyledBigUserImage, StyledSmallUserImage } from "@app/styles/common";
import {
  UserBody,
  UserFooter,
  UserHeader,
  UserMenuDropdown,
} from "@app/styles/dropdown-menus";
import { firebaseAuth } from "@app/firebase";
import {} from "@app/index";
import { useAppSelector } from "@app/store/store";
import { DateTime } from "luxon";
import { BsBoxArrowRight } from "react-icons/bs";

const UserDropdown = () => {
  const navigate = useNavigate();
  const [t] = useTranslation();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const logOut = async (event: any) => {
    await firebaseAuth.signOut();
    event.preventDefault();
    setDropdownOpen(false);
  };

  const navigateToProfile = (event: any) => {
    event.preventDefault();
    setDropdownOpen(false);
    navigate("/profile");
  };

  return (
    <UserMenuDropdown isOpen={dropdownOpen} hideArrow>
  <div slot="head">
  <div
    title="Logout"
    style={{
      backgroundColor: "#000",
      color: "#fff",
      padding: "6px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "36px",
      height: "36px",
      cursor: "pointer",
      transition: "background 0.2s ease-in-out",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#333";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "#000";
    }}
  >
    <BsBoxArrowRight style={{ fontSize: "1.2rem" }} />
  </div>
</div>

<div slot="body">
  <UserHeader style={{ backgroundColor: "white", padding: "1rem", textAlign: "center" }}>
    <div slot="head" style={{ marginBottom: "0.5rem", display: "flex", justifyContent: "flex-end" }}>
      <div
        title="Logout"
        style={{
          backgroundColor: "#000",
          color: "#fff",
          padding: "6px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "36px",
          height: "36px",
          cursor: "pointer",
          transition: "background 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#333";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#000";
        }}
        onClick={logOut}
      >
        <BsBoxArrowRight style={{ fontSize: "1.2rem" }} />
      </div>
    </div>

    <div style={{ color: "#222" }}>
      <p style={{ margin: "0", fontWeight: 600 }}>{currentUser?.email}</p>
      <small style={{ color: "#666", fontSize: "0.85rem" }}>
        Member since{" "}
        {currentUser?.metadata?.creationTime && (
          <span>
            {DateTime.fromRFC2822(currentUser.metadata.creationTime).toFormat("dd LLL yyyy")}
          </span>
        )}
      </small>
    </div>
  </UserHeader>

  <UserFooter style={{ padding: "0.75rem 1rem", backgroundColor: "#f9f9f9", textAlign: "right" }}>
    <button
      type="button"
      className="btn btn-dark btn-sm"
      onClick={logOut}
      style={{
        borderRadius: "5px",
        padding: "6px 12px",
        fontSize: "0.85rem",
      }}
    >
      {t("login.button.signOut")}
    </button>
  </UserFooter>
</div>

    </UserMenuDropdown>
  );
};

export default UserDropdown;
