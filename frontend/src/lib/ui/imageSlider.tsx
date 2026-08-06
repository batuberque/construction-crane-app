import { useEffect, useRef, useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';

type Props = { images: string[]; alt: string };

/**
 * Project image slider.
 *
 * The index is local state on purpose. It used to live in the global zustand
 * store, which meant it never reset between projects — going from a 5-image
 * project at index 4 to a 1-image project rendered src={undefined}.
 *
 * Only the current image is mounted, so a 10-image project doesn't pull ten
 * full-resolution originals off GCS at once.
 */
const ImageSlider = ({ images, alt }: Props) => {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  // Clamp if the image list shrinks under us.
  useEffect(() => {
    setIndex((i) => (i > images.length - 1 ? 0 : i));
  }, [images.length]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[3/2] items-center justify-center bg-steel">
        <span className="spec text-concrete">Görsel yok</span>
      </div>
    );
  }

  const go = (delta: number) =>
    setIndex((i) => (i + delta + images.length) % images.length);

  // Arrow-key nav lives on the controls, per the APG carousel pattern — the
  // container is a group, not a widget, so it takes no tabIndex of its own.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };

  return (
    <div
      className="relative select-none"
      role="group"
      aria-roledescription="galeri"
      aria-label={`${alt} görselleri`}
    >
      <div
        className="relative aspect-[3/2] overflow-hidden bg-steel"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
          touchStartX.current = null;
        }}
      >
        <img
          // key restarts the fade whenever the slide changes.
          key={images[index]}
          src={images[index]}
          alt={`${alt} — görsel ${index + 1}/${images.length}`}
          decoding="async"
          className="fade-in h-full w-full object-cover"
        />
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            onKeyDown={onKeyDown}
            aria-label="Önceki görsel"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-graphite/70 p-2.5 text-signal backdrop-blur-sm hover:bg-graphite transition-colors"
          >
            <TbChevronLeft aria-hidden="true" className="text-xl" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            onKeyDown={onKeyDown}
            aria-label="Sonraki görsel"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-graphite/70 p-2.5 text-signal backdrop-blur-sm hover:bg-graphite transition-colors"
          >
            <TbChevronRight aria-hidden="true" className="text-xl" />
          </button>

          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`${i + 1}. görsele git`}
                aria-current={i === index}
                className={`h-1.5 transition-all ${
                  i === index ? 'w-7 bg-hazard' : 'w-3 bg-signal/50 hover:bg-signal/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
