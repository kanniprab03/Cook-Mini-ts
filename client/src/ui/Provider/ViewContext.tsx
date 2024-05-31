import { useState } from "react";
import { ViewContext, ViewContextType } from "../../lib/context/ViewContext";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ViewContextProvider ({ children }: { children: any }) {
  const [header, setHeader] = useState(true);

  const value: ViewContextType = {
    header,
    setHeader,
  };

  return <ViewContext.Provider value={value}>{children}</ViewContext.Provider>;
}
``;
