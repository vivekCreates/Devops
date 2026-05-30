import { prisma } from "../../db"


export default async () => {
  await prisma.$transaction([
    prisma.request.deleteMany(),
  ])
}