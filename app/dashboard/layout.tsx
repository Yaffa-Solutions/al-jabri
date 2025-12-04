import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Only allow admin and super-admin roles
  if (session.user.role !== "admin" && session.user.role !== "super-admin") {
    redirect("/")
  }

  const isSuperAdmin = session.user.role === "super-admin"

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar
        userName={session.user.name || ''}
        userRole={session.user.role}
        isSuperAdmin={isSuperAdmin}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
