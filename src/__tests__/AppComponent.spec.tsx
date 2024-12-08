import { render, screen } from "@testing-library/react";

import LearningRecord from "../LearningRecord";

describe("LearningRecord", () => {
  test("タイトルの確認", () => {
    render(<LearningRecord />);
    expect(screen.getByText("学習記録一覧")).toBeInTheDocument();
  });
});
