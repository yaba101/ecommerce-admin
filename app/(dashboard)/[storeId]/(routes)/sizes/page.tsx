import { format } from "date-fns";
import prisma from "@/lib/prismadb";
import { SizeColumnProps } from "@/components/Data-Table/size/columns";
import SizeClient from "@/components/size-client";
const Sizes = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prisma.size?.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedSizes: SizeColumnProps[] = sizes?.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,

    createdAt: format(size.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default Sizes;
