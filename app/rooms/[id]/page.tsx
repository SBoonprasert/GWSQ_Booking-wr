"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, Wifi, Tv, Car, Coffee, MapPin, Users, Bed, Bath, Square } from "lucide-react"
import Link from "next/link"

export default function RoomVirtualTour({ params }: { params: { id: string } }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Mock room data - in real app, fetch based on params.id
  const room = {
    id: params.id,
    name: "Executive Suite",
    type: "Suite",
    capacity: 4,
    price: 299,
    rating: 4.8,
    reviews: 124,
    amenities: ["WiFi", "TV", "Mini Bar", "Balcony", "Room Service", "AC", "Safe", "Parking"],
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
    description:
      "Experience luxury at its finest in our Executive Suite. This spacious accommodation features a separate living area, premium amenities, and breathtaking city views. Perfect for business travelers and those seeking an elevated stay experience.",
    features: {
      bedrooms: 1,
      bathrooms: 1,
      area: "650 sq ft",
    },
    virtualTour: "/placeholder.svg?height=400&width=800",
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="w-5 h-5" />
      case "tv":
        return <Tv className="w-5 h-5" />
      case "parking":
        return <Car className="w-5 h-5" />
      case "room service":
        return <Coffee className="w-5 h-5" />
      default:
        return <MapPin className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Rooms
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>
                  {room.rating} ({room.reviews} reviews)
                </span>
                <span>•</span>
                <span>{room.type}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="photos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="photos">Photos</TabsTrigger>
                <TabsTrigger value="virtual">Virtual Tour</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
              </TabsList>

              <TabsContent value="photos" className="space-y-4">
                <Card>
                  <CardContent className="p-0">
                    <div className="relative">
                      <img
                        src={room.images[currentImageIndex] || "/placeholder.svg"}
                        alt={`${room.name} - Image ${currentImageIndex + 1}`}
                        className="w-full h-96 object-cover rounded-t-lg"
                      />
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {room.images.length}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-2 overflow-x-auto">
                        {room.images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                              currentImageIndex === index ? "border-blue-500" : "border-gray-200"
                            }`}
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="virtual">
                <Card>
                  <CardHeader>
                    <CardTitle>360° Virtual Tour</CardTitle>
                    <CardDescription>Explore the room with our interactive virtual tour</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={room.virtualTour || "/placeholder.svg"}
                        alt="Virtual Tour"
                        className="w-full h-96 object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="lg">Start Virtual Tour</Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Click and drag to look around, use mouse wheel to zoom in/out
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amenities">
                <Card>
                  <CardHeader>
                    <CardTitle>Room Amenities</CardTitle>
                    <CardDescription>Everything you need for a comfortable stay</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {room.amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          {getAmenityIcon(amenity)}
                          <span className="font-medium">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Card>
              <CardHeader>
                <CardTitle>About This Room</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{room.description}</p>

                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="flex items-center gap-2">
                    <Bed className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{room.features.bedrooms}</div>
                      <div className="text-sm text-gray-600">Bedroom</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bath className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{room.features.bathrooms}</div>
                      <div className="text-sm text-gray-600">Bathroom</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Square className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="font-medium">{room.features.area}</div>
                      <div className="text-sm text-gray-600">Total Area</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">${room.price}</CardTitle>
                    <CardDescription>per night</CardDescription>
                  </div>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Up to {room.capacity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Check-in</label>
                    <input
                      type="date"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Check-out</label>
                    <input
                      type="date"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Guests</label>
                    <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {Array.from({ length: room.capacity }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} Guest{i > 0 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Book Now
                </Button>

                <div className="text-center text-sm text-gray-600">You won't be charged yet</div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>${room.price} × 2 nights</span>
                    <span>${room.price * 2}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service fee</span>
                    <span>$25</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Total</span>
                    <span>${room.price * 2 + 25}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
