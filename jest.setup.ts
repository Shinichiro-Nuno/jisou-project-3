import "@testing-library/jest-dom";

require("dotenv").config();

global.structuredClone = (obj) => {
  if (obj === undefined) return undefined;
  return JSON.parse(JSON.stringify(obj));
};
