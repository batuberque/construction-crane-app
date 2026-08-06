import abb from '../assets/abb.png';
import arkas from '../assets/arkas.png';
import bosch from '../assets/bosch.png';
import cms from '../assets/cms_resized-removebg-preview.png';
import delphi from '../assets/delphi.png';
import hugoBoss from '../assets/hugo-boss.png';
import izeltas from '../assets/izeltas_resized-removebg-preview.png';
import jti from '../assets/jti.png';
import keInsaat from '../assets/keinsaat_resized-removebg-preview.png';
import kipa from '../assets/kipa.png';
import msbInsaat from '../assets/msbinsaat_resized-removebg-preview.png';
import oetker from '../assets/oetker.png';
import vestel from '../assets/vestel.png';
import yorglass from '../assets/yorglass_resized.png';

/** Single source of truth — previously duplicated between contactSlice and Footer. */
export const SITE = {
  name: 'TORA VİNÇ & İNŞAAT',
  shortName: 'TORA',
  foundedYear: 1999,
  // Turkish ablative suffix depends on the year's final vowel (1999 → "dokuz"
  // → 'dan, not 'ten). Kept in one place so it can't drift out of agreement.
  since: "1999'dan beri",
  city: 'İzmir',
  phone: '+90 533 389 59 72',
  email: 'toravincinsaat@gmail.com',
  address: 'Beyazevler Mahallesi, 515. Sokak, No:36/2 Gaziemir - İZMİR',
  instagram: 'https://www.instagram.com/toravincinsaat/',
} as const;

export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  SITE.address
)}`;

/**
 * Reference logos. Names are read off the asset filenames — confirm the exact
 * legal spellings with the client before treating this as final copy.
 */
export const REFERENCES = [
  { name: 'ABB', logo: abb },
  { name: 'Arkas', logo: arkas },
  { name: 'Bosch', logo: bosch },
  { name: 'ÇMS', logo: cms },
  { name: 'Delphi', logo: delphi },
  { name: 'HUGO BOSS', logo: hugoBoss },
  { name: 'İzeltaş', logo: izeltas },
  { name: 'JTI', logo: jti },
  { name: 'KE İnşaat', logo: keInsaat },
  { name: 'Kipa', logo: kipa },
  { name: 'MSB İnşaat', logo: msbInsaat },
  { name: 'Dr. Oetker', logo: oetker },
  { name: 'Vestel', logo: vestel },
  { name: 'Yorglass', logo: yorglass },
] as const;

export const NAV_LINKS = [
  { to: '/', label: 'ANA SAYFA' },
  { to: '/about', label: 'HAKKIMIZDA' },
  { to: '/service', label: 'HİZMETLER' },
  { to: '/project', label: 'PROJELER' },
  { to: '/references', label: 'REFERANSLAR' },
  { to: '/contact', label: 'İLETİŞİM' },
] as const;
