import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

import LearningRecord from "../LearningRecord";
import { Record } from "../domain/record";

const mockGetAllRecords = jest
  .fn()
  .mockResolvedValue([
    new Record("1", "学習記録1", 1),
    new Record("2", "学習記録2", 2),
    new Record("3", "学習記録3", 3),
    new Record("4", "学習記録4", 4),
  ]);

const mockCreateRecord = jest.fn().mockResolvedValue({
  id: "5",
  title: "新しい学習記録",
  time: 5,
});

const mockDeleteRecord = jest.fn().mockResolvedValue({ status: 200 });

jest.mock("../lib/supabase", () => {
  return {
    FetchRecords: () => mockGetAllRecords(),
    InsertRecord: (title: string, time: number) =>
      mockCreateRecord(title, time),
    DeleteRecord: (id: string) => mockDeleteRecord(id),
  };
});

describe("LearningRecord", () => {
  // 各テスト前にモックをリセット
  beforeEach(() => {
    mockCreateRecord.mockClear();
    mockGetAllRecords.mockClear();

    render(
      <ChakraProvider value={defaultSystem}>
        <LearningRecord />
      </ChakraProvider>
    );
  });

  test("タイトルの確認", () => {
    expect(screen.getByText("学習記録一覧")).toBeInTheDocument();
  });

  test("画面読み込み時にローディングが表示される", async () => {
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  test("学習記録のリストが表示される", async () => {
    // ローディング終了を待つ
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();

      // テーブルの行データが表示されていることを確認
      const rows = screen.getAllByRole("listitem");
      expect(rows.length).toEqual(4);
    });
  });

  test("新規登録ボタンがあることを確認", () => {
    expect(screen.getByText("新規登録")).toBeInTheDocument();
  });

  test("削除ができることの確認", async () => {
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    const record = screen.getByText("学習記録1").closest("li");
    const deleteButton = within(record!).getByRole("button", { name: "削除" });

    await userEvent.click(deleteButton);

    await waitFor(() => {
      const rows = screen.getAllByRole("listitem");
      expect(rows.length).toBe(3);
    });
  });

  describe("モーダルでの登録関連のテスト", () => {
    let user: ReturnType<typeof userEvent.setup>;

    beforeEach(async () => {
      user = userEvent.setup();

      await waitFor(() => {
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
      });

      await user.click(screen.getByText("新規登録"));

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    test("新規登録が出来ることの確認", async () => {
      await user.type(screen.getByLabelText("学習内容"), "新しい学習記録");
      await user.type(screen.getByLabelText("学習時間"), "5");

      await user.click(screen.getByText("登録"));

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      });

      await waitFor(() => {
        const afterRows = screen.getAllByRole("listitem");
        expect(afterRows.length).toBe(5);

        expect(screen.getByText("新しい学習記録")).toBeInTheDocument();
        expect(screen.getByText("5時間")).toBeInTheDocument();
      });

      expect(mockCreateRecord).toHaveBeenCalledWith("新しい学習記録", 5);
    });

    test("モーダルが新規登録というタイトルであることの確認", async () => {
      expect(
        screen.getByRole("heading", { name: "新規登録" })
      ).toBeInTheDocument();
    });

    test("学習内容がないときに登録するとエラーがでることの確認", async () => {
      await user.type(screen.getByLabelText("学習時間"), "5");

      await user.click(screen.getByText("登録"));

      await waitFor(() => {
        expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument();
      });
    });

    test("学習時間がないときに登録するとエラーがでることの確認", async () => {
      await user.type(screen.getByLabelText("学習内容"), "新しい学習記録");

      await user.click(screen.getByText("登録"));

      await waitFor(() => {
        expect(screen.getByText("時間の入力は必須です")).toBeInTheDocument();
      });
    });

    test("学習時間0以下のときに登録するとエラーがでることの確認", async () => {
      await user.type(screen.getByLabelText("学習時間"), "0");

      await user.click(screen.getByText("登録"));

      await waitFor(() => {
        expect(
          screen.getByText("時間は0以上である必要があります")
        ).toBeInTheDocument();
      });
    });
  });
});
