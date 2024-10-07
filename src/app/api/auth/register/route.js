import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.json();

    const newUser = await prisma.user.create({
      data: {
        nombre: data.nombre,
        apellidos: data.apellidos,
        fecha_nacimiento: new Date(data.fecha_nacimiento),
        genero: data.genero,
        telefono: data.telefono,
        direccion: data.direccion,
        nombre_usuario: data.nombre_usuario,
        correo: data.correo,
        contrasena: data.contrasena,
      },
    });

    return NextResponse.json({ success: true, user: newUser });
  } catch (error) {
    console.error("Error al guardar el usuario:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function GET() {
    try {
      const users = await prisma.user.findMany(); // Obtener todos los usuarios
      return NextResponse.json({ success: true, users });
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      return NextResponse.json({ success: false, error: error.message });
    }
  }