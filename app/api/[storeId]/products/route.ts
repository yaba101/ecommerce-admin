import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId)
      return new NextResponse("Store Id is required", { status: 400 });

    const products = await prisma.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error(`[PRODUCT_GET] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name)
      return new NextResponse("Produce name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category ID is required", { status: 400 });
    if (!colorId)
      return new NextResponse("Color ID is required", { status: 400 });
    if (!sizeId)
      return new NextResponse("Size ID is required", { status: 400 });
    if (!images || !images.length)
      return new NextResponse("Image is required", { status: 400 });

    if (!params.storeId)
      return new NextResponse("Store Id is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const product = await prisma.product.create({
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        storeId: params.storeId,
        isFeatured,
        isArchived,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(`[PRODUCT_POST] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}
