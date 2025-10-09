'use client'

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth-context'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { 
  Upload, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Image, 
  Plus, 
  Trash2, 
  Save,
  ArrowLeft,
  Camera,
  Home,
  Car,
  Wrench,
  Laptop,
  Shirt,
  Music,
  Camera as CameraIcon,
  Star,
  Shield,
  Clock,
  Users
} from 'lucide-react'

interface ListingForm {
  title: string
  description: string
  category: string
  subcategory: string
  price: string
  priceType: 'per_hour' | 'per_day' | 'per_week' | 'per_month'
  location: string
  availability: {
    startDate: string
    endDate: string
    timeSlots: string[]
  }
  features: string[]
  images: File[]
  rules: string[]
  contactInfo: {
    phone: string
    email: string
    preferredContact: 'phone' | 'email' | 'both'
  }
}

const categories = [
  { value: 'vehicles', label: 'Vehicles', icon: Car, subcategories: ['Cars', 'Motorcycles', 'Trucks', 'Bicycles', 'Scooters'] },
  { value: 'equipment', label: 'Equipment', icon: Wrench, subcategories: ['Construction', 'Gardening', 'Cleaning', 'Kitchen', 'Office'] },
  { value: 'homes', label: 'Homes & Apartments', icon: Home, subcategories: ['Apartments', 'Houses', 'Rooms', 'Studios', 'Villas'] },
  { value: 'electronics', label: 'Electronics', icon: Laptop, subcategories: ['Computers', 'Phones', 'Cameras', 'Audio', 'Gaming'] },
  { value: 'fashion', label: 'Fashion', icon: Shirt, subcategories: ['Clothing', 'Shoes', 'Accessories', 'Jewelry', 'Bags'] },
  { value: 'entertainment', label: 'Entertainment', icon: Music, subcategories: ['Instruments', 'Gaming', 'Events', 'Sports', 'Books'] },
  { value: 'photography', label: 'Photography', icon: CameraIcon, subcategories: ['Cameras', 'Lighting', 'Accessories', 'Studios', 'Props'] }
]

const priceTypes = [
  { value: 'per_hour', label: 'Per Hour' },
  { value: 'per_day', label: 'Per Day' },
  { value: 'per_week', label: 'Per Week' },
  { value: 'per_month', label: 'Per Month' }
]

export default function CreateListingPage() {
  const { user, userProfile } = useAuthContext()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const [formData, setFormData] = useState<ListingForm>({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    price: '',
    priceType: 'per_day',
    location: '',
    availability: {
      startDate: '',
      endDate: '',
      timeSlots: []
    },
    features: [],
    images: [],
    rules: [],
    contactInfo: {
      phone: '',
      email: user?.email || '',
      preferredContact: 'both'
    }
  })

  const [newFeature, setNewFeature] = useState('')
  const [newRule, setNewRule] = useState('')
  const [newTimeSlot, setNewTimeSlot] = useState('')

  // Redirect if not authenticated or not owner
  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    if (userProfile?.accountType !== 'owner') {
      router.push('/profile/switch-account')
      return
    }
  }, [user, userProfile, router])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ListingForm],
        [field]: value
      }
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const addRule = () => {
    if (newRule.trim()) {
      setFormData(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }))
      setNewRule('')
    }
  }

  const removeRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }))
  }

  const addTimeSlot = () => {
    if (newTimeSlot.trim()) {
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          timeSlots: [...prev.availability.timeSlots, newTimeSlot.trim()]
        }
      }))
      setNewTimeSlot('')
    }
  }

  const removeTimeSlot = (index: number) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: prev.availability.timeSlots.filter((_, i) => i !== index)
      }
    }))
  }

  const uploadImages = async (images: File[]) => {
    const uploadPromises = images.map(async (image) => {
      const imageRef = ref(storage, `listings/${user?.uid}/${Date.now()}_${image.name}`)
      const snapshot = await uploadBytes(imageRef, image)
      return getDownloadURL(snapshot.ref)
    })
    return Promise.all(uploadPromises)
  }

  const handleSubmit = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Upload images
      const imageUrls = await uploadImages(formData.images)

      // Create listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        price: parseFloat(formData.price),
        priceType: formData.priceType,
        location: formData.location,
        availability: formData.availability,
        features: formData.features,
        images: imageUrls,
        rules: formData.rules,
        contactInfo: formData.contactInfo,
        ownerId: user.uid,
        ownerName: user.displayName || 'User',
        ownerEmail: user.email,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        views: 0,
        bookings: 0,
        rating: 0,
        reviews: 0
      }

      // Save to Firestore
      await addDoc(collection(db, 'listings'), listingData)

      toast({
        title: "Success",
        description: "Your listing has been created successfully!"
      })

      router.push('/profile/listings')
    } catch (error) {
      console.error('Error creating listing:', error)
      toast({
        title: "Error",
        description: "Failed to create listing. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedCategory = categories.find(cat => cat.value === formData.category)

  if (!user || userProfile?.accountType !== 'owner') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Listing</h1>
              <p className="text-gray-600">List your item for rent and start earning</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="review">Review</TabsTrigger>
          </TabsList>

          {/* Basic Information Tab */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about your item</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Listing Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., 2023 Toyota Camry - Perfect for Road Trips"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your item in detail..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => {
                          const IconComponent = category.icon
                          return (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center space-x-2">
                                <IconComponent className="h-4 w-4" />
                                <span>{category.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select value={formData.subcategory} onValueChange={(value) => handleInputChange('subcategory', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedCategory?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub.toLowerCase().replace(' ', '_')}>
                            {sub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priceType">Price Type *</Label>
                    <Select value={formData.priceType} onValueChange={(value: any) => handleInputChange('priceType', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {priceTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Nairobi, Kenya"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Item Details</CardTitle>
                <CardDescription>Add features, rules, and images</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="space-y-4">
                  <Label>Features</Label>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary">{feature}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFeature(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Add a feature..."
                    />
                    <Button onClick={addFeature}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Rules */}
                <div className="space-y-4">
                  <Label>Rules & Requirements</Label>
                  <div className="space-y-2">
                    {formData.rules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline">{rule}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeRule(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newRule}
                      onChange={(e) => setNewRule(e.target.value)}
                      placeholder="Add a rule..."
                    />
                    <Button onClick={addRule}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                  <Label>Images</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Add Images</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <Label>Contact Information</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.contactInfo.phone}
                        onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                        placeholder="+254 700 000 000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contactInfo.email}
                        onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredContact">Preferred Contact Method</Label>
                    <Select 
                      value={formData.contactInfo.preferredContact} 
                      onValueChange={(value: any) => handleNestedInputChange('contactInfo', 'preferredContact', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
                <CardDescription>Set when your item is available for rent</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Available From</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.availability.startDate}
                      onChange={(e) => handleNestedInputChange('availability', 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Available Until</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.availability.endDate}
                      onChange={(e) => handleNestedInputChange('availability', 'endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Time Slots (Optional)</Label>
                  <div className="space-y-2">
                    {formData.availability.timeSlots.map((slot, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary">{slot}</Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeTimeSlot(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTimeSlot}
                      onChange={(e) => setNewTimeSlot(e.target.value)}
                      placeholder="e.g., 9:00 AM - 5:00 PM"
                    />
                    <Button onClick={addTimeSlot}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Your Listing</CardTitle>
                <CardDescription>Make sure everything looks good before publishing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{formData.title}</h3>
                    <p className="text-gray-600">{formData.description}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <Badge variant="outline">{selectedCategory?.label}</Badge>
                    <Badge variant="outline">{formData.subcategory}</Badge>
                    <span className="text-lg font-semibold">
                      ${formData.price} {formData.priceType.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{formData.location}</span>
                  </div>

                  {formData.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Features:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <Badge key={index} variant="secondary">{feature}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.rules.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Rules:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {formData.rules.map((rule, index) => (
                          <li key={index} className="text-sm text-gray-600">{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Images ({formData.images.length}):</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {formData.images.map((image, index) => (
                        <img
                          key={index}
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || !formData.title || !formData.description || !formData.price}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Create Listing
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}