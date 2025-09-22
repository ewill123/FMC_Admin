import React, { useState } from "react";
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

  const handleChange = <K extends keyof Asset>(key: K, value: Asset[K]) => {
    setEditableAsset((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const { data, error } = await supabase
      .from<Asset, Asset>("assets")
      .update(editableAsset)
      .eq("id", asset.id)
      .select()
      .single();

    setSaving(false);
    if (error) alert("Failed to save: " + error.message);
    else if (data) onUpdate(data);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this asset?")) return;
    const { error } = await supabase.from("assets").delete().eq("id", asset.id);
    if (error) alert("Failed to delete: " + error.message);
    else onDelete(asset.id);
  };

  const fields: { label: string; key: keyof Asset; type?: string }[] = [
    { label: "Department", key: "department" },
    { label: "Staff Name", key: "staff_name" },
    { label: "Asset Code", key: "code" },
    { label: "Purchase Date", key: "purchase_date", type: "date" },
    { label: "Description", key: "description" },
    { label: "Quantity", key: "qty", type: "number" },
    { label: "Unit Cost", key: "unit_cost", type: "number" },
    { label: "Supplier Name", key: "supplier_name" },
    { label: "Funding Source", key: "funding_source" },
    { label: "Physical Location", key: "physical_location" },
    { label: "Depreciation", key: "depreciation", type: "number" },
    { label: "Condition", key: "condition" },
    { label: "Needs Repair", key: "need_repair" },
    { label: "Inserted At", key: "inserted_at", type: "datetime-local" },
    { label: "User ID", key: "user_id" },
    { label: "Images", key: "image_urls" },
  ];

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
          width: 550,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button onClick={onClose} style={{ float: "right", cursor: "pointer" }}>
          Close
        </button>

        <h2>{editableAsset.code}</h2>

        {fields.map((field) => (
          <div key={field.key as string} style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 500 }}>{field.label}</label>
            {field.key === "need_repair" ? (
              <input
                type="checkbox"
                checked={!!editableAsset.need_repair}
                onChange={(e) => handleChange("need_repair", e.target.checked)}
                style={{ marginLeft: 8 }}
              />
            ) : (
              <input
                type={field.type || "text"}
                value={
                  field.key === "image_urls"
                    ? editableAsset.image_urls?.join(",") ?? ""
                    : (editableAsset[field.key] as
                        | string
                        | number
                        | undefined) ?? ""
                }
                onChange={(e) => {
                  let value: any = e.target.value;
                  if (field.type === "number") value = Number(value) || 0;
                  if (field.key === "image_urls")
                    value = e.target.value.split(",");
                  handleChange(field.key, value);
                }}
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
        ))}

        {editableAsset.image_urls?.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Asset ${i}`}
            style={{ width: "100%", marginTop: 12, borderRadius: 8 }}
          />
        ))}

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
