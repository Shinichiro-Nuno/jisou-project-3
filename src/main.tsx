import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import LearningRecord from "./LearningRecord";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LearningRecord />
  </StrictMode>
);
