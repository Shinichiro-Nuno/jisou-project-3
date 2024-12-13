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

export async function insertRecord(
  title: string,
  time: number
): Promise<Record | null> {
  try {
    const { data, error } = await supabase
      .from("study-record")
      .insert({ title, time })
      .select();

    if (error) {
      console.error("データ登録エラー:", error.message);
      return null;
    }

    if (data) {
      return new Record(data[0].id, data[0].title, data[0].time);
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("データ登録エラー:", error.message);
    }

    return null;
  }
}
