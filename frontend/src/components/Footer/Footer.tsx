import { Link } from 'react-router-dom';
import { TbBrandInstagram, TbMail, TbMapPin, TbPhone } from 'react-icons/tb';

import { NAV_LINKS, SITE, mapsUrl } from '../../lib/site';

const Footer = () => (
  <footer data-surface="graphite" className="border-t border-steel-line">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
      <div className="grid gap-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-semibold tracking-tight">{SITE.name}</p>
          <p className="mt-3 max-w-xs text-concrete leading-relaxed">
            {SITE.since} {SITE.city} ve çevresinde vinç ve inşaat hizmetleri.
          </p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 spec text-concrete hover:text-hazard transition-colors"
          >
            <TbBrandInstagram aria-hidden="true" className="text-lg" />
            Instagram
          </a>
        </div>

        <nav aria-label="Alt menü">
          <h2 className="spec text-concrete mb-4">Site haritası</h2>
          <ul className="space-y-2.5">
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-hazard transition-colors">
                  {label.charAt(0) + label.slice(1).toLocaleLowerCase('tr')}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="spec text-concrete mb-4">İletişim</h2>
          <ul className="space-y-3.5">
            <li>
              <a
                href={`tel:${SITE.phone.replace(/\s/g, '')}`}
                className="flex items-start gap-3 hover:text-hazard transition-colors"
              >
                <TbPhone aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-hazard" />
                <span className="spec">{SITE.phone}</span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-start gap-3 hover:text-hazard transition-colors"
              >
                <TbMail aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-hazard" />
                <span className="break-all">{SITE.email}</span>
              </a>
            </li>
            <li>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 text-concrete hover:text-hazard transition-colors"
              >
                <TbMapPin aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-hazard" />
                <span className="leading-relaxed">{SITE.address}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-steel-line pt-6">
        <p className="spec text-concrete">
          © {new Date().getFullYear()} {SITE.name}
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
