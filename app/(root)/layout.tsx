import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismadb";

export default async function SetUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");

  const store = await prisma.store.findFirst({
    where: {
      userId,
    },
  });
  if (store) redirect(`/${store.id}`);
  return <>{children}</>;
}
