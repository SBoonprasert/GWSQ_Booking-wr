"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Plus, Edit, Trash2, CalendarIcon, Settings, Eye, AlertTriangle, X } from "lucide-react"
import { format } from "date-fns"
import { ThemeToggle } from "@/components/theme-toggle"

interface Room {
  id: string
  name: string
  type: string
  capacity: number
  price: number
  status: "available" | "occupied" | "maintenance"
  amenities: string[]
  images: string[]
  description: string
}

interface Booking {
  id: string
  userId: string
  userName: string
  roomIds: string[]
  roomNames: string[]
  date: Date
  timeSlot: string
  status: "confirmed" | "pending" | "cancelled"
}

export default function AdminDashboard() {
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "1",
      name: "Conference Room A",
      type: "conference",
      capacity: 10,
      price: 100,
      status: "available",
      amenities: ["WiFi", "Projector", "Whiteboard", "Video Conferencing"],
      images: ["/placeholder.svg?height=200&width=300"],
      description: "Large conference room with projector and whiteboard",
    },
    {
      id: "2",
      name: "Meeting Room B",
      type: "meeting",
      capacity: 6,
      price: 75,
      status: "occupied",
      amenities: ["WiFi", "TV", "Video Conferencing"],
      images: ["/placeholder.svg?height=200&width=300"],
      description: "Medium-sized meeting room with video conferencing equipment",
    },
    {
      id: "3",
      name: "Boardroom C",
      type: "boardroom",
      capacity: 12,
      price: 150,
      status: "available",
      amenities: ["WiFi", "Projector", "Whiteboard", "Coffee Machine", "Catering"],
      images: ["/placeholder.svg?height=200&width=300"],
      description: "Executive boardroom with premium amenities",
    },
  ])

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "booking1",
      userId: "user1",
      userName: "John Doe",
      roomIds: ["1"],
      roomNames: ["Conference Room A"],
      date: new Date(2025, 5, 15),
      timeSlot: "09:00 - 10:00",
      status: "confirmed",
    },
    {
      id: "booking2",
      userId: "user2",
      userName: "Jane Smith",
      roomIds: ["2"],
      roomNames: ["Meeting Room B"],
      date: new Date(2025, 5, 15),
      timeSlot: "11:00 - 12:00",
      status: "confirmed",
    },
    {
      id: "booking3",
      userId: "user3",
      userName: "Robert Johnson",
      roomIds: ["1", "3"],
      roomNames: ["Conference Room A", "Boardroom C"],
      date: new Date(2025, 5, 16),
      timeSlot: "14:00 - 16:00",
      status: "pending",
    },
  ])

  const [isAddingRoom, setIsAddingRoom] = useState(false)
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  const [currentRoom, setCurrentRoom] = useState<Partial<Room>>({
    name: "",
    type: "",
    capacity: 1,
    price: 0,
    status: "available",
    amenities: [],
    description: "",
  })
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [isOverridingBooking, setIsOverridingBooking] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  const handleAddRoom = () => {
    const room: Room = {
      id: Date.now().toString(),
      name: currentRoom.name || "",
      type: currentRoom.type || "",
      capacity: currentRoom.capacity || 1,
      price: currentRoom.price || 0,
      status: (currentRoom.status as "available" | "occupied" | "maintenance") || "available",
      amenities: currentRoom.amenities || [],
      images: ["/placeholder.svg?height=200&width=300"],
      description: currentRoom.description || "",
    }
    setRooms([...rooms, room])
    setCurrentRoom({
      name: "",
      type: "",
      capacity: 1,
      price: 0,
      status: "available",
      amenities: [],
      description: "",
    })
    setIsAddingRoom(false)
  }

  const handleEditRoom = (room: Room) => {
    setCurrentRoom(room)
    setIsEditingRoom(true)
  }

  const saveEditedRoom = () => {
    setRooms(rooms.map((room) => (room.id === currentRoom.id ? ({ ...room, ...currentRoom } as Room) : room)))
    setIsEditingRoom(false)
    setCurrentRoom({
      name: "",
      type: "",
      capacity: 1,
      price: 0,
      status: "available",
      amenities: [],
      description: "",
    })
  }

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((room) => room.id !== roomId))
  }

  const handleOverrideBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsOverridingBooking(true)
  }

  const confirmOverride = () => {
    // In a real app, this would update the booking in the database
    setBookings(bookings.filter((b) => b.id !== selectedBooking?.id))
    setIsOverridingBooking(false)
    setSelectedBooking(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "occupied":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getBookingsForDate = () => {
    if (!selectedDate) return []
    return bookings.filter((booking) => booking.date.toDateString() === selectedDate.toDateString())
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="rooms" className="space-y-6">
          <TabsList>
            <TabsTrigger value="rooms" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Room Management
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Room Management</h2>
              <Dialog open={isAddingRoom} onOpenChange={setIsAddingRoom}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add New Room</DialogTitle>
                    <DialogDescription>Configure a new room for booking</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="room-name">Room Name</Label>
                      <Input
                        id="room-name"
                        value={currentRoom.name}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                        placeholder="Conference Room A"
                      />
                    </div>
                    <div>
                      <Label htmlFor="room-type">Room Type</Label>
                      <Select
                        value={currentRoom.type}
                        onValueChange={(value) => setCurrentRoom({ ...currentRoom, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select room type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="conference">Conference Room</SelectItem>
                          <SelectItem value="meeting">Meeting Room</SelectItem>
                          <SelectItem value="boardroom">Boardroom</SelectItem>
                          <SelectItem value="classroom">Classroom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="capacity">Capacity</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={currentRoom.capacity}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: Number.parseInt(e.target.value) })}
                        min="1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price per Hour ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={currentRoom.price}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, price: Number.parseInt(e.target.value) })}
                        min="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={currentRoom.description}
                        onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                        placeholder="Room description..."
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingRoom(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddRoom}>Add Room</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                      <Badge className={getStatusColor(room.status)}>{room.status}</Badge>
                    </div>
                    <CardDescription>
                      {room.type} • {room.capacity} people • ${room.price}/hour
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <img
                        src={room.images[0] || "/placeholder.svg"}
                        alt={room.name}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <p className="text-sm text-gray-600">{room.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity) => (
                          <Badge key={amenity} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditRoom(room)}>
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteRoom(room.id)}>
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Room Dialog */}
            <Dialog open={isEditingRoom} onOpenChange={setIsEditingRoom}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Room</DialogTitle>
                  <DialogDescription>Update room details</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-room-name">Room Name</Label>
                    <Input
                      id="edit-room-name"
                      value={currentRoom.name}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-room-type">Room Type</Label>
                    <Select
                      value={currentRoom.type}
                      onValueChange={(value) => setCurrentRoom({ ...currentRoom, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conference">Conference Room</SelectItem>
                        <SelectItem value="meeting">Meeting Room</SelectItem>
                        <SelectItem value="boardroom">Boardroom</SelectItem>
                        <SelectItem value="classroom">Classroom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-capacity">Capacity</Label>
                    <Input
                      id="edit-capacity"
                      type="number"
                      value={currentRoom.capacity}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: Number.parseInt(e.target.value) })}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-price">Price per Hour ($)</Label>
                    <Input
                      id="edit-price"
                      type="number"
                      value={currentRoom.price}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, price: Number.parseInt(e.target.value) })}
                      min="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                      value={currentRoom.status}
                      onValueChange={(value: "available" | "occupied" | "maintenance") =>
                        setCurrentRoom({ ...currentRoom, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="occupied">Occupied</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={currentRoom.description}
                      onChange={(e) => setCurrentRoom({ ...currentRoom, description: e.target.value })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEditingRoom(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveEditedRoom}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>View and manage room bookings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Room(s)</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Time</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-t">
                              <td className="px-4 py-4">{booking.userName}</td>
                              <td className="px-4 py-4">{booking.roomNames.join(", ")}</td>
                              <td className="px-4 py-4">{format(booking.date, "MMM dd, yyyy")}</td>
                              <td className="px-4 py-4">{booking.timeSlot}</td>
                              <td className="px-4 py-4">
                                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline">
                                    <Edit className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleOverrideBooking(booking)}
                                  >
                                    <X className="w-3 h-3 mr-1" />
                                    Override
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No bookings found</div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Override Booking Dialog */}
            <Dialog open={isOverridingBooking} onOpenChange={setIsOverridingBooking}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Override Booking</DialogTitle>
                  <DialogDescription>Are you sure you want to override this booking?</DialogDescription>
                </DialogHeader>
                {selectedBooking && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Booking Details</h4>
                        <p className="text-sm text-gray-500">
                          {selectedBooking.userName} • {format(selectedBooking.date, "MMM dd, yyyy")} •{" "}
                          {selectedBooking.timeSlot}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Rooms Booked:</h4>
                      <ul className="space-y-1">
                        {selectedBooking.roomNames.map((roomName, index) => (
                          <li key={index}>{roomName}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-gray-600">
                      Overriding this booking will cancel it and notify the user. This action cannot be undone.
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsOverridingBooking(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmOverride}>
                    Override Booking
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="calendar">
            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Calendar</CardTitle>
                  <CardDescription>Select a date to view bookings</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>
                    Bookings for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Selected Date"}
                  </CardTitle>
                  <CardDescription>All room bookings for this date</CardDescription>
                </CardHeader>
                <CardContent>
                  {getBookingsForDate().length > 0 ? (
                    <div className="space-y-4">
                      {getBookingsForDate().map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">{booking.userName}</h3>
                            <p className="text-sm text-gray-600">
                              {booking.timeSlot} • {booking.roomNames.join(", ")}
                            </p>
                          </div>
                          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">No bookings for this date</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
