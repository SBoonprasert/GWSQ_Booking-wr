"use client"

import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  CalendarIcon,
  ArrowLeft,
  Users,
  Clock,
  CheckCircle,
  CreditCard,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Menu,
  LogOut,
} from "lucide-react"
import { useState, useEffect } from "react"
import { RoomTimetable } from "@/components/room-timetable"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

interface Room {
  id: string
  name: string
  capacity: number
  features: string[]
  image: string
  price: number
}

interface UserInfo {
  name: string
  tier: "student" | "teacher" | "guest" | "faculty"
  maxRooms: number
  maxHours: number
}

interface TimeSlotRange {
  start: string
  end: string
}

export default function RoomSelectionPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([])
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showBookingDialog, setShowBookingDialog] = useState(false)
  const [timeSlotError, setTimeSlotError] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useIsMobile()
  const router = useRouter()

  // Get user info from localStorage on component mount
  useEffect(() => {
    const userTier = localStorage.getItem("userTier") as "student" | "faculty" | "guest" | null
    const userName = localStorage.getItem("userName") || "User"

    if (userTier) {
      setUserInfo({
        name: userName,
        tier: userTier,
        maxRooms: userTier === "student" ? 1 : userTier === "faculty" ? 3 : 2, // Guest can book 2 rooms
        maxHours: userTier === "student" ? 2 : userTier === "faculty" ? 4 : 3, // Student: 2h, Faculty: 4h, Guest: 3h
      })
    }
  }, [])

  const rooms: Room[] = [
    {
      id: "room1",
      name: "Meeting Room A",
      capacity: 10,
      features: ["TV", "Sound System", "Wi-Fi"],
      image: "/room_img/IMG_8920.png",
      price: 50,
    },
    {
      id: "room2",
      name: "Conference Hall B",
      capacity: 10,
      features: ["TV", "Sound System", "Wi-Fi", "Conference table"],
      image: "/room_img/IMG_8923.png",
      price: 100,
    },
    {
      id: "room3",
      name: "Training Room C",
      capacity: 10,
      features: ["TV", "Sound System", "Wi-Fi", "Conference table"],
      image: "/room_img/IMG_8923.png",
      price: 75,
    },
  ]

  const timeSlots = [
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
  ]

  // Enhanced sample time slots with multi-room bookings and topics
  const timetableSlots = [
    {
      time: "09:00 - 10:00",
      bookings: [
        {
          roomId: "room1",
          userId: "user1",
          userName: "John Doe",
          status: "booked" as const,
          bookingId: "booking1",
          topic: "Team Standup",
        },
        { roomId: "room2", status: "available" as const },
        { roomId: "room3", status: "available" as const },
      ],
    },
    {
      time: "10:00 - 11:00",
      bookings: [
        {
          roomId: "room1",
          userId: "user2",
          userName: "Prof. Smith",
          status: "booked" as const,
          bookingId: "booking2",
          topic: "Advanced AI Workshop",
        },
        {
          roomId: "room2",
          userId: "user2",
          userName: "Prof. Smith",
          status: "booked" as const,
          bookingId: "booking2",
          topic: "Advanced AI Workshop",
        },
        {
          roomId: "room3",
          userId: "user2",
          userName: "Prof. Smith",
          status: "booked" as const,
          bookingId: "booking2",
          topic: "Advanced AI Workshop",
        },
      ],
    },
    {
      time: "11:00 - 12:00",
      bookings: [
        { roomId: "room1", status: "available" as const },
        {
          roomId: "room2",
          userId: "user3",
          userName: "Jane Smith",
          status: "booked" as const,
          bookingId: "booking3",
          topic: "Client Presentation",
        },
        {
          roomId: "room3",
          userId: "user3",
          userName: "Jane Smith",
          status: "booked" as const,
          bookingId: "booking3",
          topic: "Client Presentation",
        },
      ],
    },
    {
      time: "12:00 - 13:00",
      bookings: [
        { roomId: "room1", status: "available" as const },
        { roomId: "room2", status: "available" as const },
        { roomId: "room3", status: "available" as const },
      ],
    },
    {
      time: "13:00 - 14:00",
      bookings: [
        { roomId: "room1", status: "available" as const },
        { roomId: "room2", status: "maintenance" as const },
        { roomId: "room3", status: "available" as const },
      ],
    },
    {
      time: "14:00 - 15:00",
      bookings: [
        {
          roomId: "room1",
          userId: "user4",
          userName: "Emily Davis",
          status: "booked" as const,
          bookingId: "booking4",
          topic: "Project Review",
        },
        { roomId: "room2", status: "maintenance" as const },
        {
          roomId: "room3",
          userId: "user5",
          userName: "Michael Brown",
          status: "pending" as const,
          bookingId: "booking5",
          topic: "Training Session",
        },
      ],
    },
    {
      time: "15:00 - 16:00",
      bookings: [
        { roomId: "room1", status: "available" as const },
        { roomId: "room2", status: "available" as const },
        { roomId: "room3", status: "available" as const },
      ],
    },
    {
      time: "16:00 - 17:00",
      bookings: [
        {
          roomId: "room1",
          userId: "user6",
          userName: "Dr. Johnson",
          status: "booked" as const,
          bookingId: "booking6",
          topic: "Research Symposium",
        },
        {
          roomId: "room2",
          userId: "user6",
          userName: "Dr. Johnson",
          status: "booked" as const,
          bookingId: "booking6",
          topic: "Research Symposium",
        },
        { roomId: "room3", status: "available" as const },
      ],
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("userTier")
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const handleRoomSelection = (roomId: string, checked: boolean) => {
    if (!userInfo) return

    if (checked) {
      // Check if user can book more rooms
      if (selectedRooms.length >= userInfo.maxRooms) {
        alert(
          `${
            userInfo.tier === "student" ? "Students" : userInfo.tier === "faculty" ? "Faculty & Staff" : "Guests"
          } can only book ${userInfo.maxRooms} room${userInfo.maxRooms > 1 ? "s" : ""} at a time.`,
        )
        return
      }
      setSelectedRooms([...selectedRooms, roomId])
    } else {
      setSelectedRooms(selectedRooms.filter((id) => id !== roomId))
    }
  }

  const handleTimeSlotSelection = (timeSlot: string) => {
    setTimeSlotError(null)

    if (!userInfo) return

    // If the time slot is already selected, remove it and all slots after it
    if (selectedTimeSlots.includes(timeSlot)) {
      const index = selectedTimeSlots.indexOf(timeSlot)
      setSelectedTimeSlots(selectedTimeSlots.slice(0, index))
      return
    }

    // If no slots are selected yet, select this one
    if (selectedTimeSlots.length === 0) {
      setSelectedTimeSlots([timeSlot])
      return
    }

    // Find the indices of the selected time slot and the last selected time slot
    const timeSlotIndex = timeSlots.indexOf(timeSlot)
    const lastSelectedIndex = timeSlots.indexOf(selectedTimeSlots[selectedTimeSlots.length - 1])

    // Only allow selecting consecutive time slots
    if (timeSlotIndex !== lastSelectedIndex + 1) {
      setTimeSlotError("Please select consecutive time slots")
      return
    }

    // Check if adding this slot would exceed the user's maximum allowed hours
    if (selectedTimeSlots.length + 1 > userInfo.maxHours) {
      setTimeSlotError(
        `${
          userInfo.tier === "student" ? "Students" : userInfo.tier === "faculty" ? "Faculty & Staff" : "Guests"
        } can only book for up to ${userInfo.maxHours} hour${userInfo.maxHours > 1 ? "s" : ""} at a time.`,
      )
      return
    }

    // Add the time slot
    setSelectedTimeSlots([...selectedTimeSlots, timeSlot])
  }

  const getTimeSlotRange = (): TimeSlotRange | null => {
    if (selectedTimeSlots.length === 0) return null

    const firstSlot = selectedTimeSlots[0]
    const lastSlot = selectedTimeSlots[selectedTimeSlots.length - 1]

    return {
      start: firstSlot.split(" - ")[0],
      end: lastSlot.split(" - ")[1],
    }
  }

  const handleBooking = () => {
    if (selectedRooms.length === 0) {
      alert("Please select at least one room.")
      return
    }
    if (selectedTimeSlots.length === 0) {
      alert("Please select at least one time slot.")
      return
    }
    setShowBookingDialog(true)
  }

  const confirmBooking = () => {
    // Here you would typically send the booking data to your backend
    alert("Booking confirmed! You will receive a confirmation email shortly.")
    setShowBookingDialog(false)
    setSelectedRooms([])
    setSelectedTimeSlots([])
    setTimeSlotError(null)
  }

  const cancelBooking = () => {
    setShowBookingDialog(false)
  }

  const getTotalPrice = () => {
    // Free for students and faculty/staff
    if (userInfo?.tier === "student" || userInfo?.tier === "faculty") {
      return 0
    }

    // Guests pay the standard price
    return selectedRooms.reduce((total, roomId) => {
      const room = rooms.find((r) => r.id === roomId)
      return total + (room?.price || 0) * selectedTimeSlots.length
    }, 0)
  }

  const getTierColor = (tier: "student" | "faculty" | "guest") => {
    switch (tier) {
      case "student":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      case "faculty":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      case "guest":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getTierIcon = (tier: "student" | "faculty" | "guest") => {
    switch (tier) {
      case "student":
        return <GraduationCap className="w-4 h-4 mr-1" />
      case "faculty":
        return <BookOpen className="w-4 h-4 mr-1" />
      case "guest":
        return <CreditCard className="w-4 h-4 mr-1" />
      default:
        return null
    }
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const HeaderContent = () => (
    <>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild className="hidden md:flex">
          <Link href="/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </Button>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100">Room Booking</h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <span className="text-sm text-gray-600 dark:text-gray-400">Welcome, {userInfo.name}</span>
            <Badge className={getTierColor(userInfo.tier)}>
              <div className="flex items-center">
                {getTierIcon(userInfo.tier)}
                {userInfo.tier.charAt(0).toUpperCase() + userInfo.tier.slice(1)}
              </div>
            </Badge>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({selectedRooms.length}/{userInfo.maxRooms} rooms)
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4">
        <ThemeToggle />
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[140px] md:w-[200px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, isMobile ? "MMM d" : "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={(date) => date < new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Button variant="outline" className="hidden md:inline-flex" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header - Desktop */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="hidden md:flex items-center justify-between">
            <HeaderContent />
          </div>

          {/* Header - Mobile */}
          <div className="flex md:hidden items-center justify-between">
            <div className="flex items-center gap-2">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[80%] sm:w-[350px]">
                  <div className="flex flex-col h-full">
                    <div className="py-4 border-b">
                      <h2 className="text-lg font-semibold">Room Booking</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Welcome, {userInfo.name}</p>
                    </div>
                    <div className="flex items-center gap-2 py-4 border-b">
                      <Badge className={getTierColor(userInfo.tier)}>
                        <div className="flex items-center">
                          {getTierIcon(userInfo.tier)}
                          {userInfo.tier.charAt(0).toUpperCase() + userInfo.tier.slice(1)}
                        </div>
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Max {userInfo.maxRooms} room{userInfo.maxRooms > 1 ? "s" : ""}, {userInfo.maxHours} hour
                        {userInfo.maxHours > 1 ? "s" : ""}
                      </span>
                    </div>
                    <nav className="flex flex-col gap-1 py-4">
                      <Button
                        variant="ghost"
                        asChild
                        className="justify-start"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/login">
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Back to Login
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        className="justify-start"
                        onClick={() => {
                          setMobileMenuOpen(false)
                          handleLogout()
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </nav>
                    <div className="mt-auto py-4 border-t">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {userInfo.tier === "student" || userInfo.tier === "faculty"
                          ? "University members book for free!"
                          : "Standard rates apply for guests."}
                      </p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Room Booking</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={"outline"} size="icon">
                    <CalendarIcon className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8 space-y-4 md:space-y-8">
        {/* Mobile Date Display */}
        <div className="md:hidden text-center py-2">
          <div className="text-sm text-gray-600 dark:text-gray-400">Selected Date:</div>
          <div className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</div>
        </div>

        {/* Booking Limits Info */}
        <Card className={`border-l-4 ${userInfo.tier === "guest" ? "border-l-amber-500" : "border-l-blue-500"}`}>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">Your Account Type</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You are logged in as a <strong>{userInfo.tier}</strong> and can book up to{" "}
                  <strong>
                    {userInfo.maxRooms} room{userInfo.maxRooms > 1 ? "s" : ""}
                  </strong>{" "}
                  for up to <strong>{userInfo.maxHours} hours</strong> at a time.
                  {userInfo.tier === "student" || userInfo.tier === "faculty" ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {" "}
                      University members book for free!
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      {" "}
                      Standard rates apply for guests.
                    </span>
                  )}
                </p>
              </div>
              <div className="text-center md:text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {selectedRooms.length}/{userInfo.maxRooms}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Rooms Selected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Selection Section */}
        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
            <CardDescription>
              Select up to {userInfo.maxRooms} room{userInfo.maxRooms > 1 ? "s" : ""} for your booking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {rooms.map((room) => (
                <Card
                  key={room.id}
                  className={`cursor-pointer transition-all ${
                    selectedRooms.includes(room.id)
                      ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => {
                    const isSelected = selectedRooms.includes(room.id)
                    handleRoomSelection(room.id, !isSelected)
                  }}
                >
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base md:text-lg">{room.name}</CardTitle>
                      <Checkbox
                        checked={selectedRooms.includes(room.id)}
                        onCheckedChange={(checked) => handleRoomSelection(room.id, checked as boolean)}
                        disabled={!selectedRooms.includes(room.id) && selectedRooms.length >= userInfo.maxRooms}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <CardDescription className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {room.capacity} people
                      </span>
                      {userInfo.tier === "guest" ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">${room.price}/hour</span>
                      ) : (
                        <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0 md:pt-0">
                    <img
                      src={room.image || "/placeholder.svg"}
                      alt={room.name}
                      className="w-full h-30 md:h-56 object-cover rounded-md mb-4"
                    />
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm md:text-base">Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {room.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Slot Selection */}
        {selectedRooms.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Time Slot</CardTitle>
              <CardDescription>
                Choose your preferred time slot (up to {userInfo.maxHours} consecutive hours)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeSlotError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{timeSlotError}</AlertDescription>
                </Alert>
              )}

              {/* Desktop Time Slots */}
              <div className="hidden md:grid grid-cols-4 lg:grid-cols-8 gap-3">
                {timeSlots.map((slot, index) => {
                  const isSelected = selectedTimeSlots.includes(slot)
                  const isSelectable =
                    selectedTimeSlots.length === 0 ||
                    timeSlots.indexOf(slot) === timeSlots.indexOf(selectedTimeSlots[selectedTimeSlots.length - 1]) + 1

                  return (
                    <Button
                      key={slot}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "flex items-center gap-2",
                        isSelected && "relative",
                        !isSelectable && selectedTimeSlots.length > 0 && !isSelected && "opacity-50 cursor-not-allowed",
                      )}
                      onClick={() => handleTimeSlotSelection(slot)}
                      disabled={!isSelectable && !isSelected}
                    >
                      <Clock className="w-4 h-4" />
                      {slot}
                      {isSelected && selectedTimeSlots.length > 1 && selectedTimeSlots[0] === slot && (
                        <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5">Start</Badge>
                      )}
                      {isSelected &&
                        selectedTimeSlots.length > 1 &&
                        selectedTimeSlots[selectedTimeSlots.length - 1] === slot && (
                          <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5">End</Badge>
                        )}
                    </Button>
                  )
                })}
              </div>

              {/* Mobile Time Slots */}
              <div className="md:hidden grid grid-cols-2 gap-2">
                {timeSlots.map((slot, index) => {
                  const isSelected = selectedTimeSlots.includes(slot)
                  const isSelectable =
                    selectedTimeSlots.length === 0 ||
                    timeSlots.indexOf(slot) === timeSlots.indexOf(selectedTimeSlots[selectedTimeSlots.length - 1]) + 1

                  return (
                    <Button
                      key={slot}
                      variant={isSelected ? "default" : "outline"}
                      className={cn(
                        "flex items-center justify-center gap-1 h-auto py-3 text-sm",
                        isSelected && "relative",
                        !isSelectable && selectedTimeSlots.length > 0 && !isSelected && "opacity-50 cursor-not-allowed",
                      )}
                      onClick={() => handleTimeSlotSelection(slot)}
                      disabled={!isSelectable && !isSelected}
                    >
                      <Clock className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{slot}</span>
                      {isSelected && selectedTimeSlots.length > 1 && selectedTimeSlots[0] === slot && (
                        <Badge className="absolute -top-2 -right-2 px-1 py-0 text-[10px]">Start</Badge>
                      )}
                      {isSelected &&
                        selectedTimeSlots.length > 1 &&
                        selectedTimeSlots[selectedTimeSlots.length - 1] === slot && (
                          <Badge className="absolute -top-2 -right-2 px-1 py-0 text-[10px]">End</Badge>
                        )}
                    </Button>
                  )
                })}
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Note:</strong>{" "}
                  {userInfo.tier === "student"
                    ? "Students"
                    : userInfo.tier === "faculty"
                      ? "Faculty & Staff"
                      : "Guests"}{" "}
                  can book for up to {userInfo.maxHours} consecutive hours.
                </p>
                {selectedTimeSlots.length > 0 && (
                  <p className="mt-2">
                    <strong>Selected time range:</strong> {getTimeSlotRange()?.start} - {getTimeSlotRange()?.end} (
                    {selectedTimeSlots.length} hour{selectedTimeSlots.length > 1 ? "s" : ""})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Booking Summary */}
        {selectedRooms.length > 0 && selectedTimeSlots.length > 0 && (
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Selected Rooms:</h4>
                  <div className="space-y-2">
                    {selectedRooms.map((roomId) => {
                      const room = rooms.find((r) => r.id === roomId)
                      return room ? (
                        <div
                          key={roomId}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div>
                            <span className="font-medium">{room.name}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                              ({room.capacity} people)
                            </span>
                          </div>
                          {userInfo.tier === "guest" ? (
                            <span className="font-semibold">${room.price}/hour</span>
                          ) : (
                            <span className="font-semibold text-green-600 dark:text-green-400">Free</span>
                          )}
                        </div>
                      ) : null
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Selected Time:</h4>
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <span className="font-medium">
                          {getTimeSlotRange()?.start} - {getTimeSlotRange()?.end}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          ({selectedTimeSlots.length} hour{selectedTimeSlots.length > 1 ? "s" : ""})
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {format(selectedDate, "MMMM d, yyyy")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t gap-4">
                  <div>
                    <div className="font-semibold">
                      Total:{" "}
                      {getTotalPrice() === 0 ? (
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      ) : (
                        <span>
                          ${getTotalPrice()} ({selectedTimeSlots.length} hour{selectedTimeSlots.length > 1 ? "s" : ""} ×
                          ${getTotalPrice() / selectedTimeSlots.length})
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Date: {format(selectedDate, "MMMM d, yyyy")}
                    </div>
                  </div>
                  <Button onClick={handleBooking} size="lg" className="w-full sm:w-auto">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Availability Timetable Section */}
        <div className="mt-4 md:mt-8 overflow-hidden">
          <RoomTimetable
            date={selectedDate}
            rooms={rooms.map((room) => ({ id: room.id, name: room.name }))}
            timeSlots={timetableSlots}
          />
        </div>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>Please review your booking details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Booking Details:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>User:</strong> {userInfo.name} ({userInfo.tier})
                </div>
                <div>
                  <strong>Date:</strong> {format(selectedDate, "MMMM d, yyyy")}
                </div>
                <div>
                  <strong>Time:</strong> {getTimeSlotRange()?.start} - {getTimeSlotRange()?.end} (
                  {selectedTimeSlots.length} hour{selectedTimeSlots.length > 1 ? "s" : ""})
                </div>
                <div>
                  <strong>Rooms:</strong>
                </div>
                <ul className="ml-4 space-y-1">
                  {selectedRooms.map((roomId) => {
                    const room = rooms.find((r) => r.id === roomId)
                    return room ? (
                      <li key={roomId}>
                        • {room.name}{" "}
                        {userInfo.tier === "guest" ? (
                          <span>- ${room.price}/hour</span>
                        ) : (
                          <span className="text-green-600 dark:text-green-400">- Free</span>
                        )}
                      </li>
                    ) : null
                  })}
                </ul>
                <div className="pt-2 border-t">
                  <strong>Total Cost:</strong>{" "}
                  {getTotalPrice() === 0 ? (
                    <span className="text-green-600 dark:text-green-400">Free</span>
                  ) : (
                    <span>${getTotalPrice()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={cancelBooking} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={confirmBooking} className="w-full sm:w-auto">
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
