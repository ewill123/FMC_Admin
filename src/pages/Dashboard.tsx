import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../supabaseClient";
import { AssetCard } from "../components/AssetCard";
import { AssetListView } from "../components/AssetListView";
import { AssetDetail } from "./AssetDetail";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import type { Asset } from "../types";

const groupAssetsByDepartment = (assets: Asset[]): Record<string, Asset[]> => {
  const grouped: Record<string, Asset[]> = {};
  assets.forEach((asset) => {
    const dept = asset.department || "Unknown Department";
    if (!grouped[dept]) grouped[dept] = [];
    grouped[dept].push(asset);
  });
  return grouped;
};

export const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [allAssetsMode, setAllAssetsMode] = useState(false); // toggle all assets

  // Fetch assets from Supabase
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from<Asset>("assets")
          .select("*");
        if (error) throw error;
        setAssets(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to fetch assets");
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  // Filter assets by search query
  const filteredAssets = useMemo(() => {
    if (!searchQuery) return assets;
    const q = searchQuery.toLowerCase();
    return assets.filter(
      (a: Asset) =>
        (a.name?.toLowerCase().includes(q) ?? false) ||
        (a.code?.toLowerCase().includes(q) ?? false) ||
        (a.department?.toLowerCase().includes(q) ?? false) ||
        (a.staff_name?.toLowerCase().includes(q) ?? false)
    );
  }, [assets, searchQuery]);

  const groupedAssets = useMemo(
    () => groupAssetsByDepartment(filteredAssets),
    [filteredAssets]
  );

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: 60 }}>Loading assets...</p>
    );
  if (error)
    return <p style={{ textAlign: "center", marginTop: 60 }}>Error: {error}</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1400, margin: "0 auto" }}>
      <Header onLogout={() => supabase.auth.signOut()} />

      <div style={{ marginTop: 24 }}>
        <SearchBar
          query={searchQuery}
          setQuery={setSearchQuery}
          placeholder="Search assets by name, code, department, or staff..."
        />
      </div>

      {/* Toggle view: All assets / Departments */}
      <div style={{ margin: "16px 0" }}>
        <button
          onClick={() => setAllAssetsMode(false)}
          style={{
            padding: "6px 12px",
            marginRight: 8,
            backgroundColor: !allAssetsMode ? "#6200ee" : "#eee",
            color: !allAssetsMode ? "#fff" : "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Departments View
        </button>
        <button
          onClick={() => setAllAssetsMode(true)}
          style={{
            padding: "6px 12px",
            backgroundColor: allAssetsMode ? "#6200ee" : "#eee",
            color: allAssetsMode ? "#fff" : "#333",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          All Assets
        </button>
      </div>

      {!allAssetsMode && !selectedDept ? (
        // Departments grid
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          {Object.keys(groupedAssets).map((dept) => (
            <div
              key={dept}
              onClick={() => setSelectedDept(dept)}
              style={{
                cursor: "pointer",
                padding: 24,
                borderRadius: 12,
                backgroundColor: "#f9f9f9",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                textAlign: "center",
                transition: "all 0.25s ease",
              }}
            >
              <h3>{dept}</h3>
              <p>{groupedAssets[dept].length} assets</p>
            </div>
          ))}
        </div>
      ) : (
        // All assets or single department view
        <div style={{ marginTop: 20 }}>
          {selectedDept && (
            <button
              onClick={() => setSelectedDept(null)}
              style={{
                marginBottom: 16,
                padding: "8px 16px",
                borderRadius: 8,
                backgroundColor: "#6200ee",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              ← Back to Departments
            </button>
          )}

          <h2>{allAssetsMode ? "All Assets" : selectedDept}</h2>

          {/* Grid / List toggle */}
          <div style={{ marginBottom: 16 }}>
            <button
              onClick={() => setViewMode("grid")}
              style={{
                padding: "6px 12px",
                marginRight: 8,
                backgroundColor: viewMode === "grid" ? "#6200ee" : "#eee",
                color: viewMode === "grid" ? "#fff" : "#333",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "6px 12px",
                backgroundColor: viewMode === "list" ? "#6200ee" : "#eee",
                color: viewMode === "list" ? "#fff" : "#333",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              List View
            </button>
          </div>

          {viewMode === "grid" ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: 20,
              }}
            >
              {(allAssetsMode
                ? filteredAssets
                : groupedAssets[selectedDept] || []
              ).map((asset: Asset) => (
                <AssetCard
                  key={asset.id}
                  asset={asset}
                  onClick={() => setSelectedAsset(asset)}
                />
              ))}
            </div>
          ) : (
            <AssetListView
              assets={
                allAssetsMode
                  ? filteredAssets
                  : groupedAssets[selectedDept] || []
              }
              onRowClick={(asset: Asset) => setSelectedAsset(asset)}
            />
          )}
        </div>
      )}

      {selectedAsset && (
        <AssetDetail
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onUpdate={(updated: Asset) => {
            setAssets((prev: Asset[]) =>
              prev.map((a: Asset) => (a.id === updated.id ? updated : a))
            );
            setSelectedAsset(updated);
          }}
          onDelete={(id: string) => {
            setAssets((prev: Asset[]) =>
              prev.filter((a: Asset) => a.id !== id)
            );
            setSelectedAsset(null);
          }}
        />
      )}
    </div>
  );
};
