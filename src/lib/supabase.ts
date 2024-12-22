import { supabase } from "./supabase-client";
import { Record } from "../domain/record";

export async function FetchRecords(): Promise<Record[]> {
  const { data, error } = await supabase
    .from("study-record")
    .select()
    .order("created_at");

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

export async function InsertRecord(
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

export async function UpdateRecord(
  id: string,
  title: string,
  time: number
): Promise<Record | null> {
  try {
    const { data, error } = await supabase
      .from("study-record")
      .update({ title, time })
      .eq("id", id)
      .select();

    if (error) {
      console.error("データ更新エラー:", error.message);
      return null;
    }

    if (data && data[0]) {
      return new Record(data[0].id, data[0].title, data[0].time);
    }

    return null;
  } catch (error) {
    if (error instanceof Error) {
      console.error("データ更新エラー:", error.message);
    }
    return null;
  }
}

export async function DeleteRecord(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("study-record").delete().eq("id", id);

    if (error) {
      console.error("データ削除エラー:", error.message);
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("データ削除エラー:", error.message);
    }
    return false;
  }
}
