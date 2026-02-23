'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  X, Upload, ChevronLeft, ChevronRight, Plus, 
  Trash2, Edit2, MapPin, Star, Bed, Users, 
  Calendar, DollarSign, Image as ImageIcon 
} from 'lucide-react';

// Types
interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  rooms: number;
  guests: number;
  images: string[];
  amenities: string[];
  createdAt: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  capacity: number;
  images: string[];
  hotelId?: string;
  createdAt: string;
}

// Image Upload Component
interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

function ImageUpload({ images, onImagesChange }: ImageUploadProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onImagesChange([...images, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    if (currentSlide >= newImages.length) {
      setCurrentSlide(Math.max(0, newImages.length - 1));
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
          <img 
            src={images[currentSlide]} 
            alt={`Image ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <button
            onClick={() => removeImage(currentSlide)}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-sm text-white">
            {currentSlide + 1} / {images.length}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-4 border-2 border-dashed border-gray-600 hover:border-emerald-500 rounded-xl transition-colors flex flex-col items-center gap-2 bg-gray-800"
          >
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-400">Upload from Computer</span>
            <span className="text-xs text-gray-500">Multiple images allowed</span>
          </button>
        </div>

        <div className="p-4 border border-gray-600 rounded-xl bg-gray-800">
          <label className="block text-sm text-gray-400 mb-2">Add Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm outline-none focus:border-emerald-500 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const url = e.currentTarget.value.trim();
                  if (url) {
                    onImagesChange([...images, url]);
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
            <button
              onClick={(e) => {
                const input = (e.target as HTMLElement).previousElementSibling as HTMLInputElement;
                const url = input.value.trim();
                if (url) {
                  onImagesChange([...images, url]);
                  input.value = '';
                }
              }}
              className="px-3 py-2 bg-emerald-500 text-gray-900 rounded-lg text-sm font-medium hover:bg-emerald-400"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === currentSlide ? 'border-emerald-500' : 'border-transparent'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Main Admin Panel Component
export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'hotels' | 'events'>('hotels');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hotel Form State
  const [hotelForm, setHotelForm] = useState({
    name: '',
    description: '',
    location: '',
    price: '',
    rating: '',
    rooms: '',
    guests: '',
    images: [] as string[],
    amenities: [] as string[]
  });

  // Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: '',
    capacity: '',
    images: [] as string[],
    hotelId: ''
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHotels = localStorage.getItem('hotels');
    const savedEvents = localStorage.getItem('events');
    if (savedHotels) setHotels(JSON.parse(savedHotels));
    if (savedEvents) setEvents(JSON.parse(savedEvents));
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('hotels', JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  // Hotel Handlers
  const handleHotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!hotelForm.name || !hotelForm.location || !hotelForm.price) {
        throw new Error('Please fill in all required fields');
      }

      const hotelData: Hotel = {
        id: editingHotel ? editingHotel.id : Date.now().toString(),
        name: hotelForm.name,
        description: hotelForm.description,
        location: hotelForm.location,
        price: parseFloat(hotelForm.price),
        rating: parseFloat(hotelForm.rating) || 0,
        rooms: parseInt(hotelForm.rooms) || 0,
        guests: parseInt(hotelForm.guests) || 0,
        images: hotelForm.images,
        amenities: hotelForm.amenities,
        createdAt: editingHotel ? editingHotel.createdAt : new Date().toISOString()
      };

      if (editingHotel) {
        setHotels(prev => prev.map(h => h.id === editingHotel.id ? hotelData : h));
      } else {
        setHotels(prev => [...prev, hotelData]);
      }

      resetHotelForm();
      setShowHotelModal(false);
      setEditingHotel(null);
      alert(editingHotel ? 'Hotel updated successfully!' : 'Hotel created successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save hotel');
    } finally {
      setIsLoading(false);
    }
  };

  const resetHotelForm = () => {
    setHotelForm({
      name: '',
      description: '',
      location: '',
      price: '',
      rating: '',
      rooms: '',
      guests: '',
      images: [],
      amenities: []
    });
  };

  const handleDeleteHotel = (id: string) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      setHotels(prev => prev.filter(h => h.id !== id));
      // Also delete associated events
      setEvents(prev => prev.filter(e => e.hotelId !== id));
    }
  };

  const handleEditHotel = (hotel: Hotel) => {
    setEditingHotel(hotel);
    setHotelForm({
      name: hotel.name,
      description: hotel.description,
      location: hotel.location,
      price: hotel.price.toString(),
      rating: hotel.rating.toString(),
      rooms: hotel.rooms.toString(),
      guests: hotel.guests.toString(),
      images: hotel.images,
      amenities: hotel.amenities
    });
    setShowHotelModal(true);
  };

  // Event Handlers
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!eventForm.title || !eventForm.date || !eventForm.location) {
        throw new Error('Please fill in all required fields (Title, Date, Location)');
      }

      const eventData: Event = {
        id: editingEvent ? editingEvent.id : Date.now().toString(),
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        price: parseFloat(eventForm.price) || 0,
        capacity: parseInt(eventForm.capacity) || 0,
        images: eventForm.images,
        hotelId: eventForm.hotelId || undefined,
        createdAt: editingEvent ? editingEvent.createdAt : new Date().toISOString()
      };

      if (editingEvent) {
        setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? eventData : ev));
      } else {
        setEvents(prev => [...prev, eventData]);
      }

      resetEventForm();
      setShowEventModal(false);
      setEditingEvent(null);
      alert(editingEvent ? 'Event updated successfully!' : 'Event created successfully!');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save event');
    } finally {
      setIsLoading(false);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      price: '',
      capacity: '',
      images: [],
      hotelId: ''
    });
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      price: event.price.toString(),
      capacity: event.capacity.toString(),
      images: event.images,
      hotelId: event.hotelId || ''
    });
    setShowEventModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'hotels' 
                  ? 'bg-emerald-500 text-gray-900' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Hotels ({hotels.length})
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'events' 
                  ? 'bg-emerald-500 text-gray-900' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              Events ({events.length})
            </button>
          </div>
        </div>

        {/* Hotels Tab */}
        {activeTab === 'hotels' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Hotels Management</h2>
              <button
                onClick={() => {
                  setEditingHotel(null);
                  resetHotelForm();
                  setShowHotelModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-gray-900 rounded-lg font-medium hover:bg-emerald-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Hotel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <div key={hotel.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  <div className="aspect-video bg-gray-800 relative">
                    {hotel.images[0] ? (
                      <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEditHotel(hotel)}
                        className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteHotel(hotel.id)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{hotel.name}</h3>
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {hotel.location}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {hotel.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        {hotel.rooms} rooms
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {hotel.guests} guests
                      </span>
                    </div>
                    <p className="mt-2 text-emerald-400 font-semibold">${hotel.price}/night</p>
                  </div>
                </div>
              ))}
            </div>

            {hotels.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No hotels added yet. Click "Add Hotel" to create one.</p>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Events Management</h2>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  resetEventForm();
                  setShowEventModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-gray-900 rounded-lg font-medium hover:bg-emerald-400 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                  <div className="aspect-video bg-gray-800 relative">
                    {event.images[0] ? (
                      <img src={event.images[0]} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600">
                        <Calendar className="w-12 h-12" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 bg-blue-500/80 hover:bg-blue-500 rounded-full text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {event.date} {event.time && `at ${event.time}`}
                    </p>
                    <p className="text-gray-400 text-sm mb-2 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-emerald-400 font-semibold">
                        {event.price > 0 ? `$${event.price}` : 'Free'}
                      </span>
                      <span className="text-gray-400 text-sm flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        Capacity: {event.capacity}
                      </span>
                    </div>
                    {event.hotelId && (
                      <p className="mt-2 text-xs text-gray-500">
                        Associated with: {hotels.find(h => h.id === event.hotelId)?.name || 'Unknown Hotel'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No events added yet. Click "Add Event" to create one.</p>
              </div>
            )}
          </div>
        )}

        {/* Hotel Modal */}
        {showHotelModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900">
                <h2 className="text-xl font-semibold">
                  {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
                </h2>
                <button
                  onClick={() => {
                    setShowHotelModal(false);
                    setEditingHotel(null);
                    resetHotelForm();
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleHotelSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Hotel Name *</label>
                  <input
                    type="text"
                    value={hotelForm.name}
                    onChange={(e) => setHotelForm({...hotelForm, name: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    placeholder="Enter hotel name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={hotelForm.description}
                    onChange={(e) => setHotelForm({...hotelForm, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none h-24"
                    placeholder="Enter hotel description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Location *</label>
                    <input
                      type="text"
                      value={hotelForm.location}
                      onChange={(e) => setHotelForm({...hotelForm, location: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      placeholder="City, Country"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price per Night ($) *</label>
                    <input
                      type="number"
                      value={hotelForm.price}
                      onChange={(e) => setHotelForm({...hotelForm, price: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <input
                      type="number"
                      value={hotelForm.rating}
                      onChange={(e) => setHotelForm({...hotelForm, rating: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      placeholder="0-5"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rooms</label>
                    <input
                      type="number"
                      value={hotelForm.rooms}
                      onChange={(e) => setHotelForm({...hotelForm, rooms: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      placeholder="Number of rooms"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Guests</label>
                    <input
                      type="number"
                      value={hotelForm.guests}
                      onChange={(e) => setHotelForm({...hotelForm, guests: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      placeholder="Max guests"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <ImageUpload 
                    images={hotelForm.images} 
                    onImagesChange={(images) => setHotelForm({...hotelForm, images})} 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Amenities (comma separated)</label>
                  <input
                    type="text"
                    value={hotelForm.amenities.join(', ')}
                    onChange={(e) => setHotelForm({
                      ...hotelForm, 
                      amenities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    placeholder="WiFi, Pool, Spa, Restaurant..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowHotelModal(false);
                      setEditingHotel(null);
                      resetHotelForm();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : (editingHotel ? 'Update Hotel' : 'Create Hotel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900">
                <h2 className="text-xl font-semibold">
                  {editingEvent ? 'Edit Event' : 'Add New Event'}
                </h2>
                <button
                  onClick={() => {
                    setShowEventModal(false);
                    setEditingEvent(null);
                    resetEventForm();
                  }}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleEventSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event Title *</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    placeholder="Enter event title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={eventForm.description}
                    onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none h-24"
                    placeholder="Enter event description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Date *</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time</label>
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Location *</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                    placeholder="Event location"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={eventForm.price}
                      onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      placeholder="0 for free"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Capacity</label>
                    <input
                      type="number"
                      value={eventForm.capacity}
                      onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                      placeholder="Max attendees"
                      min="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Associated Hotel (Optional)</label>
                  <select
                    value={eventForm.hotelId}
                    onChange={(e) => setEventForm({...eventForm, hotelId: e.target.value})}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:border-emerald-500 outline-none"
                  >
                    <option value="">Select a hotel (optional)</option>
                    {hotels.map(hotel => (
                      <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Images</label>
                  <ImageUpload 
                    images={eventForm.images} 
                    onImagesChange={(images) => setEventForm({...eventForm, images})} 
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEventModal(false);
                      setEditingEvent(null);
                      resetEventForm();
                    }}
                    className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-gray-900 font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
