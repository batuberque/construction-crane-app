import { Link } from 'react-router-dom';
import { TbArrowRight } from 'react-icons/tb';

import Page from '../../lib/ui/Page';
import { SERVICES } from '../../lib/services';

const Service = () => (
  <Page>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <p className="spec text-concrete mb-4">Hizmetler</p>
      <h1 className="text-display-l font-bold uppercase max-w-[18ch]">
        Sahada ne yapıyoruz
      </h1>
      <p className="mt-5 max-w-prose text-body-l text-concrete">
        Vinç kiralamadan şantiye yürütmesine kadar, projenin hangi aşamasında
        ihtiyaç duyarsanız devreye giriyoruz.
      </p>

      <ul className="mt-14 grid border-l border-t border-steel-line sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map(({ id, name, description, Icon }) => (
          <li key={id} className="border-b border-r border-steel-line p-7">
            <Icon aria-hidden="true" className="text-3xl text-hazard" strokeWidth={1.4} />
            <h2 className="mt-5 text-display-m font-semibold">{name}</h2>
            <p className="mt-2 leading-relaxed text-concrete">{description}</p>
          </li>
        ))}
      </ul>

      <div className="mt-14 flex flex-wrap items-center gap-4 border-t border-steel-line pt-8">
        <p className="text-body-l">Aradığınız hizmeti göremediniz mi?</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-hazard px-6 py-3.5 spec font-medium text-graphite hover:bg-hazard/90 transition-colors"
        >
          Bize sorun <TbArrowRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  </Page>
);

export default Service;
