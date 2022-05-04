import React from "react";

export default function HeaderItem({children}: React.PropsWithChildren<unknown>) {
  return (
    <div className="text-lg text-center px-5 hover:bg-opacity-5 hover:bg-slate-500 hover:cursor-pointer">
      {children}
    </div>
  )
}