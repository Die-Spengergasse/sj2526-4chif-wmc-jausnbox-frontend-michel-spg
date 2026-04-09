import { NextResponse } from "next/server";

export async function DELETE() {
  const response = NextResponse.json({ message: "Logout erfolgreich" });

  // Cookie löschen
  response.cookies.set("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0, // sofort ablaufen lassen
    path: "/",
  });

  return response;
}