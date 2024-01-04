"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Heading from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import {
  ProductColumn,
  columns,
} from "@/components/Data-Table/product/columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "./ui/api-list";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient = ({ data }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products (${data.length})`}
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for products" />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
