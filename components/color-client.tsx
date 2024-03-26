"use client";

import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import Heading from "./ui/heading";
import { Separator } from "./ui/separator";
import { useParams, useRouter } from "next/navigation";
import {
  ColorColumnProps,
  columns,
} from "@/components/Data-Table/color/columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "./ui/api-list";

interface ColorClientProps {
  data: ColorColumnProps[];
}

const ColorClient = ({ data }: ColorClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors (${data.length})`}
          description="Manage color for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API calls for colors" />
      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorClient;
