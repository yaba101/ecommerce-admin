import { format } from "date-fns";
import BillboardClient from "@/components/billboard-client";
import React from "react";
import prisma from "@/lib/prismadb";
import { BillboardColumn } from "@/components/Data-Table/category/columns";
const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedBillboard: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboard} />
      </div>
    </div>
  );
};

export default Billboards;
