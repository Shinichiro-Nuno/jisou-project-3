import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "./components/ui/provider";

import LearningRecord from "./LearningRecord";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <LearningRecord />
    </Provider>
  </StrictMode>
);
