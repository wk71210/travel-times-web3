'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import { 
  Shield, Users, Hotel, Settings, Plus, Edit, Trash2, Loader2, X, 
  ExternalLink, Upload, ChevronLeft, ChevronRight, Calendar, MapPin 
} from 'lucide-react';

interface Hotel {
  _id: string;
  id: string;
  name: string;
  location: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  xpReward: number;
  amenities: string[];
  images: string[];
  isActive: boolean;
}

interface Quest {
  _id: string;
  id: string;
  title: string;
  description: string;
  type: 'essential' | 'daily' | 'special';
  xpReward: number;
  cost: number;
  link?: string;
  isActive: boolean;
}

interface Event {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  price: number;
  originalPrice?: number;
  capacity: number;
  booked: number;
  xpReward: number;
  images: string[];
  isActive: boolean;
}

// Image Upload Component with Slideshow
function ImageUpload({ 
  images, 
  onImagesChange 
}: { 
  images: string[]; 
  onImagesChange: (images: string[]) => void 
}) {
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

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="space-y-4">
      {/* Slideshow */}
      {images.length > 0 && (
        <div className="relative bg-nomad-dark rounded-xl overflow-hidden aspect-video">
          <img 
            src={images[currentSlide]} 
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          
          {images.length > 1 && (
            <>
              <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <button onClick={() => removeImage(currentSlide)} className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white">
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-sm text-white">
            {currentSlide + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Upload Options */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" multiple className="hidden" />
          <button onClick={() => fileInputRef.current?.click()} className="w-full p-4 border-2 border-dashed border-nomad-border hover:border-crypto-green rounded-xl transition-colors flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-nomad-gray" />
            <span className="text-sm text-nomad-gray">Upload Images</span>
            <span className="text-xs text-nomad-gray/50">Multiple allowed</span>
          </button>
        </div>

        <div className="p-4 border border-nomad-border rounded-xl">
          <label className="block text-sm text-nomad-gray mb-2">Add Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://..."
              className="flex-1 px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-sm outline-none focus:border-crypto-green"
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
              className="px-3 py-2 bg-crypto-green text-nomad-dark rounded-lg text-sm font-medium"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${idx === currentSlide ? 'border-crypto-green' : 'border-transparent'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAppStore();

  const [activeTab, setActiveTab] = useState<'quests' | 'hotels' | 'events' | 'settings'>('hotels');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'hotel' | 'quest' | 'event'>('hotel');
  const [editingItem, setEditingItem] = useState<Hotel | Quest | Event | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    // Hotel
    name: '',
    location: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    xpReward: '500',
    amenities: '',
    hotelImages: [] as string[],
    
    // Quest
    title: '',
    questDescription: '',
    questType: 'essential',
    questXp: '100',
    questCost: '0',
    questLink: '',
    
    // Event
    eventTitle: '',
    eventDescription: '',
    eventLocation: '',
    eventDate: '',
    eventPrice: '',
    eventOriginalPrice: '',
    eventCapacity: '100',
    eventXp: '200',
    eventImages: [] as string[]
  });

  useEffect(() => {
    if (!user?.wallet) {
      router.push('/');
      return;
    }
    if (!isAdmin) {
      router.push('/profile');
      return;
    }
    fetchData();
  }, [user, isAdmin, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsRes, questsRes, eventsRes] = await Promise.all([
        fetch('/api/hotels'),
        fetch('/api/quests'),
        fetch('/api/events')
      ]);

      if (hotelsRes.ok) setHotels(await hotelsRes.json());
      if (questsRes.ok) setQuests(await questsRes.json());
      if (eventsRes.ok) setEvents(await eventsRes.json());
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let payload: any = {};
      let endpoint = '';
      let method = editingItem ? 'PUT' : 'POST';

      if (modalType === 'hotel') {
        endpoint = '/api/hotels';
        payload = {
          id: editingItem?.id,
          name: formData.name,
          location: formData.location,
          description: formData.description,
          originalPrice: Number(formData.originalPrice),
          discountedPrice: Number(formData.discountedPrice),
          xpReward: Number(formData.xpReward),
          amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
          images: formData.hotelImages,
          discount: Math.round(((Number(formData.originalPrice) - Number(formData.discountedPrice)) / Number(formData.originalPrice)) * 100)
        };
      } else if (modalType === 'quest') {
        endpoint = '/api/quests';
        payload = {
          id: editingItem?.id,
          title: formData.title,
          description: formData.questDescription,
          type: formData.questType,
          xpReward: Number(formData.questXp),
          cost: Number(formData.questCost),
          link: formData.questLink
        };
      } else if (modalType === 'event') {
        endpoint = '/api/events';
        payload = {
          id: editingItem?.id,
          title: formData.eventTitle,
          description: formData.eventDescription,
          location: formData.eventLocation,
          date: formData.eventDate,
          price: Number(formData.eventPrice),
          originalPrice: formData.eventOriginalPrice ? Number(formData.eventOriginalPrice) : undefined,
          capacity: Number(formData.eventCapacity),
          xpReward: Number(formData.eventXp),
          images: formData.eventImages,
          booked: 0
        };
      }

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        resetForm();
        fetchData();
        alert(editingItem ? 'Updated successfully!' : 'Created successfully!');
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        alert(errorData.error || `Failed to ${editingItem ? 'update' : 'create'}`);
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;

    setLoading(true);
    try {
      const endpoint = activeTab === 'hotels' ? '/api/hotels' : 
                      activeTab === 'quests' ? '/api/quests' : '/api/events';
      const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        alert('Deleted successfully!');
      } else {
        alert('Failed to delete');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', location: '', description: '', originalPrice: '', discountedPrice: '',
      xpReward: '500', amenities: '', hotelImages: [],
      title: '', questDescription: '', questType: 'essential', questXp: '100',
      questCost: '0', questLink: '',
      eventTitle: '', eventDescription: '', eventLocation: '', eventDate: '',
      eventPrice: '', eventOriginalPrice: '', eventCapacity: '100', eventXp: '200', eventImages: []
    });
    setEditingItem(null);
  };

  const openAddModal = (type: 'hotel' | 'quest' | 'event') => {
    resetForm();
    setModalType(type);
    setShowModal(true);
  };

  const openEditModal = (item: Hotel | Quest | Event, type: 'hotel' | 'quest' | 'event') => {
    setEditingItem(item);
    setModalType(type);

    if (type === 'hotel') {
      const h = item as Hotel;
      setFormData(prev => ({
        ...prev,
        name: h.name, location: h.location, description: h.description,
        originalPrice: h.originalPrice.toString(), discountedPrice: h.discountedPrice.toString(),
        xpReward: h.xpReward.toString(), amenities: h.amenities?.join(', ') || '',
        hotelImages: h.images || []
      }));
    } else if (type === 'quest') {
      const q = item as Quest;
      setFormData(prev => ({
        ...prev,
        title: q.title, questDescription: q.description, questType: q.type,
        questXp: q.xpReward.toString(), questCost: q.cost.toString(), questLink: q.link || ''
      }));
    } else {
      const e = item as Event;
      setFormData(prev => ({
        ...prev,
        eventTitle: e.title, eventDescription: e.description, eventLocation: e.location,
        eventDate: e.date.split('T')[0], eventPrice: e.price.toString(),
        eventOriginalPrice: e.originalPrice?.toString() || '',
        eventCapacity: e.capacity.toString(), eventXp: e.xpReward.toString(), 
        eventImages: e.images || []
      }));
    }
    setShowModal(true);
  };

  if (!user?.wallet || !isAdmin) {
    return (
      <div className="min-h-screen bg-nomad-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-crypto-green" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-nomad-dark p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-crypto-green" />
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <div className="px-4 py-2 bg-crypto-green/10 text-crypto-green rounded-lg text-sm font-mono">
            {user.wallet.slice(0, 6)}...{user.wallet.slice(-4)}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Total Hotels</p>
            <p className="text-3xl font-bold text-crypto-green">{hotels.length}</p>
          </div>
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Total Quests</p>
            <p className="text-3xl font-bold text-blue-500">{quests.length}</p>
          </div>
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Active Events</p>
            <p className="text-3xl font-bold text-purple-500">{events.length}</p>
          </div>
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-red-500">--</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['hotels', 'quests', 'events', 'settings'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 rounded-lg font-medium capitalize flex items-center gap-2 ${
                activeTab === tab ? 'bg-crypto-green text-nomad-dark' : 'bg-nomad-card border border-nomad-border text-nomad-gray hover:text-white'
              }`}
            >
              {tab === 'hotels' && <Hotel className="w-4 h-4" />}
              {tab === 'quests' && <Shield className="w-4 h-4" />}
              {tab === 'events' && <Calendar className="w-4 h-4" />}
              {tab === 'settings' && <Settings className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-nomad-card rounded-xl border border-nomad-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white capitalize">Manage {activeTab}</h2>
            {activeTab !== 'settings' && (
              <button 
                onClick={() => openAddModal(activeTab as any)}
                className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium flex items-center gap-2 hover:bg-crypto-green/90"
              >
                <Plus className="w-4 h-4" />
                Add {activeTab.slice(0, -1)}
              </button>
            )}
          </div>

          {loading && <div className="text-center py-8 text-nomad-gray">Loading...</div>}

          {/* Hotels */}
          {!loading && activeTab === 'hotels' && (
            <div className="space-y-3">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="flex items-center justify-between p-4 bg-nomad-dark rounded-lg border border-nomad-border">
                  <div className="flex items-center gap-4">
                    {hotel.images?.[0] ? (
                      <img src={hotel.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-nomad-border flex items-center justify-center">
                        <Hotel className="w-6 h-6 text-nomad-gray" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-white">{hotel.name}</h3>
                      <p className="text-sm text-nomad-gray">{hotel.location}</p>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-crypto-green">${hotel.discountedPrice}</span>
                        <span className="text-nomad-gray line-through">${hotel.originalPrice}</span>
                        <span className="text-blue-400">{hotel.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(hotel, 'hotel')} className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(hotel.id)} className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {hotels.length === 0 && !loading && (
                <div className="text-center py-8 text-nomad-gray">No hotels found. Click Add Hotel to create one.</div>
              )}
            </div>
          )}

          {/* Quests */}
          {!loading && activeTab === 'quests' && (
            <div className="space-y-3">
              {quests.map((quest) => (
                <div key={quest.id} className="flex items-center justify-between p-4 bg-nomad-dark rounded-lg border border-nomad-border">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        quest.type === 'essential' ? 'bg-crypto-green/20 text-crypto-green' :
                        quest.type === 'daily' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>{quest.type}</span>
                      <h3 className="font-medium text-white">{quest.title}</h3>
                    </div>
                    <p className="text-sm text-nomad-gray">{quest.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className="text-crypto-green">{quest.xpReward} XP</span>
                      {quest.link && (
                        <a href={quest.link} target="_blank" rel="noopener noreferrer" className="text-purple-400 flex items-center gap-1 hover:underline">
                          <ExternalLink className="w-3 h-3" /> Link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(quest, 'quest')} className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(quest.id)} className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {quests.length === 0 && !loading && (
                <div className="text-center py-8 text-nomad-gray">No quests found.</div>
              )}
            </div>
          )}

          {/* Events */}
          {!loading && activeTab === 'events' && (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-nomad-dark rounded-lg border border-nomad-border">
                  <div className="flex items-center gap-4">
                    {event.images?.[0] ? (
                      <img src={event.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-nomad-border flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-nomad-gray" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium text-white">{event.title}</h3>
                      <p className="text-sm text-nomad-gray flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {event.location}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-sm">
                        <span className="text-crypto-green">${event.price}</span>
                        <span className="text-nomad-gray">{new Date(event.date).toLocaleDateString()}</span>
                        <span className="text-blue-400">{event.booked}/{event.capacity} booked</span>
                        <span className="text-purple-400">{event.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditModal(event, 'event')} className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-white">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(event.id)} className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {events.length === 0 && !loading && (
                <div className="text-center py-8 text-nomad-gray">No events found. Click Add Event to create one.</div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12 text-nomad-gray">Platform settings coming soon...</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-nomad-card rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-nomad-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit' : 'Add'} {modalType === 'hotel' ? 'Hotel' : modalType === 'quest' ? 'Quest' : 'Event'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* HOTEL FORM */}
              {modalType === 'hotel' && (
                <>
                  <ImageUpload 
                    images={formData.hotelImages} 
                    onImagesChange={(imgs) => setFormData({...formData, hotelImages: imgs})} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Hotel Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required />
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Location *</label>
                      <input type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-nomad-gray mb-1">Description *</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" rows={3} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Original Price ($) *</label>
                      <input type="number" value={formData.originalPrice} onChange={(e) => setFormData({...formData, originalPrice: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required min="0" />
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Discounted Price ($) *</label>
                      <input type="number" value={formData.discountedPrice} onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required min="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">XP Reward</label>
                      <input type="number" value={formData.xpReward} onChange={(e) => setFormData({...formData, xpReward: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Amenities (comma separated)</label>
                      <input type="text" value={formData.amenities} onChange={(e) => setFormData({...formData, amenities: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" placeholder="wifi, pool, gym" />
                    </div>
                  </div>
                </>
              )}

              {/* QUEST FORM */}
              {modalType === 'quest' && (
                <>
                  <div>
                    <label className="block text-sm text-nomad-gray mb-1">Quest Title *</label>
                    <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required />
                  </div>
                  <div>
                    <label className="block text-sm text-nomad-gray mb-1">Description *</label>
                    <textarea value={formData.questDescription} onChange={(e) => setFormData({...formData, questDescription: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" rows={3} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Type</label>
                      <select value={formData.questType} onChange={(e) => setFormData({...formData, questType: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green">
                        <option value="essential">Essential</option>
                        <option value="daily">Daily</option>
                        <option value="special">Special</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">XP Reward</label>
                      <input type="number" value={formData.questXp} onChange={(e) => setFormData({...formData, questXp: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" min="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Cost</label>
                      <input type="number" value={formData.questCost} onChange={(e) => setFormData({...formData, questCost: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Quest Link
                      </label>
                      <input type="url" value={formData.questLink} onChange={(e) => setFormData({...formData, questLink: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" placeholder="https://example.com/quest" />
                    </div>
                  </div>
                </>
              )}

              {/* EVENT FORM */}
              {modalType === 'event' && (
                <>
                  <ImageUpload 
                    images={formData.eventImages} 
                    onImagesChange={(imgs) => setFormData({...formData, eventImages: imgs})} 
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Event Title *</label>
                      <input type="text" value={formData.eventTitle} onChange={(e) => setFormData({...formData, eventTitle: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required />
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Location *</label>
                      <input type="text" value={formData.eventLocation} onChange={(e) => setFormData({...formData, eventLocation: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-nomad-gray mb-1">Description *</label>
                    <textarea value={formData.eventDescription} onChange={(e) => setFormData({...formData, eventDescription: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" rows={3} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Date *</label>
                      <input type="date" value={formData.eventDate} onChange={(e) => setFormData({...formData, eventDate: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required />
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Price ($) *</label>
                      <input type="number" value={formData.eventPrice} onChange={(e) => setFormData({...formData, eventPrice: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required min="0" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Original Price ($)</label>
                      <input type="number" value={formData.eventOriginalPrice} onChange={(e) => setFormData({...formData, eventOriginalPrice: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" min="0" />
                    </div>
                    <div>
                      <label className="block text-sm text-nomad-gray mb-1">Capacity *</label>
                      <input type="number" value={formData.eventCapacity} onChange={(e) => setFormData({...formData, eventCapacity: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" required min="1" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-nomad-gray mb-1">XP Reward</label>
                    <input type="number" value={formData.eventXp} onChange={(e) => setFormData({...formData, eventXp: e.target.value})} className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:border-crypto-green" min="0" />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-nomad-dark border border-nomad-border text-white rounded-lg hover:bg-white/5">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 disabled:opacity-50">
                  {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
