import { ReactNode } from "react";

export default function AuthLayout({ children }: { children:ReactNode}) {
    return (
        <div className="flex justify-center items-center h-full">{children}</div>
    )
}