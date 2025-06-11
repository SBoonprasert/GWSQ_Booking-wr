"use client"

import { useState, useEffect } from "react"
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
import {
  Plus,
  Edit,
  Trash2,
  CalendarIcon,
  Settings,
  Eye,
  AlertTriangle,
  X,
  LogOut,
  Wifi,
  Tv,
  Video,
  Coffee,
  Presentation,
  Mic,
  PenTool,
  PlusIcon,
} from "lucide-react"
import { format } from "date-fns"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

// Available amenities with their icons
const availableAmenities = [
  { id: "wifi", name: "WiFi", icon: <Wifi className="w-4 h-4" /> },
  { id: "projector", name: "Projector", icon: <Presentation className="w-4 h-4" /> },
  { id: "whiteboard", name: "Whiteboard", icon: <PenTool className="w-4 h-4" /> },
  { id: "videoConf", name: "Video Conferencing", icon: <Video className="w-4 h-4" /> },
  { id: "tv", name: "TV", icon: <Tv className="w-4 h-4" /> },
  { id: "coffee", name: "Coffee Machine", icon: <Coffee className="w-4 h-4" /> },
  { id: "mic", name: "Microphone", icon: <Mic className="w-4 h-4" /> },
  { id: "catering", name: "Catering", icon: <Coffee className="w-4 h-4" /> },
]

export default function AdminDashboard() {
  const router = useRouter()
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
  const [formError, setFormError] = useState("")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [customAmenity, setCustomAmenity] = useState("")

  // Check if user is admin on component mount
  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const validateRoomForm = () => {
    if (!currentRoom.name || currentRoom.name.trim() === "") {
      setFormError("Room name is required")
      return false
    }
    if (!currentRoom.type) {
      setFormError("Room type is required")
      return false
    }
    if (!currentRoom.capacity || currentRoom.capacity < 1) {
      setFormError("Capacity must be at least 1")
      return false
    }
    if (!currentRoom.price || currentRoom.price < 0) {
      setFormError("Price cannot be negative")
      return false
    }
    setFormError("")
    return true
  }

  const handleAddRoom = () => {
    if (!validateRoomForm()) return

    const room: Room = {
      id: Date.now().toString(),
      name: currentRoom.name || "",
      type: currentRoom.type || "",
      capacity: currentRoom.capacity || 1,
      price: currentRoom.price || 0,
      status: (currentRoom.status as "available" | "occupied" | "maintenance") || "available",
      amenities: selectedAmenities,
      images: ["/placeholder.svg?height=200&width=300"],
      description: currentRoom.description || "",
    }
    setRooms([...rooms, room])
    resetRoomForm()
    setIsAddingRoom(false)
  }

  const handleEditRoom = (room: Room) => {
    setCurrentRoom(room)
    setSelectedAmenities(room.amenities || [])
    setIsEditingRoom(true)
  }

  const saveEditedRoom = () => {
    if (!validateRoomForm()) return

    const updatedRoom = {
      ...currentRoom,
      amenities: selectedAmenities,
    } as Room

    setRooms(rooms.map((room) => (room.id === currentRoom.id ? updatedRoom : room)))
    resetRoomForm()
    setIsEditingRoom(false)
  }

  const resetRoomForm = () => {
    setCurrentRoom({
      name: "",
      type: "",
      capacity: 1,
      price: 0,
      status: "available",
      amenities: [],
      description: "",
    })
    setSelectedAmenities([])
    setCustomAmenity("")
    setFormError("")
  }

  const handleDeleteRoom = (roomId: string) => {
    if (confirm("Are you sure you want to delete this room? This action cannot be undone.")) {
      setRooms(rooms.filter((room) => room.id !== roomId))
    }
  }

  const handleViewRoom = (roomId: string) => {
    const room = rooms.find((r) => r.id === roomId)
    if (room) {
      alert(
        `Room Details:\n\nName: ${room.name}\nType: ${room.type}\nCapacity: ${room.capacity}\nPrice: $${room.price}/hour\nStatus: ${room.status}\nAmenities: ${room.amenities.join(", ")}\nDescription: ${room.description}`,
      )
    }
  }

  const handleEditBooking = (bookingId: string) => {
    const booking = bookings.find((b) => b.id === bookingId)
    if (booking) {
      alert(`Edit booking functionality would open here for booking: ${booking.id}`)
    }
  }

  const handleOverrideBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setIsOverridingBooking(true)
  }

  const confirmOverride = () => {
    if (selectedBooking) {
      setBookings(bookings.filter((b) => b.id !== selectedBooking.id))
      alert(`Booking ${selectedBooking.id} has been cancelled and the user has been notified.`)
    }
    setIsOverridingBooking(false)
    setSelectedBooking(null)
  }

  const cancelOverride = () => {
    setIsOverridingBooking(false)
    setSelectedBooking(null)
  }

  const cancelAddRoom = () => {
    resetRoomForm()
    setIsAddingRoom(false)
  }

  const cancelEditRoom = () => {
    resetRoomForm()
    setIsEditingRoom(false)
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const addCustomAmenity = () => {
    if (customAmenity && customAmenity.trim() !== "" && !selectedAmenities.includes(customAmenity)) {
      setSelectedAmenities((prev) => [...prev, customAmenity])
      setCustomAmenity("")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "occupied":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "confirmed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getBookingsForDate = () => {
    if (!selectedDate) return []
    return bookings.filter((booking) => booking.date.toDateString() === selectedDate.toDateString())
  }

  const RoomForm = () => (
    <div className="space-y-4">
      {formError && (
        <Alert variant="destructive">
          <AlertDescription>{formError}</AlertDescription>
        </Alert>
      )}
      <div>
        <Label htmlFor="room-name">Room Name*</Label>
        <Input
          id="room-name"
          value={currentRoom.name}
          onChange={(e) => setCurrentRoom({ ...currentRoom, name: e.target.value })}
          placeholder="Conference Room A"
        />
      </div>
      <div>
        <Label htmlFor="room-type">Room Type*</Label>
        <Select value={currentRoom.type} onValueChange={(value) => setCurrentRoom({ ...currentRoom, type: value })}>
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
        <Label htmlFor="capacity">Capacity*</Label>
        <Input
          id="capacity"
          type="number"
          value={currentRoom.capacity}
          onChange={(e) => setCurrentRoom({ ...currentRoom, capacity: Number.parseInt(e.target.value) || 1 })}
          min="1"
        />
      </div>
      <div>
        <Label htmlFor="price">Price per Hour ($)*</Label>
        <Input
          id="price"
          type="number"
          value={currentRoom.price}
          onChange={(e) => setCurrentRoom({ ...currentRoom, price: Number.parseInt(e.target.value) || 0 })}
          min="0"
        />
      </div>
      <div>
        <Label htmlFor="status">Status*</Label>
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
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {availableAmenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity.id}`}
                checked={selectedAmenities.includes(amenity.name)}
                onCheckedChange={() => toggleAmenity(amenity.name)}
              />
              <Label htmlFor={`amenity-${amenity.id}`} className="flex items-center gap-1 cursor-pointer">
                {amenity.icon} {amenity.name}
              </Label>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3">
          <Input
            placeholder="Add custom amenity"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            className="flex-1"
          />
          <Button type="button" size="sm" onClick={addCustomAmenity}>
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
        {selectedAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedAmenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                {amenity}
                <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={() => toggleAmenity(amenity)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
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
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
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
                  <RoomForm />
                  <DialogFooter>
                    <Button variant="outline" onClick={cancelAddRoom}>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">{room.description}</p>
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
                        <Button size="sm" variant="outline" onClick={() => handleViewRoom(room.id)}>
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
                <RoomForm />
                <DialogFooter>
                  <Button variant="outline" onClick={cancelEditRoom}>
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
                          <tr className="bg-gray-50 dark:bg-gray-800">
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              User
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              Room(s)
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              Date
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              Time
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              Status
                            </th>
                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map((booking) => (
                            <tr key={booking.id} className="border-t border-gray-200 dark:border-gray-700">
                              <td className="px-4 py-4">{booking.userName}</td>
                              <td className="px-4 py-4">{booking.roomNames.join(", ")}</td>
                              <td className="px-4 py-4">{format(booking.date, "MMM dd, yyyy")}</td>
                              <td className="px-4 py-4">{booking.timeSlot}</td>
                              <td className="px-4 py-4">
                                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => handleEditBooking(booking.id)}>
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
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">No bookings found</div>
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
                      <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Booking Details</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {selectedBooking.userName} • {format(selectedBooking.date, "MMM dd, yyyy")} •{" "}
                          {selectedBooking.timeSlot}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Rooms Booked:</h4>
                      <ul className="space-y-1">
                        {selectedBooking.roomNames.map((roomName, index) => (
                          <li key={index}>{roomName}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Overriding this booking will cancel it and notify the user. This action cannot be undone.
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={cancelOverride}>
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
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                        >
                          <div>
                            <h3 className="font-medium">{booking.userName}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.timeSlot} • {booking.roomNames.join(", ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            <Button size="sm" variant="outline" onClick={() => handleEditBooking(booking.id)}>
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">No bookings for this date</div>
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
