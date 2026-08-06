import { Link } from 'react-router-dom';
import { TbArrowRight } from 'react-icons/tb';

import Page from '../../lib/ui/Page';
import RadiusArcs from '../../lib/ui/RadiusArcs';
import ReferenceSlider from '../../lib/ui/referenceSlider';
import { SERVICES } from '../../lib/services';
import { REFERENCES, SITE } from '../../lib/site';

const HERO_SRCSET =
  '/hero-768.webp 768w, /hero-1280.webp 1280w, /hero-1920.webp 1920w';

const Home = () => (
  <Page flush>
    {/* ---------------------------------------------------------------- hero */}
    <section className="relative isolate min-h-[32rem] md:min-h-[calc(100vh-var(--nav-h))] flex items-center overflow-hidden">
      <img
        src="/hero-1280.webp"
        srcSet={HERO_SRCSET}
        sizes="100vw"
        width={1920}
        height={1440}
        decoding="async"
        alt="TORA Vinç sahada çalışan mobil vinç"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      {/* Scrim: the old hero put white text straight onto the photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-graphite via-graphite/85 to-graphite/45"
      />
      {/* Accent pushed outward so the yellow arc sweeps across the photo rather
          than bisecting the headline. */}
      <RadiusArcs className="absolute inset-0 -z-10 h-full w-full" accentIndex={4} />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <p className="spec text-hazard mb-5">
          {SITE.city} · {SITE.since}
        </p>

        <h1 className="text-display-xl font-extrabold uppercase max-w-[16ch]">
          Ağır yük
          <br />
          kaldırma
          <span className="text-concrete"> ve inşaat</span>
        </h1>

        <p className="mt-6 max-w-prose text-body-l text-concrete">
          {SITE.since} {SITE.city} ve çevresindeki sanayi tesislerinde vinç
          kiralama, proje yönetimi ve inşaat işleri yürütüyoruz.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-hazard px-6 py-3.5 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
          >
            Teklif alın <TbArrowRight aria-hidden="true" className="text-base" />
          </Link>
          <Link
            to="/project"
            className="inline-flex items-center gap-2 border border-concrete/50 px-6 py-3.5 spec text-signal hover:border-signal hover:bg-signal/5 transition-colors"
          >
            Projeleri görün
          </Link>
        </div>

        {/* Only claims that can be checked against the site's own content. */}
        <dl className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-steel-line pt-6 max-w-2xl">
          {[
            { k: 'Kurumsal referans', v: String(REFERENCES.length) },
            { k: 'Kuruluş', v: String(SITE.foundedYear) },
            { k: 'Merkez', v: SITE.city },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt className="spec text-concrete">{k}</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>

    {/* ------------------------------------------------------------ services */}
    <section className="border-t border-steel-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-12">
          <h2 className="text-display-l font-bold uppercase">Hizmetler</h2>
          <Link
            to="/service"
            className="spec text-concrete hover:text-hazard transition-colors inline-flex items-center gap-2"
          >
            Tümünü görün <TbArrowRight aria-hidden="true" />
          </Link>
        </div>

        <ul className="grid border-l border-t border-steel-line sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.slice(0, 4).map(({ id, name, description, Icon }) => (
            <li key={id} className="border-b border-r border-steel-line p-7">
              <Icon aria-hidden="true" className="text-hazard text-3xl" strokeWidth={1.4} />
              <h3 className="mt-5 text-display-m font-semibold">{name}</h3>
              <p className="mt-2 text-concrete leading-relaxed">{description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>

    {/* ---------------------------------------------------------- references */}
    <section className="border-t border-steel-line py-16">
      <h2 className="spec text-concrete text-center mb-12">
        Birlikte çalıştığımız kurumlar
      </h2>
      <ReferenceSlider />
    </section>

    {/* ------------------------------------------------------------- cta band */}
    <section className="border-t border-steel-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <h2 className="text-display-l font-bold uppercase">Bir işiniz mi var?</h2>
          <p className="mt-3 text-concrete text-body-l max-w-prose">
            Sahayı anlatın, uygun ekipman ve yöntemi birlikte belirleyelim.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href={`tel:${SITE.phone.replace(/\s/g, '')}`}
            className="inline-flex items-center bg-hazard px-6 py-3.5 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
          >
            {SITE.phone}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center border border-concrete/50 px-6 py-3.5 spec hover:border-signal hover:bg-signal/5 transition-colors"
          >
            E-posta gönderin
          </Link>
        </div>
      </div>
    </section>
  </Page>
);

export default Home;
