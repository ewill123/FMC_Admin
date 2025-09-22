import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import type { Asset } from "../types";

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssets = async () => {
      const { data, error } = await supabase.from("assets").select("*");
      if (error) setError(error.message);
      else setAssets(data || []);
      setLoading(false);
    };

    fetchAssets();
  }, []);

  return { assets, loading, error };
};
