import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const billboard = await prisma.billboard.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.error(`[SIZE GET] [ Size ID ]] Error: ${error}S`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name)
      return new NextResponse("Size name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });

    if (!params.sizeId)
      return new NextResponse("Size ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const size = await prisma.size.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.error(`[SIZE_PATCH [ SizeId ]] Error: ${error}S`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!params.sizeId)
      return new NextResponse("Size ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const size = await prisma.size.delete({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.error(`[SIZE DELETE] [ SizeId ]] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}
