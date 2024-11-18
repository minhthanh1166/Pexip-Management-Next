import React from "react";

export default function OperationLayout({ children } : {children: React.ReactNode}) {
    return (
        <div>
            <main>{children}</main>
        </div>
    )
}