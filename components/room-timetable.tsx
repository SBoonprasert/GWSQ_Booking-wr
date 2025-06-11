"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"
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
  const isMobile = useIsMobile()

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

  // For mobile view, we'll show a simplified version of the timetable
  const renderMobileView = () => {
    return (
      <div className="space-y-6">
        {timeSlots.map((slot, slotIndex) => (
          <Card key={slotIndex} className="overflow-hidden">
            <CardHeader className="p-3 bg-gray-50 dark:bg-gray-800">
              <CardTitle className="text-base">{slot.time}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {rooms.map((room, roomIndex) => {
                  const booking = slot.bookings.find((b) => b.roomId === room.id)
                  const multiRoomBookingId = isPartOfMultiRoomBooking(room.id, slot)
                  const isMultiRoom = !!multiRoomBookingId

                  return (
                    <div key={room.id} className="p-3 flex items-center justify-between">
                      <div className="font-medium text-sm">{room.name}</div>
                      <div>
                        {booking && booking.status !== "available" ? (
                          <div className="flex flex-col items-end">
                            <Badge className={getStatusColor(booking.status)}>
                              {isMultiRoom ? "Multi-room" : booking.status}
                            </Badge>
                            {booking.userName && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{booking.userName}</div>
                            )}
                          </div>
                        ) : (
                          <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                            Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // For desktop view, we'll show the full timetable
  const renderDesktopView = () => {
    return (
      <ScrollArea className="w-full">
        <div className="min-w-[800px]">
          <table className="w-full border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 min-w-[120px]">
                  Time
                </th>
                {rooms.map((room) => (
                  <th
                    key={room.id}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 min-w-[150px]"
                  >
                    {room.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, slotIndex) => {
                const multiRoomBookings = findMultiRoomBookings(slot)

                return (
                  <tr key={slotIndex} className="relative">
                    <td className="px-4 py-4 font-medium border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      {slot.time}
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
                              className={`px-4 py-4 border border-gray-200 dark:border-gray-700 relative ${getStatusColor(
                                multiRoomBooking.status,
                              )}`}
                            >
                              <div className="flex flex-col space-y-1">
                                <div className="font-semibold text-sm">{multiRoomBooking.topic}</div>
                                <div className="text-xs">{multiRoomBooking.userName}</div>
                                <div className="text-xs opacity-75">{multiRoomBooking.time}</div>
                                <Badge className={`w-fit text-xs ${getStatusColor(multiRoomBooking.status)}`}>
                                  {multiRoomBooking.roomIds.length} rooms • {multiRoomBooking.status}
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
                        <td key={room.id} className="px-4 py-4 border border-gray-200 dark:border-gray-700">
                          {booking && booking.status !== "available" ? (
                            <div className="space-y-1">
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                              {booking.userName && (
                                <div className="text-xs text-gray-600 dark:text-gray-400">{booking.userName}</div>
                              )}
                              {booking.topic && <div className="text-xs font-medium">{booking.topic}</div>}
                            </div>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                              Available
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
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Availability</CardTitle>
        <CardDescription>Timetable for {format(date, "MMMM d, yyyy")}</CardDescription>
      </CardHeader>
      <CardContent>
        {isMobile ? renderMobileView() : renderDesktopView()}

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded"></div>
            <span>Maintenance</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
