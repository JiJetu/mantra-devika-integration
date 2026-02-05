import { createContext, useContext } from "react";

export const HeaderContext = createContext({
  setTitle: () => {},
  setDescription: () => {},
});

export const useHeader = () => useContext(HeaderContext);