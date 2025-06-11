"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { RoomTimetable } from "@/components/room-timetable"

export default function RoomTimetablePage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  // Sample room data
  const rooms = [
    { id: "room1", name: "Conference Room A" },
    { id: "room2", name: "Meeting Room B" },
    { id: "room3", name: "Boardroom C" },
  ]

  // Sample time slots with bookings
  const timeSlots = [
    {
      time: "09:00 - 10:00",
      bookings: [
        { roomId: "room1", userId: "user1", userName: "John Doe", status: "booked" },
        { roomId: "room2", status: "available" },
        { roomId: "room3", status: "available" },
      ],
    },
    {
      time: "10:00 - 11:00",
      bookings: [
        { roomId: "room1", status: "available" },
        { roomId: "room2", userId: "user2", userName: "Jane Smith", status: "booked" },
        { roomId: "room3", status: "available" },
      ],
    },
    {
      time: "11:00 - 12:00",
      bookings: [
        { roomId: "room1", status: "available" },
        { roomId: "room2", status: "available" },
        { roomId: "room3", userId: "user3", userName: "Robert Johnson", status: "booked" },
      ],
    },
    {
      time: "13:00 - 14:00",
      bookings: [
        { roomId: "room1", status: "available" },
        { roomId: "room2", status: "maintenance" },
        { roomId: "room3", status: "available" },
      ],
    },
    {
      time: "14:00 - 15:00",
      bookings: [
        { roomId: "room1", userId: "user4", userName: "Emily Davis", status: "booked" },
        { roomId: "room2", status: "maintenance" },
        { roomId: "room3", userId: "user5", userName: "Michael Brown", status: "booked" },
      ],
    },
    {
      time: "15:00 - 16:00",
      bookings: [
        { roomId: "room1", status: "available" },
        { roomId: "room2", status: "available" },
        { roomId: "room3", status: "available" },
      ],
    },
    {
      time: "16:00 - 17:00",
      bookings: [
        { roomId: "room1", status: "available" },
        { roomId: "room2", userId: "user6", userName: "Sarah Wilson", status: "pending" },
        { roomId: "room3", status: "available" },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-4 gap-8">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Select Date</CardTitle>
            <CardDescription>Choose a date to view availability</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md border" />
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <RoomTimetable date={selectedDate || new Date()} rooms={rooms} timeSlots={timeSlots} />
        </div>
      </div>
    </div>
  )
}
