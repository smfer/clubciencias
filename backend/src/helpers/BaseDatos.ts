import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient()
  
export const Conexion = async () =>{
    try {
        await prisma.$connect()
        console.log("Conexion a la base de datos Exitosa ")
        await prisma.$disconnect()
    } catch (error) {
        console.error(error)
    }
  
} 