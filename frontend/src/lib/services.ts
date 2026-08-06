import {
  TbCrane,
  TbBuildingSkyscraper,
  TbClipboardCheck,
  TbMapSearch,
  TbLeaf,
  TbShieldCheck,
  TbTruckDelivery,
} from 'react-icons/tb';

/**
 * The seven services. Previously every one of these rendered the same
 * 'IoConstruct' icon, which made the list read as filler.
 */
export const SERVICES = [
  {
    id: 'vinc-kiralama',
    name: 'Vinç Kiralama',
    description: 'İnşaat ve montaj işleriniz için modern vinç kiralama çözümleri.',
    Icon: TbCrane,
  },
  {
    id: 'insaat-yonetimi',
    name: 'İnşaat Yönetimi',
    description: 'Şantiye yürütmesini baştan sona profesyonel olarak yönetiyoruz.',
    Icon: TbBuildingSkyscraper,
  },
  {
    id: 'proje-yonetimi',
    name: 'Proje Yönetimi',
    description: 'Karmaşık projelerde planlama, koordinasyon ve ilerleme takibi.',
    Icon: TbClipboardCheck,
  },
  {
    id: 'arazi-gelistirme',
    name: 'Arazi Geliştirme ve Araştırma',
    description: 'İnşaata uygunluk için arazi analizi ve geliştirme danışmanlığı.',
    Icon: TbMapSearch,
  },
  {
    id: 'surdurulebilir',
    name: 'Sürdürülebilir İnşaat',
    description: 'Çevre dostu ve enerji verimli yapım yöntemleri.',
    Icon: TbLeaf,
  },
  {
    id: 'guvenlik-denetim',
    name: 'Güvenlik ve Denetim',
    description: 'Şantiye güvenliği denetimi ve risk yönetimi.',
    Icon: TbShieldCheck,
  },
  {
    id: 'tedarik',
    name: 'Ekipman ve Malzeme Tedariki',
    description: 'İnşaat malzemesi ve ekipman tedariki.',
    Icon: TbTruckDelivery,
  },
] as const;
