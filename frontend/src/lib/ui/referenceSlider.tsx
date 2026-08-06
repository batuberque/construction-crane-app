import { REFERENCES } from '../site';

/**
 * Seamless logo marquee.
 *
 * The old version animated a single track from -100% to +100%, so the logos
 * swept across and then vanished before reappearing — not a loop. Two identical
 * copies translated by exactly -50% gives a true seam-free cycle, and doing it
 * in CSS keeps framer-motion's rAF loop from running forever on the landing page.
 *
 * Each logo sits on a light plate: most are dark artwork on transparency and
 * would be invisible against the graphite surface.
 */
const ReferenceSlider = () => (
  // No edge mask: the logo plates are solid, so a gradient fade reads as a
  // half-erased tile rather than a soft entry. Full-bleed hard edge instead.
  <div className="relative overflow-hidden">
    <ul className="marquee flex w-max items-center">
      {[0, 1].map((copy) => (
        <li key={copy} className="flex items-center" aria-hidden={copy === 1}>
          {REFERENCES.map(({ name, logo }) => (
            <span key={name} className="flex shrink-0 items-center px-3 sm:px-4">
              <span className="flex h-24 w-44 items-center justify-center bg-signal px-5 sm:h-28 sm:w-52 sm:px-6">
                <img
                  src={logo}
                  alt={copy === 0 ? name : ''}
                  loading="lazy"
                  decoding="async"
                  className="max-h-14 w-auto max-w-full object-contain grayscale transition duration-300 hover:grayscale-0 sm:max-h-16"
                />
              </span>
            </span>
          ))}
        </li>
      ))}
    </ul>
  </div>
);

export default ReferenceSlider;
