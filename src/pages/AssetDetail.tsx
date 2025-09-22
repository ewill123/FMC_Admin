import React, { useState, ChangeEvent } from "react";
import type { Asset } from "../types";
import { supabase } from "../supabaseClient";

interface Props {
  asset: Asset;
  onClose: () => void;
  onUpdate: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export const AssetDetail: React.FC<Props> = ({
  asset,
  onClose,
  onUpdate,
  onDelete,
}) => {
  const [editableAsset, setEditableAsset] = useState<Partial<Asset>>({
    ...asset,
  });
  const [saving, setSaving] = useState(false);

  const editableKeys: (keyof Asset)[] = [
    "staff_name",
    "code",
    "department",
    "qty",
    "condition",
    "funding_source",
    "depreciation",
    "description",
    "need_repair",
  ];

  const handleChange = (key: keyof Asset, value: string | number | boolean) => {
    setEditableAsset({ ...editableAsset, [key]: value });
  };

  const getChangedFields = (): Partial<Asset> => {
    const changes: Partial<Asset> = {};
    editableKeys.forEach((key) => {
      const newVal = editableAsset[key];
      if (newVal !== undefined && newVal !== asset[key]) {
        changes[key] = newVal as any; // TypeScript safe cast
      }
    });
    return changes;
  };

  const handleSave = async () => {
    const changes = getChangedFields();
    if (Object.keys(changes).length === 0) {
      alert("No changes detected!");
      return;
    }

    setSaving(true);

    const { data, error } = await supabase
      .from("assets")
      .update(changes)
      .eq("id", asset.id)
      .select("*"); // always select all columns

    setSaving(false);

    if (error) {
      alert("Failed to save: " + error.message);
    } else if (data && data.length > 0) {
      onUpdate(data[0] as Asset);
    } else {
      // Merge changes manually if nothing returned
      onUpdate({ ...asset, ...changes });
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    const { error } = await supabase.from("assets").delete().eq("id", asset.id);

    if (error) {
      alert("Failed to delete: " + error.message);
    } else {
      onDelete(asset.id);
    }
  };

  const renderInput = (
    label: string,
    key: keyof Asset,
    type: "text" | "number" | "checkbox" = "text"
  ) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontWeight: 500, display: "block" }}>{label}</label>
      {type === "checkbox" ? (
        <input
          type="checkbox"
          checked={!!editableAsset[key]}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(key, e.target.checked)
          }
        />
      ) : (
        <input
          type={type}
          value={(editableAsset[key] as string | number) ?? ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            handleChange(
              key,
              type === "number" ? Number(e.target.value) || 0 : e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 6,
            borderRadius: 6,
            border: "1px solid #ccc",
            marginTop: 4,
          }}
        />
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 12,
          width: 500,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
          onClick={onClose}
          style={{ marginBottom: 12, float: "right", cursor: "pointer" }}
        >
          Close
        </button>

        <h2>{editableAsset.code}</h2>

        {renderInput("Staff Name", "staff_name")}
        {renderInput("Code", "code")}
        {renderInput("Department", "department")}
        {renderInput("Quantity", "qty", "number")}
        {renderInput("Condition", "condition")}
        {renderInput("Funding Source", "funding_source")}
        {renderInput("Depreciation (%)", "depreciation", "number")}
        {editableAsset.depreciation !== undefined && (
          <div
            style={{
              marginTop: 4,
              width: "100%",
              height: 8,
              borderRadius: 4,
              backgroundColor: "#eee",
            }}
          >
            <div
              style={{
                width: `${editableAsset.depreciation}%`,
                height: "100%",
                borderRadius: 4,
                backgroundColor:
                  editableAsset.depreciation > 50 ? "red" : "#4caf50",
                transition: "width 0.3s",
              }}
            />
          </div>
        )}
        {renderInput("Description", "description")}
        {editableAsset.need_repair !== undefined &&
          renderInput("Needs Repair", "need_repair", "checkbox")}

        {editableAsset.image_urls?.length ? (
          <div style={{ marginTop: 12 }}>
            <strong>Images (preview only):</strong>
            {editableAsset.image_urls.map((url, i) => (
              <img
                key={i}
                src={url}
                alt={`Asset ${i}`}
                style={{ width: "100%", marginTop: 8, borderRadius: 8 }}
              />
            ))}
          </div>
        ) : null}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              backgroundColor: "#6200ee",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={handleDelete}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              backgroundColor: "#e53935",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
