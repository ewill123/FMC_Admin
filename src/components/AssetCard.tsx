import React from "react";
import type { Asset } from "../types";

interface Props {
  asset: Asset;
  onClick: () => void;
}

export const AssetCard: React.FC<Props> = ({ asset, onClick }) => {
  const purchaseDate = asset.purchase_date
    ? new Date(asset.purchase_date).toLocaleDateString()
    : "N/A";

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        cursor: "pointer",
        overflow: "hidden",
        width: 220,
        margin: 12,
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-5px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 8px 20px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 4px 12px rgba(0,0,0,0.1)";
      }}
    >
      <img
        src={
          asset.image_urls?.[0] ||
          "https://via.placeholder.com/220x140?text=No+Image"
        }
        alt={asset.name}
        style={{ width: "100%", height: 140, objectFit: "cover" }}
      />
      <div style={{ padding: 12, textAlign: "center" }}>
        <h3 style={{ margin: "8px 0", fontSize: 18 }}>
          {asset.name || asset.code || "Unnamed"}
        </h3>
        <p style={{ margin: "4px 0", color: "#555" }}>
          <strong>Staff:</strong> {asset.staff_name || "N/A"}
        </p>
        <p style={{ margin: "4px 0", color: "#555" }}>
          <strong>Dept:</strong> {asset.department || "N/A"}
        </p>
        <p style={{ margin: "4px 0", color: "#555" }}>
          <strong>Purchased:</strong> {purchaseDate}
        </p>
      </div>
    </div>
  );
};
