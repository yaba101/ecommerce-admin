"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Heading from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import {
  CategoriesColumnProps,
  columns,
} from "@/components/Data-Table/category/columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "./ui/api-list";

interface CategoryClientProps {
  data: CategoriesColumnProps[];
}

const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories (${data.length})`}
          description="Manage categories for your store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API calls for categories" />
      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoryClient;
