import React, { createContext, useState, useContext } from "react";

interface ToolContextProps {
  activeToolID: number;
  setActiveToolID: React.Dispatch<React.SetStateAction<number>>;
}

const ToolContext = createContext<ToolContextProps>({
  activeToolID: 0,
  setActiveToolID: () => {},
});

export const ToolProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeTool, setActiveTool] = useState<number>(0);

  return (
    <ToolContext.Provider
      value={{ activeToolID: activeTool, setActiveToolID: setActiveTool }}
    >
      {children}
    </ToolContext.Provider>
  );
};

export const useTool = () => useContext(ToolContext);
