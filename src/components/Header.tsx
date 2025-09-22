import React from "react";

interface Props {
  onLogout: () => void;
}

export const Header: React.FC<Props> = ({ onLogout }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        backgroundColor: "#007bff",
        color: "#fff",
        boxShadow: "0 3px 6px rgba(0,0,0,0.1)",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "24px", fontWeight: 600 }}>
        FMC Admin Dashboard
      </h1>
      <button
        onClick={onLogout}
        style={{
          padding: "8px 16px",
          backgroundColor: "#ff4d4f",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: 600,
          color: "#fff",
        }}
      >
        Logout
      </button>
    </header>
  );
};
