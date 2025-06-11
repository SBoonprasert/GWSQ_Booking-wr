"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Eye, Star, Wifi, Tv, Car, Coffee, MapPin } from "lucide-react"
import Link from "next/link"

interface Room {
  id: string
  name: string
  type: string
  capacity: number
  price: number
  rating: number
  amenities: string[]
  images: string[]
  description: string
  available: boolean
}

export default function UserDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [guests, setGuests] = useState(1)

  const rooms: Room[] = [
    {
      id: "1",
      name: "Executive Suite",
      type: "Suite",
      capacity: 4,
      price: 299,
      rating: 4.8,
      amenities: ["WiFi", "TV", "Mini Bar", "Balcony", "Room Service"],
      images: ["/placeholder.svg?height=300&width=400"],
      description: "Luxurious executive suite with panoramic city views, separate living area, and premium amenities.",
      available: true,
    },
    {
      id: "2",
      name: "Deluxe Ocean View",
      type: "Deluxe",
      capacity: 3,
      price: 199,
      rating: 4.6,
      amenities: ["WiFi", "TV", "Ocean View", "Balcony"],
      images: ["/placeholder.svg?height=300&width=400"],
      description: "Beautiful room with stunning ocean views and modern amenities for a perfect getaway.",
      available: true,
    },
    {
      id: "3",
      name: "Standard Room",
      type: "Standard",
      capacity: 2,
      price: 149,
      rating: 4.3,
      amenities: ["WiFi", "TV", "AC", "Parking"],
      images: ["/placeholder.svg?height=300&width=400"],
      description: "Comfortable and well-appointed standard room perfect for business or leisure travel.",
      available: false,
    },
    {
      id: "4",
      name: "Presidential Suite",
      type: "Presidential",
      capacity: 6,
      price: 599,
      rating: 4.9,
      amenities: ["WiFi", "TV", "Jacuzzi", "Butler Service", "Private Dining"],
      images: ["/placeholder.svg?height=300&width=400"],
      description: "The ultimate luxury experience with exclusive amenities and personalized service.",
      available: true,
    },
  ]

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-4 h-4" />
      case "tv":
        return <Tv className="w-4 h-4" />
      case "parking":
        return <Car className="w-4 h-4" />
      case "room service":
        return <Coffee className="w-4 h-4" />
      default:
        return <MapPin className="w-4 h-4" />
    }
  }

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room)
  }

  const confirmBooking = () => {
    // Handle booking logic here
    alert(`Booking confirmed for ${selectedRoom?.name}!`)
    setSelectedRoom(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Room Booking</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, John Doe</span>
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Rooms</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div className="grid lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Filter & Search</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Check-in Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                      />
                    </div>
                    <div>
                      <Label>Guests</Label>
                      <Select value={guests.toString()} onValueChange={(value) => setGuests(Number.parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                          <SelectItem value="5">5+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Room Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="standard">Standard</SelectItem>
                          <SelectItem value="deluxe">Deluxe</SelectItem>
                          <SelectItem value="suite">Suite</SelectItem>
                          <SelectItem value="presidential">Presidential</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <div className="grid gap-6 md:grid-cols-2">
                  {rooms.map((room) => (
                    <Card key={room.id} className={!room.available ? "opacity-60" : ""}>
                      <CardHeader className="p-0">
                        <div className="relative">
                          <img
                            src={room.images[0] || "/placeholder.svg"}
                            alt={room.name}
                            className="w-full h-48 object-cover rounded-t-lg"
                          />
                          {!room.available && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-t-lg">
                              <Badge variant="destructive">Not Available</Badge>
                            </div>
                          )}
                          <Button size="sm" variant="secondary" className="absolute top-2 right-2" asChild>
                            <Link href={`/rooms/${room.id}`}>
                              <Eye className="w-4 h-4 mr-1" />
                              Virtual Tour
                            </Link>
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{room.name}</CardTitle>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">{room.rating}</span>
                            </div>
                          </div>
                          <CardDescription>
                            {room.type} • Up to {room.capacity} guests
                          </CardDescription>
                          <p className="text-sm text-gray-600 line-clamp-2">{room.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 4).map((amenity) => (
                              <div key={amenity} className="flex items-center gap-1 text-xs text-gray-600">
                                {getAmenityIcon(amenity)}
                                <span>{amenity}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <span className="text-2xl font-bold">${room.price}</span>
                              <span className="text-sm text-gray-600">/night</span>
                            </div>
                            <Button onClick={() => handleBookRoom(room)} disabled={!room.available}>
                              {room.available ? "Book Now" : "Unavailable"}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>My Bookings</CardTitle>
                <CardDescription>View and manage your room reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <CalendarDays className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No bookings yet. Start by browsing available rooms!</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john@example.com" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <Button>Update Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Book {selectedRoom?.name}</DialogTitle>
            <DialogDescription>Complete your reservation details</DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedRoom.images[0] || "/placeholder.svg"}
                  alt={selectedRoom.name}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div>
                  <h3 className="font-semibold">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-600">{selectedRoom.type}</p>
                  <p className="text-lg font-bold">${selectedRoom.price}/night</p>
                </div>
              </div>
              <div>
                <Label>Check-in Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Check-out Date</Label>
                <Input type="date" />
              </div>
              <div>
                <Label>Number of Guests</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select guests" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: selectedRoom.capacity }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} Guest{i > 0 ? "s" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRoom(null)}>
              Cancel
            </Button>
            <Button onClick={confirmBooking}>Confirm Booking</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
