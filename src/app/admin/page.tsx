'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/stores/appStore';
import { Shield, Users, Hotel, Settings, Plus, Edit, Trash2, Loader2, X, ExternalLink } from 'lucide-react';

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
  link?: string; // NEW
  isActive: boolean;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isAdmin } = useAppStore();

  const [activeTab, setActiveTab] = useState<'quests' | 'hotels' | 'events' | 'settings'>('quests');
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'hotel' | 'quest'>('quest');
  const [editingItem, setEditingItem] = useState<Hotel | Quest | null>(null);

  // Form states - ADDED link field
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    originalPrice: '',
    discountedPrice: '',
    xpReward: '500',
    amenities: '',
    images: '',
    title: '',
    questDescription: '',
    questType: 'essential',
    questXp: '100',
    questCost: '0',
    questLink: '' // NEW
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
  }, [user, isAdmin, router, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [hotelsRes, questsRes] = await Promise.all([
        fetch('/api/admin/hotels'),
        fetch('/api/admin/quests')
      ]);

      if (hotelsRes.ok) {
        const hotelsData = await hotelsRes.json();
        setHotels(hotelsData);
      }
      if (questsRes.ok) {
        const questsData = await questsRes.json();
        setQuests(questsData);
      }
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
      if (modalType === 'hotel') {
        const payload = {
          id: editingItem?.id,
          name: formData.name,
          location: formData.location,
          description: formData.description,
          originalPrice: Number(formData.originalPrice),
          discountedPrice: Number(formData.discountedPrice),
          xpReward: Number(formData.xpReward),
          amenities: formData.amenities.split(',').map(a => a.trim()).filter(Boolean),
          images: formData.images.split(',').map(i => i.trim()).filter(Boolean),
          discount: Math.round(((Number(formData.originalPrice) - Number(formData.discountedPrice)) / Number(formData.originalPrice)) * 100)
        };

        const res = await fetch('/api/admin/hotels', {
          method: editingItem ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          setShowModal(false);
          resetForm();
          fetchData();
        } else {
          const error = await res.json();
          alert(error.error || 'Failed to save hotel');
        }
      } else {
        // QUEST PAYLOAD WITH LINK
        const payload = {
          id: editingItem?.id,
          title: formData.title,
          description: formData.questDescription,
          type: formData.questType,
          xpReward: Number(formData.questXp),
          cost: Number(formData.questCost),
          link: formData.questLink // NEW
        };

        console.log('Sending quest payload:', payload); // Debug

        const res = await fetch('/api/admin/quests', {
          method: editingItem ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const responseData = await res.json();
        console.log('Quest API response:', responseData); // Debug

        if (res.ok) {
          setShowModal(false);
          resetForm();
          fetchData();
        } else {
          alert(responseData.error || responseData.details || 'Failed to save quest');
        }
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Failed to save. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    setLoading(true);
    try {
      const endpoint = activeTab === 'hotels' ? '/api/admin/hotels' : '/api/admin/quests';
      const res = await fetch(`${endpoint}?id=${id}`, { method: 'DELETE' });

      if (res.ok) {
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to delete');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      alert('Failed to delete. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      location: '',
      description: '',
      originalPrice: '',
      discountedPrice: '',
      xpReward: '500',
      amenities: '',
      images: '',
      title: '',
      questDescription: '',
      questType: 'essential',
      questXp: '100',
      questCost: '0',
      questLink: '' // NEW
    });
    setEditingItem(null);
  };

  const openAddModal = (type: 'hotel' | 'quest') => {
    resetForm();
    setModalType(type);
    setShowModal(true);
  };

  const openEditModal = (item: Hotel | Quest, type: 'hotel' | 'quest') => {
    setEditingItem(item);
    setModalType(type);

    if (type === 'hotel') {
      const hotel = item as Hotel;
      setFormData({
        ...formData,
        name: hotel.name,
        location: hotel.location,
        description: hotel.description,
        originalPrice: hotel.originalPrice.toString(),
        discountedPrice: hotel.discountedPrice.toString(),
        xpReward: hotel.xpReward.toString(),
        amenities: hotel.amenities?.join(', ') || '',
        images: hotel.images?.join(', ') || ''
      });
    } else {
      const quest = item as Quest;
      setFormData({
        ...formData,
        title: quest.title,
        questDescription: quest.description,
        questType: quest.type,
        questXp: quest.xpReward.toString(),
        questCost: quest.cost.toString(),
        questLink: quest.link || '' // NEW
      });
    }
    setShowModal(true);
  };

  if (!user?.wallet || !isAdmin) {
    return (
      <div className="min-h-screen bg-nomad-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-crypto-green mx-auto mb-4" />
          <p className="text-nomad-gray">Checking permissions...</p>
        </div>
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
            <p className="text-3xl font-bold text-purple-500">0</p>
          </div>
          <div className="p-4 bg-nomad-card rounded-xl border border-nomad-border">
            <p className="text-nomad-gray text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-red-500">0</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('quests')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'quests' 
                ? 'bg-crypto-green text-nomad-dark' 
                : 'bg-nomad-card border border-nomad-border text-nomad-gray hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            Quests
          </button>
          <button 
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'events' 
                ? 'bg-crypto-green text-nomad-dark' 
                : 'bg-nomad-card border border-nomad-border text-nomad-gray hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Events
          </button>
          <button 
            onClick={() => setActiveTab('hotels')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hotels' 
                ? 'bg-crypto-green text-nomad-dark' 
                : 'bg-nomad-card border border-nomad-border text-nomad-gray hover:text-white'
            }`}
          >
            <Hotel className="w-4 h-4" />
            Hotels
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'settings' 
                ? 'bg-crypto-green text-nomad-dark' 
                : 'bg-nomad-card border border-nomad-border text-nomad-gray hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        {/* Content */}
        <div className="bg-nomad-card rounded-xl border border-nomad-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Manage {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            {(activeTab === 'hotels' || activeTab === 'quests') && (
              <button 
                onClick={() => openAddModal(activeTab === 'hotels' ? 'hotel' : 'quest')}
                className="px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium flex items-center gap-2 hover:bg-crypto-green/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add {activeTab === 'hotels' ? 'Hotel' : 'Quest'}
              </button>
            )}
          </div>

          {loading && <div className="text-center py-8 text-nomad-gray">Loading...</div>}

          {/* Hotels List */}
          {!loading && activeTab === 'hotels' && (
            <div className="space-y-3">
              {hotels.length === 0 ? (
                <div className="text-center py-8 text-nomad-gray">No hotels found. Add your first hotel!</div>
              ) : (
                hotels.map((hotel) => (
                  <div key={hotel.id} className="flex items-center justify-between p-4 bg-nomad-dark rounded-lg border border-nomad-border">
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className="font-medium text-white">{hotel.name}</h3>
                        <p className="text-sm text-nomad-gray">{hotel.location}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-crypto-green">${hotel.discountedPrice}</span>
                          <span className="text-nomad-gray line-through">${hotel.originalPrice}</span>
                          <span className="text-blue-400">{hotel.xpReward} XP</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${hotel.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {hotel.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditModal(hotel, 'hotel')}
                        className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(hotel.id)}
                        className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Quests List with LINK display */}
          {!loading && activeTab === 'quests' && (
            <div className="space-y-3">
              {quests.length === 0 ? (
                <div className="text-center py-8 text-nomad-gray">No quests found. Add your first quest!</div>
              ) : (
                quests.map((quest) => (
                  <div key={quest.id} className="flex items-center justify-between p-4 bg-nomad-dark rounded-lg border border-nomad-border">
                    <div className="flex items-center gap-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        quest.type === 'essential' ? 'bg-crypto-green/20 text-crypto-green' :
                        quest.type === 'daily' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-purple-500/20 text-purple-400'
                      }`}>
                        {quest.type}
                      </span>
                      <div>
                        <h3 className="font-medium text-white">{quest.title}</h3>
                        <p className="text-sm text-nomad-gray">{quest.description}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-crypto-green">{quest.xpReward} XP</span>
                          {quest.cost > 0 && <span className="text-blue-400">${quest.cost} USDC</span>}
                          {/* SHOW LINK IF EXISTS */}
                          {quest.link && (
                            <a 
                              href={quest.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-400 flex items-center gap-1 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Link
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => openEditModal(quest, 'quest')}
                        className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-white transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(quest.id)}
                        className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Events Placeholder */}
          {activeTab === 'events' && (
            <div className="text-center py-12 text-nomad-gray">
              Events management coming soon...
            </div>
          )}

          {/* Settings Placeholder */}
          {activeTab === 'settings' && (
            <div className="text-center py-12 text-nomad-gray">
              Platform settings coming soon...
            </div>
          )}
        </div>
      </div>

      {/* Modal with LINK field */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-nomad-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-nomad-border">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingItem ? 'Edit' : 'Add'} {modalType === 'hotel' ? 'Hotel' : 'Quest'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/5 rounded-lg text-nomad-gray"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'hotel' ? (
                <>
                  {/* Hotel fields same as before */}
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Hotel Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      rows={3}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-nomad-gray mb-1">Original Price ($)</label>
                      <input
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                        className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nomad-gray mb-1">Discounted Price ($)</label>
                      <input
                        type="number"
                        value={formData.discountedPrice}
                        onChange={(e) => setFormData({...formData, discountedPrice: e.target.value})}
                        className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">XP Reward</label>
                    <input
                      type="number"
                      value={formData.xpReward}
                      onChange={(e) => setFormData({...formData, xpReward: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Amenities (comma separated)</label>
                    <input
                      type="text"
                      value={formData.amenities}
                      onChange={(e) => setFormData({...formData, amenities: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      placeholder="wifi, pool, gym, spa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Images (comma separated URLs)</label>
                    <input
                      type="text"
                      value={formData.images}
                      onChange={(e) => setFormData({...formData, images: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Quest fields with LINK */}
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Quest Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Description *</label>
                    <textarea
                      value={formData.questDescription}
                      onChange={(e) => setFormData({...formData, questDescription: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      rows={3}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1">Quest Type</label>
                    <select
                      value={formData.questType}
                      onChange={(e) => setFormData({...formData, questType: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                    >
                      <option value="essential">Essential</option>
                      <option value="daily">Daily</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-nomad-gray mb-1">XP Reward</label>
                      <input
                        type="number"
                        value={formData.questXp}
                        onChange={(e) => setFormData({...formData, questXp: e.target.value})}
                        className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-nomad-gray mb-1">Cost (USDC)</label>
                      <input
                        type="number"
                        value={formData.questCost}
                        onChange={(e) => setFormData({...formData, questCost: e.target.value})}
                        className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      />
                    </div>
                  </div>
                  {/* NEW: LINK FIELD */}
                  <div>
                    <label className="block text-sm font-medium text-nomad-gray mb-1 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Quest Link (Optional)
                    </label>
                    <input
                      type="url"
                      value={formData.questLink}
                      onChange={(e) => setFormData({...formData, questLink: e.target.value})}
                      className="w-full px-3 py-2 bg-nomad-dark border border-nomad-border rounded-lg text-white focus:outline-none focus:border-crypto-green"
                      placeholder="https://example.com/quest"
                    />
                    <p className="text-xs text-nomad-gray mt-1">External link for users to complete the quest</p>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-nomad-dark border border-nomad-border text-white rounded-lg hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-crypto-green text-nomad-dark rounded-lg font-medium hover:bg-crypto-green/90 transition-colors disabled:opacity-50"
                >
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
