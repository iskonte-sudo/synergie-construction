import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, Play } from 'lucide-react';
import { mediaUrl } from '../lib/api';

/**
 * Fullscreen lightbox for images + videos.
 * items: [{ url, type: 'image'|'video', title, description, alt }]
 */
export default function Lightbox({ items, index, onClose, onIndex }) {
  const cur = items[index];
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);
  const touchRef = useRef({ x: 0, y: 0, distance: 0 });
  const total = items.length;

  const next = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); onIndex((index + 1) % total); }, [index, total, onIndex]);
  const prev = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); onIndex((index - 1 + total) % total); }, [index, total, onIndex]);

  useEffect(() => { setLoading(true); setZoom(1); setPan({ x: 0, y: 0 }); }, [index]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === '+' || e.key === '=') setZoom((z) => Math.min(z + 0.5, 4));
      else if (e.key === '-') setZoom((z) => Math.max(z - 0.5, 1));
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [next, prev, onClose]);

  // Touch handlers: swipe + pinch zoom
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, distance: 0 };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current.distance = Math.hypot(dx, dy);
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 2 && touchRef.current.distance) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy);
      const ratio = d / touchRef.current.distance;
      setZoom((z) => Math.max(1, Math.min(4, z * ratio)));
      touchRef.current.distance = d;
    }
  };
  const onTouchEnd = (e) => {
    if (e.changedTouches.length === 1 && zoom === 1) {
      const dx = e.changedTouches[0].clientX - touchRef.current.x;
      const dy = e.changedTouches[0].clientY - touchRef.current.y;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next(); else prev();
      }
    }
  };

  // Mouse drag for panning when zoomed
  const onMouseDown = (e) => { if (zoom > 1) setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y }); };
  const onMouseMove = (e) => { if (dragStart) setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y }); };
  const onMouseUp = () => setDragStart(null);

  if (!cur) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        data-testid="lightbox-overlay"
      >
        {/* Close */}
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center text-white bg-white/10 hover:bg-[#FFB800] hover:text-[#0A2540] transition-colors"
          data-testid="lightbox-close"
          aria-label="Fermer"
        ><X size={22} /></button>

        {/* Counter */}
        <div className="absolute top-4 left-4 z-20 text-white/70 text-sm font-mono">
          {index + 1} / {total}
        </div>

        {/* Zoom controls (images only) */}
        {cur.type !== 'video' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.max(1, z - 0.5)); }} className="w-9 h-9 flex items-center justify-center text-white bg-white/10 hover:bg-white/20" data-testid="lightbox-zoom-out"><ZoomOut size={16} /></button>
            <button onClick={(e) => { e.stopPropagation(); setZoom((z) => Math.min(4, z + 0.5)); }} className="w-9 h-9 flex items-center justify-center text-white bg-white/10 hover:bg-white/20" data-testid="lightbox-zoom-in"><ZoomIn size={16} /></button>
          </div>
        )}

        {/* Prev */}
        {total > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white bg-white/10 hover:bg-[#FFB800] hover:text-[#0A2540] transition-colors"
            data-testid="lightbox-prev"
            aria-label="Précédent"
          ><ChevronLeft size={26} /></button>
        )}

        {/* Content */}
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
          className="relative w-full h-full flex items-center justify-center p-4 md:p-10"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
        >
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Loader2 size={40} className="animate-spin text-[#FFB800]" data-testid="lightbox-loading" />
            </div>
          )}

          {cur.type === 'video' ? (
            <video
              key={cur.url}
              src={mediaUrl(cur.url)}
              controls autoPlay
              onLoadedData={() => setLoading(false)}
              className="max-w-full max-h-full outline-none"
              data-testid="lightbox-video"
            />
          ) : (
            <img
              src={mediaUrl(cur.url)}
              alt={cur.alt || cur.title || ''}
              onLoad={() => setLoading(false)}
              onError={() => setLoading(false)}
              draggable={false}
              className="max-w-full max-h-full object-contain select-none transition-transform duration-200"
              style={{
                transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                cursor: zoom > 1 ? (dragStart ? 'grabbing' : 'grab') : 'zoom-in',
              }}
              onClick={(e) => { e.stopPropagation(); if (zoom === 1) setZoom(2); else { setZoom(1); setPan({ x: 0, y: 0 }); } }}
              data-testid="lightbox-image"
            />
          )}
        </motion.div>

        {/* Next */}
        {total > 1 && (
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-white bg-white/10 hover:bg-[#FFB800] hover:text-[#0A2540] transition-colors"
            data-testid="lightbox-next"
            aria-label="Suivant"
          ><ChevronRight size={26} /></button>
        )}

        {/* Caption */}
        {(cur.title || cur.description) && (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 to-transparent p-6 md:p-10 text-white pointer-events-none">
            <div className="max-w-3xl mx-auto text-center">
              {cur.title && <div className="font-heading text-xl md:text-2xl font-bold uppercase" data-testid="lightbox-title">{cur.title}</div>}
              {cur.description && <div className="mt-2 text-sm md:text-base text-white/80" data-testid="lightbox-description">{cur.description}</div>}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Thumbnail grid — preserves existing 2/3-column layout.
 * Clicking a thumb opens the lightbox.
 */
export function GalleryGrid({ items, columns = 3 }) {
  const [openIdx, setOpenIdx] = useState(null);
  const visible = (items || []).filter((it) => it.published !== false);
  if (visible.length === 0) return null;
  const colClass = columns === 2 ? 'grid-cols-2 sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-3';
  return (
    <>
      <div className={`grid ${colClass} gap-3`} data-testid="gallery-grid">
        {visible.map((it, i) => (
          <button
            key={i}
            onClick={() => setOpenIdx(i)}
            className="group relative overflow-hidden bg-gray-100 aspect-[4/3] focus:outline-none"
            data-testid={`gallery-item-${i}`}
            aria-label={it.title || `Média ${i + 1}`}
          >
            {it.type === 'video' ? (
              <>
                <video
                  src={mediaUrl(it.url)}
                  muted playsInline preload="metadata"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-[#FFB800] text-[#0A2540] flex items-center justify-center rounded-full shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={22} fill="currentColor" />
                  </div>
                </div>
              </>
            ) : (
              <img
                src={mediaUrl(it.url)}
                alt={it.alt || it.title || ''}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            )}
            {it.title && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white text-sm font-semibold truncate">{it.title}</div>
              </div>
            )}
          </button>
        ))}
      </div>
      {openIdx !== null && (
        <Lightbox
          items={visible}
          index={openIdx}
          onClose={() => setOpenIdx(null)}
          onIndex={setOpenIdx}
        />
      )}
    </>
  );
}
