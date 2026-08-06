import { Link } from 'react-router-dom';
import { TbArrowRight } from 'react-icons/tb';

import Page from '../../lib/ui/Page';

const NotFound = () => (
  <Page>
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-24 md:py-32">
      <p className="spec text-hazard mb-4">Hata 404</p>
      <h1 className="text-display-l font-bold uppercase">Bu sayfa bulunamadı</h1>
      <p className="mt-5 max-w-prose text-body-l text-concrete">
        Aradığınız içerik taşınmış veya kaldırılmış olabilir.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-hazard px-6 py-3.5 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
        >
          Ana sayfaya dönün <TbArrowRight aria-hidden="true" />
        </Link>
        <Link
          to="/contact"
          className="inline-flex items-center border border-concrete/50 px-6 py-3.5 spec hover:border-signal hover:bg-signal/5 transition-colors"
        >
          Bize ulaşın
        </Link>
      </div>
    </div>
  </Page>
);

export default NotFound;
