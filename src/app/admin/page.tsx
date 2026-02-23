// Add this component inside your admin page for image upload

'use client';

import { useState, useRef } from 'react';
import { X, Upload, ChevronLeft, ChevronRight } from 'lucide-react';

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

    // Convert files to base64
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
      {/* Image Slideshow */}
      {images.length > 0 && (
        <div className="relative bg-nomad-dark rounded-xl overflow-hidden aspect-video">
          <img 
            src={images[currentSlide]} 
            alt={`Hotel image ${currentSlide + 1}`}
            className="w-full h-full object-cover"
          />
          
          {/* Navigation Arrows */}
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

          {/* Remove Button */}
          <button
            onClick={() => removeImage(currentSlide)}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-full text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Slide Counter */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-sm text-white">
            {currentSlide + 1} / {images.length}
          </div>
        </div>
      )}

      {/* Upload Options */}
      <div className="grid grid-cols-2 gap-4">
        {/* File Upload */}
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
            className="w-full p-4 border-2 border-dashed border-nomad-border hover:border-crypto-green rounded-xl transition-colors flex flex-col items-center gap-2"
          >
            <Upload className="w-6 h-6 text-nomad-gray" />
            <span className="text-sm text-nomad-gray">Upload from Computer</span>
            <span className="text-xs text-nomad-gray/50">Multiple images allowed</span>
          </button>
        </div>

        {/* URL Input */}
        <div className="p-4 border border-nomad-border rounded-xl">
          <label className="block text-sm text-nomad-gray mb-2">Add Image URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
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

      {/* Thumbnail Strip */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === currentSlide ? 'border-crypto-green' : 'border-transparent'
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

// Use this in your hotel form:
// <ImageUpload images={formData.images} onImagesChange={(images) => setFormData({...formData, images})} />
