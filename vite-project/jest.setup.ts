import "@testing-library/jest-dom";

require("dotenv").config();

global.structuredClone = (val) => {
  return JSON.parse(JSON.stringify(val));
};
