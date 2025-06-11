"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"

interface Room {
  id: string
  name: string
  capacity: number
  features: string[]
  image: string
}

interface RoomCardProps {
  room: Room
  selectedDate: Date | undefined
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, selectedDate }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.name}</CardTitle>
        <CardDescription>Capacity: {room.capacity}</CardDescription>
      </CardHeader>
      <CardContent>
        <img
          src={room.image || "/placeholder.svg"}
          alt={room.name}
          className="w-full h-32 object-cover rounded-md mb-4"
        />
        <ul>
          {room.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        {selectedDate && <p className="mt-4">Selected Date: {format(selectedDate, "MMMM d, yyyy")}</p>}
        <Button className="mt-4">Book Now</Button>
      </CardContent>
    </Card>
  )
}
