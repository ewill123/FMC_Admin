import React from "react";
import { FaSearch } from "react-icons/fa";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<Props> = ({
  query,
  setQuery,
  placeholder,
}) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        maxWidth: 600,
        margin: "0 auto",
        padding: "10px 14px",
        borderRadius: 12,
        backgroundColor: "#fff",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
      }}
    >
      <FaSearch style={{ color: "#888", marginRight: 10, fontSize: 16 }} />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder || "Search..."}
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          fontSize: 14,
          padding: "6px 0",
          backgroundColor: "transparent",
        }}
      />
    </div>
  );
};
