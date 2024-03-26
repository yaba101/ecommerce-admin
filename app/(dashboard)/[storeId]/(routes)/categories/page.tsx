import { format } from "date-fns";
import BillboardClient from "@/components/billboard-client";
import React from "react";
import prisma from "@/lib/prismadb";
import { CategoriesColumnProps } from "@/components/Data-Table/category/columns";
import CategoryClient from "@/components/category-client";
const Categories = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formattedCategories: CategoriesColumnProps[] = categories.map(
    (category) => ({
      id: category.id,
      name: category.name,
      billboardLabel: category.billboard.label,

      createdAt: format(category.createdAt, "MMMM do, yyyy"),
    })
  );

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default Categories;
