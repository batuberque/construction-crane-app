import Page from '../../lib/ui/Page';
import { SITE } from '../../lib/site';
import aboutImage from '../../assets/about.webp';

const VALUES = [
  {
    name: 'Yenilikçilik',
    description: 'Sektördeki yenilikleri yakından takip ederiz.',
  },
  {
    name: 'Kalite',
    description: 'Tüm projelerimizde en yüksek kalite standartlarını hedefleriz.',
  },
  {
    name: 'Sürdürülebilirlik',
    description: 'Çevre dostu uygulamalarla gelecek nesillere katkıda bulunuruz.',
  },
  {
    name: 'Müşteri memnuniyeti',
    description: 'Müşteri ihtiyaçlarını her zaman ön planda tutarız.',
  },
];

const About = () => (
  <Page>
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <p className="spec text-concrete mb-4">Hakkımızda</p>
      <h1 className="text-display-l font-bold uppercase max-w-[20ch]">
        {SITE.since} {SITE.city}&apos;de
      </h1>

      <div className="mt-12 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-20">
        <div className="max-w-prose">
          <p className="text-body-l leading-relaxed">
            TORA VİNÇ İNŞAAT, {SITE.foundedYear} yılında {SITE.city}&apos;de
            kurulmuş, mühendislik ve inşaat sektöründe faaliyet gösteren bir
            firmadır. Kaliteli hizmet anlayışı, müşteri odaklı yaklaşımı ve çevre
            dostu projeleriyle çalışır.
          </p>

          {/* 38 years is the founder's career, not the company's age — the old
              site risked reading it as the latter. */}
          <dl className="mt-10 grid border-l border-t border-steel-line sm:grid-cols-2">
            <div className="border-b border-r border-steel-line p-6">
              <dt className="spec text-concrete">Kurucu</dt>
              <dd className="mt-2 text-display-m font-semibold">Mehmet Tora</dd>
              <dd className="mt-1 text-concrete">
                Meslek hayatında 38 yılı geride bıraktı.
              </dd>
            </div>
            <div className="border-b border-r border-steel-line p-6">
              <dt className="spec text-concrete">Teknik yönetim</dt>
              <dd className="mt-2 text-display-m font-semibold">Vatan Barış Tora</dd>
              <dd className="mt-1 text-concrete">
                İnşaat mühendisi olarak projelerin teknik yönetiminde görev alıyor.
              </dd>
            </div>
          </dl>

          <h2 className="mt-14 text-display-m font-bold uppercase">Misyonumuz</h2>
          <p className="mt-4 leading-relaxed text-concrete">
            İnşaat sektöründe yüksek standartlarda projeler üreterek müşteri
            memnuniyetini en üst seviyeye çıkarmak, çevreye duyarlı ve
            sürdürülebilir yapılar inşa etmek.
          </p>

          {/* Vizyon used to be its own route that nothing linked to. */}
          <h2 id="vizyon" className="mt-12 text-display-m font-bold uppercase scroll-mt-nav">
            Vizyonumuz
          </h2>
          <blockquote className="mt-4 border-l-2 border-hazard pl-5 text-body-l leading-relaxed">
            Sürdürülebilir ve yenilikçi çözümlerle inşaat sektöründe öncü olmak ve
            kaliteli hizmetlerimizle müşteri memnuniyetini en üst düzeye çıkarmak.
          </blockquote>
        </div>

        <div className="lg:pt-2">
          <img
            src={aboutImage}
            alt="TORA Vinç İnşaat sahada"
            width={900}
            height={507}
            loading="lazy"
            decoding="async"
            className="w-full object-cover"
          />

          <h2 className="mt-14 text-display-m font-bold uppercase">Değerlerimiz</h2>
          <dl className="mt-6 divide-y divide-steel-line border-t border-steel-line">
            {VALUES.map(({ name, description }) => (
              <div key={name} className="py-5">
                <dt className="spec">{name}</dt>
                <dd className="mt-1.5 text-concrete leading-relaxed">{description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  </Page>
);

export default About;
