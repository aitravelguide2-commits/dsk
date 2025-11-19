import React, { useState, useRef } from 'react';
import { Upload, X, Star, ChevronLeft, ChevronRight, Grid, Maximize2, Move, Loader } from 'lucide-react';

const ModernImageUploader = () => {
  const [images, setImages] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [quality, setQuality] = useState('medium');
  const [uploading, setUploading] = useState(false);
  const [loadingImages, setLoadingImages] = useState(new Set());
  const fileInputRef = useRef(null);

  // Komprimiert Bilder client-seitig VOR dem Upload
  const compressImage = async (file, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Max-Dimensionen basierend auf Qualität
          const maxSizes = {
            none: { width: 4000, height: 4000, quality: 0.95 },
            high: { width: 2000, height: 2000, quality: 0.90 },
            medium: { width: 1600, height: 1600, quality: 0.85 },
            low: { width: 1200, height: 1200, quality: 0.75 }
          };
          
          const settings = maxSizes[quality] || maxSizes.medium;
          
          // Berechne neue Dimensionen
          let width = img.width;
          let height = img.height;
          
          if (width > settings.width || height > settings.height) {
            const ratio = Math.min(settings.width / width, settings.height / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }
          
          canvas.width = width;
          canvas.height = height;
          
          // Zeichne Bild mit guter Qualität
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Konvertiere zu Blob
          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            },
            'image/jpeg',
            settings.quality
          );
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Validierung
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        alert(`${file.name}: Ungültiges Format (nur JPG, PNG, WebP)`);
        return false;
      }
      if (!isValidSize) {
        alert(`${file.name}: Datei zu groß (max. 10MB)`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    if (images.length + validFiles.length > 30) {
      alert('Maximum 30 Bilder erlaubt');
      return;
    }
    
    setUploading(true);
    
    try {
      // Komprimiere alle Bilder parallel
      const compressionPromises = validFiles.map(file => 
        compressImage(file, quality).catch(err => {
          console.error(`Fehler bei ${file.name}:`, err);
          return null;
        })
      );
      
      const compressedFiles = await Promise.all(compressionPromises);
      const validCompressed = compressedFiles.filter(f => f !== null);
      
      // Erstelle Preview-URLs
      const newImages = validCompressed.map((file, idx) => {
        const url = URL.createObjectURL(file);
        return {
          id: Date.now() + idx,
          url,
          title: file.name.replace(/\.[^/.]+$/, ''),
          isCover: images.length === 0 && idx === 0,
          order: images.length + idx,
          file,
          loaded: false
        };
      });
      
      setImages([...images, ...newImages]);
      
      // Zeige Kompressionsinfo
      const originalSize = validFiles.reduce((sum, f) => sum + f.size, 0);
      const compressedSize = validCompressed.reduce((sum, f) => sum + f.size, 0);
      const savings = Math.round((1 - compressedSize / originalSize) * 100);
      
      console.log(`✅ ${validCompressed.length} Bilder komprimiert`);
      console.log(`📦 Größe: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(compressedSize / 1024 / 1024).toFixed(2)}MB`);
      console.log(`💾 Ersparnis: ${savings}%`);
      
    } catch (error) {
      console.error('Upload-Fehler:', error);
      alert('Fehler beim Verarbeiten der Bilder');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleImageLoad = (id) => {
    setLoadingImages(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const handleImageLoadStart = (id) => {
    setLoadingImages(prev => new Set(prev).add(id));
  };

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const removeImage = (id) => {
    const img = images.find(i => i.id === id);
    if (img?.url) URL.revokeObjectURL(img.url);
    setImages(images.filter(img => img.id !== id));
  };

  const setCover = (index) => {
    const newImages = [...images];
    const [coverImage] = newImages.splice(index, 1);
    newImages.forEach(img => img.isCover = false);
    coverImage.isCover = true;
    setImages([coverImage, ...newImages]);
  };

  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    newImages.forEach((img, idx) => {
      img.order = idx;
      img.isCover = idx === 0;
    });
    setImages(newImages);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null || draggedIndex === index) return;
    moveImage(draggedIndex, index);
    setDraggedIndex(null);
  };

  const updateTitle = (id, newTitle) => {
    setImages(images.map(img => 
      img.id === id ? { ...img, title: newTitle } : img
    ));
  };

  React.useEffect(() => {
    if (!lightboxOpen) return;
    
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxOpen, currentIndex]);

  // Cleanup URLs on unmount
  React.useEffect(() => {
    return () => {
      images.forEach(img => {
        if (img.url) URL.revokeObjectURL(img.url);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Bilder verwalten</h1>
              <p className="text-sm text-gray-500">Max. 30 Bilder · JPG, PNG, WebP · bis 10MB</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
              >
                <option value="none">Keine Komprimierung</option>
                <option value="high">Hoch (2000px, schnell)</option>
                <option value="medium">Mittel (1600px, empfohlen)</option>
                <option value="low">Niedrig (1200px, klein)</option>
              </select>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || images.length >= 30}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium shadow-md flex items-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Verarbeite...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Bilder hinzufügen
                  </>
                )}
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M21 15l-5-5L5 21" strokeWidth="2"/>
              </svg>
              <span className="text-gray-600">{images.length} / 30 Bilder</span>
            </div>
            {images.length > 0 && (
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-gray-600">Titelbild: {images[0]?.title || 'Erstes Bild'}</span>
              </div>
            )}
          </div>
        </div>

        {images.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor"/>
                <path d="M21 15l-5-5L5 21" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Noch keine Bilder hochgeladen</h3>
            <p className="text-gray-500 mb-6">Füge Bilder hinzu, um deine Unterkunft zu präsentieren</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Erste Bilder hochladen
            </button>
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className={`group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
                  draggedIndex === index ? 'opacity-50 scale-95' : ''
                }`}
              >
                <div className="aspect-[4/3] overflow-hidden cursor-pointer relative bg-gray-100">
                  {loadingImages.has(img.id) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Loader className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                  )}
                  <img
                    src={img.url}
                    alt={img.title}
                    onClick={() => openLightbox(index)}
                    onLoadStart={() => handleImageLoadStart(img.id)}
                    onLoad={() => handleImageLoad(img.id)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-center gap-2">
                      <button
                        onClick={() => openLightbox(index)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        title="Vergrößern"
                      >
                        <Maximize2 className="w-4 h-4 text-gray-700" />
                      </button>
                      <button
                        onClick={() => setCover(index)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        title={index === 0 ? 'Ist Titelbild' : 'Als Titelbild setzen'}
                      >
                        <Star className={`w-4 h-4 ${index === 0 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} />
                      </button>
                      <button
                        onClick={() => removeImage(img.id)}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
                        title="Löschen"
                      >
                        <X className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>

                  {index === 0 && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-md shadow-md">
                      Titelbild
                    </div>
                  )}
                  
                  <div className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-md cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                    <Move className="w-4 h-4 text-gray-600" />
                  </div>
                </div>

                <div className="p-3 border-t border-gray-100">
                  <input
                    type="text"
                    value={img.title}
                    onChange={(e) => updateTitle(img.id, e.target.value)}
                    placeholder="Bildtitel eingeben..."
                    className="w-full px-2 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
                  />
                </div>

                <div className="absolute bottom-16 left-2 px-1.5 py-0.5 bg-black/60 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Grid className="w-4 h-4" />
              Tipps zur Bildverwaltung
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Bilder werden automatisch komprimiert (siehe Qualitätseinstellung)</li>
              <li>• Ziehe Bilder per Drag & Drop, um die Reihenfolge zu ändern</li>
              <li>• Das erste Bild wird als Titelbild verwendet</li>
              <li>• Klicke auf ein Bild für die Vollansicht mit Navigation</li>
            </ul>
          </div>
        )}

        {lightboxOpen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fadeIn"
            onClick={closeLightbox}
          >
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
              aria-label="Schließen"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="absolute top-4 left-4 px-4 py-2 bg-white/10 rounded-full text-white font-medium z-10 backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                  aria-label="Vorheriges Bild"
                >
                  <ChevronLeft className="w-8 h-8 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 p-4 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
                  aria-label="Nächstes Bild"
                >
                  <ChevronRight className="w-8 h-8 text-white" />
                </button>
              </>
            )}

            <div
              className="relative max-w-[90vw] max-h-[90vh] animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[currentIndex]?.url}
                alt={images[currentIndex]?.title}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
              
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
                <h3 className="text-white font-semibold text-lg">
                  {images[currentIndex]?.title}
                </h3>
                <p className="text-white/80 text-sm">
                  Bild {currentIndex + 1} von {images.length}
                </p>
              </div>
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto p-2 bg-white/10 rounded-full backdrop-blur-sm">
              {images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                    idx === currentIndex ? 'ring-2 ring-white scale-110' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-white/60 text-xs flex items-center gap-4">
              <span>← → Navigation</span>
              <span>ESC Schließen</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ModernImageUploader;