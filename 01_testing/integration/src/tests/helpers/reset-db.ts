import { prisma } from "../../db"


export async function resetDb() {
    await prisma.calculation.deleteMany()
    console.log("Db reseted")
}