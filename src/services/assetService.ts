import type { Asset } from "../types";
import { supabase } from "../supabaseClient";

export const getAssets = async (): Promise<Asset[]> => {
  // v2 syntax: only 1 type argument
  const { data, error } = await supabase
    .from("assets") // remove <Asset>
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;

  return (data as Asset[]) || [];
};
