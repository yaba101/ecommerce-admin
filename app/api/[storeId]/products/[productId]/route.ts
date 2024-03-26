import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const product = await prisma.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        category: true,
        color: true,
        size: true,
        images: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(`[PRODUCT GET] [ ProductID ]] Error: ${error}S`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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

    if (!params.productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        sizeId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    const product = await prisma.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(`[BILLBOARD_PATCH [ BillboardId ]] Error: ${error}S`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!params.productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const product = await prisma.product.delete({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.error(`[PRODUCT DELETE] [ ProductID ]] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}
