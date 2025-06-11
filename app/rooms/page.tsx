import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Eye } from "lucide-react"
import Link from "next/link"

const rooms = [
  {
    id: "1",
    name: "Executive Suite",
    type: "Suite",
    capacity: 4,
    price: 299,
    rating: 4.8,
    image: "/placeholder.svg?height=300&width=400",
    description: "Luxurious executive suite with panoramic city views",
  },
  {
    id: "2",
    name: "Deluxe Ocean View",
    type: "Deluxe",
    capacity: 3,
    price: 199,
    rating: 4.6,
    image: "/placeholder.svg?height=300&width=400",
    description: "Beautiful room with stunning ocean views",
  },
  {
    id: "3",
    name: "Standard Room",
    type: "Standard",
    capacity: 2,
    price: 149,
    rating: 4.3,
    image: "/placeholder.svg?height=300&width=400",
    description: "Comfortable standard room for business travelers",
  },
]

export default function RoomsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Available Rooms</h1>
            <Button asChild>
              <Link href="/login">Sign In to Book</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader className="p-0">
                <div className="relative">
                  <img
                    src={room.image || "/placeholder.svg"}
                    alt={room.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
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
                  <p className="text-sm text-gray-600">{room.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <span className="text-2xl font-bold">${room.price}</span>
                      <span className="text-sm text-gray-600">/night</span>
                    </div>
                    <Button asChild>
                      <Link href="/login">Book Now</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
