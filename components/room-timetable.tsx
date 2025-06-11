"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ScrollArea } from "@/components/ui/scroll-area"

interface TimeSlot {
  time: string
  bookings: {
    roomId: string
    userId?: string
    userName?: string
    status: "available" | "booked" | "pending" | "maintenance"
    bookingId?: string
    topic?: string
  }[]
}

interface MultiRoomBooking {
  bookingId: string
  roomIds: string[]
  userName: string
  topic: string
  time: string
  status: "booked" | "pending"
}

interface RoomTimetableProps {
  date: Date
  rooms: {
    id: string
    name: string
  }[]
  timeSlots: TimeSlot[]
}

export function RoomTimetable({ date, rooms, timeSlots }: RoomTimetableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
      case "booked":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800"
      case "maintenance":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  // Function to find multi-room bookings for a specific time slot
  const findMultiRoomBookings = (slot: TimeSlot): MultiRoomBooking[] => {
    const bookingGroups: { [key: string]: MultiRoomBooking } = {}

    slot.bookings.forEach((booking) => {
      if (booking.bookingId && booking.status !== "available" && booking.status !== "maintenance") {
        if (!bookingGroups[booking.bookingId]) {
          bookingGroups[booking.bookingId] = {
            bookingId: booking.bookingId,
            roomIds: [],
            userName: booking.userName || "Unknown",
            topic: booking.topic || "Meeting",
            time: slot.time,
            status: booking.status as "booked" | "pending",
          }
        }
        bookingGroups[booking.bookingId].roomIds.push(booking.roomId)
      }
    })

    return Object.values(bookingGroups).filter((group) => group.roomIds.length > 1)
  }

  // Function to check if a room is part of a multi-room booking
  const isPartOfMultiRoomBooking = (roomId: string, slot: TimeSlot): string | null => {
    const multiRoomBookings = findMultiRoomBookings(slot)
    const booking = multiRoomBookings.find((b) => b.roomIds.includes(roomId))
    return booking ? booking.bookingId : null
  }

  // Function to get the position of a room in a multi-room booking
  const getRoomPositionInBooking = (roomId: string, bookingId: string, slot: TimeSlot): "first" | "middle" | "last" => {
    const multiRoomBookings = findMultiRoomBookings(slot)
    const booking = multiRoomBookings.find((b) => b.bookingId === bookingId)
    if (!booking) return "first"

    const sortedRoomIds = booking.roomIds.sort()
    const index = sortedRoomIds.indexOf(roomId)

    if (index === 0) return "first"
    if (index === sortedRoomIds.length - 1) return "last"
    return "middle"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Availability</CardTitle>
        <CardDescription>Timetable for {format(date, "MMMM d, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800">
                  <th className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 min-w-[100px] md:min-w-[120px]">
                    Time
                  </th>
                  {rooms.map((room) => (
                    <th
                      key={room.id}
                      className="px-2 md:px-4 py-3 text-left text-xs md:text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 min-w-[120px] md:min-w-[150px]"
                    >
                      <div className="truncate" title={room.name}>
                        {room.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, slotIndex) => {
                  const multiRoomBookings = findMultiRoomBookings(slot)

                  return (
                    <tr key={slotIndex} className="relative">
                      <td className="px-2 md:px-4 py-3 md:py-4 font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs md:text-sm">
                        <div className="whitespace-nowrap">{slot.time}</div>
                      </td>
                      {rooms.map((room, roomIndex) => {
                        const booking = slot.bookings.find((b) => b.roomId === room.id)
                        const multiRoomBookingId = isPartOfMultiRoomBooking(room.id, slot)

                        if (multiRoomBookingId) {
                          const multiRoomBooking = multiRoomBookings.find((b) => b.bookingId === multiRoomBookingId)
                          const position = getRoomPositionInBooking(room.id, multiRoomBookingId, slot)

                          if (position === "first" && multiRoomBooking) {
                            // Render the continuous block starting from the first room
                            const spanCount = multiRoomBooking.roomIds.length
                            return (
                              <td
                                key={room.id}
                                colSpan={spanCount}
                                className={`px-2 md:px-4 py-3 md:py-4 border border-gray-200 dark:border-gray-700 relative ${getStatusColor(
                                  multiRoomBooking.status,
                                )}`}
                              >
                                <div className="flex flex-col space-y-1">
                                  <div
                                    className="font-semibold text-xs md:text-sm truncate"
                                    title={multiRoomBooking.topic}
                                  >
                                    {multiRoomBooking.topic}
                                  </div>
                                  <div className="text-xs truncate" title={multiRoomBooking.userName}>
                                    {multiRoomBooking.userName}
                                  </div>
                                  <div className="text-xs opacity-75 hidden md:block">{multiRoomBooking.time}</div>
                                  <Badge className={`w-fit text-xs ${getStatusColor(multiRoomBooking.status)}`}>
                                    <span className="hidden md:inline">
                                      {multiRoomBooking.roomIds.length} rooms • {multiRoomBooking.status}
                                    </span>
                                    <span className="md:hidden">
                                      {multiRoomBooking.roomIds.length}R •{" "}
                                      {multiRoomBooking.status.charAt(0).toUpperCase()}
                                    </span>
                                  </Badge>
                                </div>
                              </td>
                            )
                          } else if (position !== "first") {
                            // Skip rendering for middle and last rooms as they're covered by colSpan
                            return null
                          }
                        }

                        // Render individual room booking or available slot
                        return (
                          <td
                            key={room.id}
                            className="px-2 md:px-4 py-3 md:py-4 border border-gray-200 dark:border-gray-700"
                          >
                            {booking && booking.status !== "available" ? (
                              <div className="space-y-1">
                                <Badge className={getStatusColor(booking.status)} variant="secondary">
                                  <span className="hidden md:inline">{booking.status}</span>
                                  <span className="md:hidden">{booking.status.charAt(0).toUpperCase()}</span>
                                </Badge>
                                {booking.userName && (
                                  <div
                                    className="text-xs text-gray-600 dark:text-gray-400 truncate"
                                    title={booking.userName}
                                  >
                                    {booking.userName}
                                  </div>
                                )}
                                {booking.topic && (
                                  <div className="text-xs font-medium truncate hidden md:block" title={booking.topic}>
                                    {booking.topic}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <Badge
                                className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800"
                                variant="secondary"
                              >
                                <span className="hidden md:inline">Available</span>
                                <span className="md:hidden">Avail</span>
                              </Badge>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </ScrollArea>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
            <span>Maintenance</span>
          </div>
        </div>

        {/* Mobile Usage Tip */}
        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg md:hidden">
          <p className="text-xs text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Scroll horizontally to see all rooms and their availability
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
