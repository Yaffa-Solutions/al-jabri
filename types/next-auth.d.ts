import "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: "user" | "admin" | "super-admin"
    image?: string | null
  }

  interface Session {
    user: User
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "user" | "admin" | "super-admin"
  }
}
