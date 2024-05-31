import { ReactElement } from "react";
import AuthContextProvider from "./AuthContextProvider";

export default function GlobalProvider({
  children,
}: {
  children: ReactElement;
}) {
  return <AuthContextProvider>{children}</AuthContextProvider>;
}
