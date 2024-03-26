import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId)
      return new NextResponse("Color ID is required", { status: 400 });

    const color = await prisma.color.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.error(`[COLOR GET] [ Size ID ]] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, value } = body;
    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!name)
      return new NextResponse("Color name is required", { status: 400 });
    if (!value) return new NextResponse("Value is required", { status: 400 });

    if (!params.colorId)
      return new NextResponse("Color ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const color = await prisma.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.error(`[COLOR_PATCH [ SizeId ]] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });
    if (!params.colorId)
      return new NextResponse("Color ID is required", { status: 400 });

    const storeByUserId = await prisma.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const color = await prisma.color.delete({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.error(`[COLOR DELETE] [ SizeId ]] Error: ${error}`);
    return new NextResponse(`Internal Server Error`, { status: 500 });
  }
}
