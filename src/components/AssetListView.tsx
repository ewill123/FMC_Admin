import React from "react";
import type { Asset } from "../types";

interface Props {
  assets: Asset[];
  onRowClick: (asset: Asset) => void;
}

export const AssetListView: React.FC<Props> = ({ assets, onRowClick }) => {
  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString() : "N/A";

  const getDuration = (dateStr?: string) =>
    dateStr
      ? `${Math.floor(
          (Date.now() - new Date(dateStr).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )} yrs`
      : "N/A";

  return (
    <div
      style={{
        overflowX: "auto",
        maxHeight: "70vh",
        border: "1px solid #ddd",
        borderRadius: 8,
      }}
    >
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead style={{ backgroundColor: "#f5f5f5" }}>
          <tr>
            <th style={{ padding: "6px 12px", textAlign: "left" }}>Name</th>
            <th style={{ padding: "6px 12px", textAlign: "left" }}>Code</th>
            <th style={{ padding: "6px 12px", textAlign: "left" }}>Staff</th>
            <th style={{ padding: "6px 12px", textAlign: "left" }}>
              Department
            </th>
            <th style={{ padding: "6px 12px", textAlign: "left" }}>
              Purchased
            </th>
            <th style={{ padding: "6px 12px", textAlign: "left" }}>Duration</th>
            <th style={{ padding: "6px 12px", textAlign: "left" }}>
              Depreciation
            </th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const duration = getDuration(asset.purchase_date);
            const depreciation = asset.depreciation || 0;
            return (
              <tr
                key={asset.id}
                onClick={() => onRowClick(asset)}
                style={{
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  height: 36,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f0f0f0")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <td style={{ padding: "4px 8px" }}>
                  {asset.name || asset.code}
                </td>
                <td style={{ padding: "4px 8px" }}>{asset.code || "N/A"}</td>
                <td style={{ padding: "4px 8px" }}>
                  {asset.staff_name || "N/A"}
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {asset.department || "N/A"}
                </td>
                <td style={{ padding: "4px 8px" }}>
                  {formatDate(asset.purchase_date)}
                </td>
                <td style={{ padding: "4px 8px" }}>{duration}</td>
                <td style={{ padding: "4px 8px", width: 100 }}>
                  <div
                    style={{
                      width: "100%",
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: "#eee",
                    }}
                  >
                    <div
                      style={{
                        width: `${depreciation}%`,
                        height: "100%",
                        borderRadius: 3,
                        backgroundColor: depreciation > 50 ? "red" : "#4caf50",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
