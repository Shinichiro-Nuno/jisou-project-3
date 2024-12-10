import { render, screen } from "@testing-library/react";

import LearningRecord from "../LearningRecord";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

describe("LearningRecord", () => {
  test("タイトルの確認", () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <LearningRecord />
      </ChakraProvider>
    );
    expect(screen.getByText("学習記録一覧")).toBeInTheDocument();
  });
});
