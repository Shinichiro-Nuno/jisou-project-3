import { createSystem, defaultConfig } from "@chakra-ui/react";

const theme = createSystem(defaultConfig, {
  globalCss: {
    "html, body": {
      backgroundColor: "yellow.200",
      color: "pink.500",
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      marginTop: "10px",
      borderColor: "pink.500",
    },
  },
});

export default theme;
