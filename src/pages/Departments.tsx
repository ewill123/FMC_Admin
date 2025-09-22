import React from "react";
import { useAssets } from "../hooks/useAssets";

export const Departments: React.FC = () => {
  const { assets, loading, error } = useAssets();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const grouped = assets.reduce((acc: Record<string, number>, a) => {
    const dept = a.department || "Unknown";
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: "16px" }}>
      <h2>Departments</h2>
      <ul>
        {Object.entries(grouped).map(([dept, count]) => (
          <li key={dept}>
            {dept}: {count} assets
          </li>
        ))}
      </ul>
    </div>
  );
};
