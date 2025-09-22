import React from "react";
import type { Asset } from "../types";

interface Props {
  assets: Asset[];
  onSelect: (asset: Asset) => void;
}

export const AssetTable: React.FC<Props> = ({ assets, onSelect }) => {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
      <thead>
        <tr>
          {["Name", "Code", "Qty", "Department", "Action"].map((head) => (
            <th
              key={head}
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                backgroundColor: "#f0f0f0",
              }}
            >
              {head}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {assets.map((asset) => (
          <tr key={asset.id}>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {asset.name}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {asset.code}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {asset.qty}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              {asset.department}
            </td>
            <td style={{ border: "1px solid #ddd", padding: "8px" }}>
              <button
                onClick={() => onSelect(asset)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "6px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
