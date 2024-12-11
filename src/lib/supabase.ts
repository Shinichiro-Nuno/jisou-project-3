import { supabase } from "./supabase-client";
import { Record } from "../domain/record";

export async function fetchRecords(): Promise<Record[]> {
  const { data, error } = await supabase.from("study-record").select();

  if (error) {
    console.error("データ取得エラー:", error.message);
    return [];
  }

  if (data) {
    return data.map((record) => {
      return new Record(record.id, record.title, record.time);
    });
  }

  return [];
}
