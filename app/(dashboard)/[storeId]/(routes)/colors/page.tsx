import { format } from "date-fns";
import prisma from "@/lib/prismadb";
import { SizeColumnProps } from "@/components/Data-Table/size/columns";
import ColorClient from "@/components/color-client";
const Colors = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prisma.color?.findMany({
    where: {
      storeId: params.storeId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedColors: SizeColumnProps[] = colors?.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,

    createdAt: format(color.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorClient data={formattedColors} />
      </div>
    </div>
  );
};

export default Colors;
