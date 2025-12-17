import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/db"
import { rooms } from "@/db/schema"
import { eq } from "drizzle-orm"
import RoomForm from "../../room-form"

export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth()

  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "super-admin")) {
    redirect("/dashboard")
  }

  const { id } = await params

  // Fetch the room
  const [room] = await db.select().from(rooms).where(eq(rooms.id, id))

  if (!room) {
    redirect("/dashboard/rooms")
  }

  return (
    <div className="p-6">
      <RoomForm
        initialData={{
          id: room.id,
          hotelId: room.hotelId,
          type: room.type,
          typeAr: room.typeAr,
          price: Number(room.price),
          currency: room.currency,
          available: room.available,
          description: room.description,
          descriptionAr: room.descriptionAr,
          images: (room.images || []) as string[],
          maxGuests: room.maxGuests,
          amenities: (room.amenities || []) as string[],
          amenitiesAr: (room.amenitiesAr || []) as string[],
          size: room.size,
          bedType: room.bedType,
          bedTypeAr: room.bedTypeAr,
          addOns: (room.addOns || []) as any[],
          bookingConditions: (room.bookingConditions || {}) as any,
        }}
      />
    </div>
  )
}

