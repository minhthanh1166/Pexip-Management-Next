import React from "react";

export default function AdministratorLayout({ children } : { children: React.ReactNode }) {
    return (
        <div>
            <header>Administrator Header</header>
            <main>{children}</main>
        </div>
    )
}