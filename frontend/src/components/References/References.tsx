import Page from '../../lib/ui/Page';
import { REFERENCES } from '../../lib/site';

const References = () => (
  <Page>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <p className="spec text-hazard mb-4">Referanslar</p>
      <h1 className="text-display-l font-bold uppercase max-w-[20ch]">
        Birlikte çalıştığımız kurumlar
      </h1>
      <p className="mt-5 max-w-prose text-body-l text-concrete">
        Sanayi tesislerinden inşaat firmalarına, {REFERENCES.length} kurumun
        projelerinde görev aldık.
      </p>

      {/* Borders live on the cells, not on a parent background showing through a
          gap — with 14 logos in a 4-column grid the old approach painted two
          empty filler cells at the end. */}
      <ul className="mt-14 grid grid-cols-2 border-l border-t border-steel-line sm:grid-cols-3 lg:grid-cols-4">
        {REFERENCES.map(({ name, logo }) => (
          <li
            key={name}
            className="flex flex-col items-center gap-5 border-b border-r border-steel-line p-6"
          >
            {/* Most of these logos are dark artwork on transparency and vanish
                on graphite, so each one sits on a light plate. */}
            <div className="flex h-28 w-full items-center justify-center bg-signal px-6">
              <img
                src={logo}
                alt={`${name} logosu`}
                loading="lazy"
                decoding="async"
                className="max-h-16 w-auto max-w-full object-contain grayscale transition duration-300 hover:grayscale-0 sm:max-h-20"
              />
            </div>
            <span className="spec text-center text-concrete">{name}</span>
          </li>
        ))}
      </ul>
    </div>
  </Page>
);

export default References;
