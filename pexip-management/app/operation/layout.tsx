"use client"

import React from "react";
import { Navbar } from "./components";
import { ToggleMenuProvider } from "../useContext/toggleMenuProvider";

export default function OperationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <ToggleMenuProvider>
        <Navbar />
        <main>{children}</main>
      </ToggleMenuProvider>
    </div>
  );
}
