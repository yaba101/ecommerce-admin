import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const category = await prisma.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error(`[CATEGORY GET] [ CategoryID ]] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name)
      return new NextResponse("Category name is required", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    if (!params.categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const category = await prisma.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error(`[CATEGORY_PATCH [ CategoryId ]] Error: ${error}S`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!params.categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const category = await prisma.category.delete({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.error(`[CATEGORY DELETE] [ CategoryID ]] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}
