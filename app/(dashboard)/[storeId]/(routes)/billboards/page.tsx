import BillboardClient from "@/components/billboard-client";
import React from "react";

const Billboards = () => {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient />
      </div>
    </div>
  );
};

export default Billboards;
