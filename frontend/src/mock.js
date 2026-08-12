// SVN MAKİNA - Mock data (frontend-only teaser). Later replaced by backend API.
import {
  Wrench, Cog, Truck, ShieldCheck, ShoppingCart, Gauge,
  Users, ThumbsUp, Zap,
} from "lucide-react";

export const IMAGES = {
  hero: "https://images.unsplash.com/photo-1742070122885-1b8aa9726d1a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHw0fHx0ZWxlaGFuZGxlcnxlbnwwfHx8fDE3ODY1MDA0MDd8MA&ixlib=rb-4.1.0&q=85",
  about: "https://images.unsplash.com/photo-1742070122920-3480a94cfbbb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHx0ZWxlaGFuZGxlcnxlbnwwfHx8fDE3ODY1MDA0MDd8MA&ixlib=rb-4.1.0&q=85",
  services: {
    technical: "https://images.unsplash.com/photo-1615906655593-ad0386982a0f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwxfHxtZWNoYW5pYyUyMHJlcGFpciUyMGVuZ2luZXxlbnwwfHx8fDE3ODY1MDA0Mzl8MA&ixlib=rb-4.1.0&q=85",
    parts: "https://images.unsplash.com/photo-1766650189458-bb0e7969ba5d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjd8MHwxfHNlYXJjaHwyfHxzcGFyZSUyMHBhcnRzJTIwd29ya3Nob3B8ZW58MHx8fHwxNzg2NTAwNDM5fDA&ixlib=rb-4.1.0&q=85",
    maintenance: "https://images.unsplash.com/photo-1565377167263-d29b5ac85479?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNTl8MHwxfHNlYXJjaHwzfHxtYWNoaW5lcnklMjBtYWludGVuYW5jZXxlbnwwfHx8fDE3ODY1MDA0Mzl8MA&ixlib=rb-4.1.0&q=85",
    rental: "https://images.unsplash.com/photo-1620388640785-892616248ec8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwzfHxmb3JrbGlmdHxlbnwwfHx8fDE3ODY1MDA0MDd8MA&ixlib=rb-4.1.0&q=85",
    sale: "https://images.unsplash.com/photo-1714627798569-b3e36d409c4b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwyfHxmb3JrbGlmdHxlbnwwfHx8fDE3ODY1MDA0MDd8MA&ixlib=rb-4.1.0&q=85",
    pricing: "https://images.unsplash.com/photo-1575281923032-f40d94ef6160?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYWNoaW5lcnl8ZW58MHx8fHwxNzg2NTAwNDA3fDA&ixlib=rb-4.1.0&q=85",
  },
};

export const SERVICE_ICONS = {
  technical: Wrench,
  pricing: Gauge,
  parts: Cog,
  maintenance: ShieldCheck,
  rental: Truck,
  sale: ShoppingCart,
};

export const FEATURE_ICONS = { staff: Users, satisfaction: ThumbsUp, fast: Zap };

// Shared, non-translatable company info
export const COMPANY = {
  brand: "SVN MAKİNA",
  phone: "+90 555 000 00 00",
  phoneRaw: "+905550000000",
  whatsapp: "905550000000",
  email: "info@svnmakina.com",
  email2: "svnmakina@gmail.com",
  addressLine: "İstasyon Mah. Sanayi Sitesi 28. Sk. No:21, 22100 Merkez / Edirne",
  mapQuery: "Edirne Sanayi Sitesi",
  social: { instagram: "#", facebook: "#", linkedin: "#" },
};

export const TEAM = [
  {
    id: "hasan-savun",
    name: "Hasan Savun",
    titleTr: "Genel Müdür",
    titleEn: "General Manager",
    phone: "+90 555 111 11 11",
    phoneRaw: "+905551111111",
    email: "hasan@svnmakina.com",
    avatar: "https://ui-avatars.com/api/?name=Hasan+Savun&background=E30613&color=fff&size=320&bold=true&font-size=0.4",
  },
  {
    id: "ali-savun",
    name: "Ali Savun",
    titleTr: "Teknik Servis Müdürü",
    titleEn: "Technical Service Manager",
    phone: "+90 555 222 22 22",
    phoneRaw: "+905552222222",
    email: "ali@svnmakina.com",
    avatar: "https://ui-avatars.com/api/?name=Ali+Savun&background=1a1a1a&color=fff&size=320&bold=true&font-size=0.4",
  },
  {
    id: "baris-eren-savun",
    name: "Barış Eren Savun",
    titleTr: "Satış & Kiralama Sorumlusu",
    titleEn: "Sales & Rental Manager",
    phone: "+90 555 333 33 33",
    phoneRaw: "+905553333333",
    email: "baris@svnmakina.com",
    avatar: "https://ui-avatars.com/api/?name=Baris+Savun&background=E30613&color=fff&size=320&bold=true&font-size=0.4",
  },
];

const SERVICE_KEYS = ["technical", "pricing", "parts", "maintenance", "rental", "sale"];

export const CONTENT = {
  tr: {
    nav: {
      home: "Anasayfa",
      about: "Kurumsal",
      team: "Teknik Personel",
      services: "Hizmetlerimiz",
      faq: "S.S.S",
      contact: "İletişim",
      cta: "Servis Talep Formu",
    },
    hero: {
      tagline: "/// Teknik Servis Hizmetleri ///",
      title: "SVN MAKİNA ÖZEL SERVİS",
      subtitle:
        "SVN Makina olarak Türkiye genelinde uzman ekibimiz ile hızlı ve güvenilir iş makinesi bakım, onarım ve yedek parça hizmeti sağlamaktayız.",
      primary: "Bize Ulaşın",
      whatsapp: "WhatsApp",
    },
    about: {
      tagline: "/// HAKKIMIZDA ///",
      title: "Neden Bizi Tercih Etmelisiniz?",
      p1: "SVN Makina olarak, Türkiye genelinde sunduğumuz profesyonel hizmetlerle fark yaratıyoruz. Uzman kadromuz, iş makineleri konusunda geniş bilgi ve deneyime sahiptir. Her türlü bakım, onarım ve yedek parça ihtiyaçlarınızda hızlı ve güvenilir çözümler sunuyoruz.",
      p2: "Müşteri memnuniyetini önceliğimiz haline getiriyor, her aşamada şeffaf ve kaliteli hizmet sağlıyoruz. İhtiyaçlarınıza uygun çözümler geliştirerek makinelerinizin uzun ömürlü ve verimli çalışmasını sağlıyoruz.",
      points: [
        "Hızlı ve Güvenilir Teknik Servis",
        "Orijinal ve Garantili Yedek Parça Temini",
        "İhtiyaca Uygun İş Makinesi Kiralama",
        "Düzenli ve Kapsamlı Periyodik Bakım Hizmeti",
        "Avantajlı Fiyatlarla İş Makinesi Satışı",
      ],
    },
    services: {
      tagline: "/// HİZMETLERİMİZ ///",
      title: "Size Nasıl Yardımcı Olabiliriz?",
      detail: "Detayları İncele",
      items: {
        technical: { title: "İş Makinesi Teknik Servis", desc: "Türkiye genelinde iş makineleriniz için uzman teknik servis hizmeti sunuyoruz. Hızlı müdahale, kaliteli işçilik ve orijinal yedek parçalarla makinelerinizi güvenle çalıştırın." },
        pricing: { title: "Servis Fiyatları 2025", desc: "2025 servis, bakım ve yedek parça fiyatlarında uygun ve rekabetçi çözümler sunuyoruz. Kaliteli hizmeti en iyi fiyatlarla almak için bizimle iletişime geçin." },
        parts: { title: "Yedek Parça", desc: "İş makineleriniz için orijinal ve garantili yedek parça temin ediyoruz. Uzun ömürlü ve sorunsuz kullanım için kaliteli parçalarla makinelerinizi güvenle çalıştırın." },
        maintenance: { title: "Periyodik Bakım", desc: "Makinelerinizin verimli ve sorunsuz çalışması için düzenli bakım şart. Profesyonel ekibimizle periyodik bakım hizmeti sunarak olası arızaların önüne geçiyoruz." },
        rental: { title: "Makine Kiralama", desc: "İhtiyacınıza uygun iş makinelerini uygun fiyatlarla kiralayın. Bakımlı ve güvenilir araçlarımızla projelerinize kesintisiz destek sunuyoruz." },
        sale: { title: "2. El Satış", desc: "İkinci el iş makinelerinde en uygun fiyatlar ve geniş ürün yelpazesiyle satış hizmeti veriyoruz. Performanslı ve güvenilir makineler için bize ulaşın." },
      },
    },
    features: {
      staff: { title: "Uzman Kadro", desc: "Deneyimli ve eğitimli ekibimizle makineleriniz emin ellerde." },
      satisfaction: { title: "Müşteri Memnuniyeti", desc: "İhtiyaçlarınıza odaklanan kaliteli hizmet anlayışıyla yanınızdayız." },
      fast: { title: "Hızlı Çözümler", desc: "Arızalara anında müdahale, hızlı ve etkili onarım garantisi sunuyoruz." },
    },
    faq: {
      tagline: "/// S.S.S ///",
      title: "Sıkça Sorulan Sorular",
      items: [
        { q: "SVN Makina hangi hizmetleri sunar?", a: "Teknik servis, periyodik bakım, orijinal yedek parça temini, iş makinesi kiralama ve 2. el satış gibi geniş bir hizmet yelpazesi sunuyoruz." },
        { q: "İş makineleri hangi sektörlerde kullanılır?", a: "İnşaat, tarım, sanayi ve lojistik başta olmak üzere ağır yük kaldırma ve taşıma gerektiren tüm sektörlerde kullanılır." },
        { q: "Bakım ve onarım nasıl yapılır?", a: "Yağ değişimi, filtre kontrolü, hidrolik sistem denetimi ve lastik basınç ayarları gibi işlemler orijinal parçalarla uzman teknisyenlerimizce yapılır." },
        { q: "Periyodik bakım neden önemlidir?", a: "Periyodik bakım makinelerin verimliliğini artırır, olası arızaların önüne geçer ve iş güvenliğini sağlar." },
        { q: "Servis talebini nasıl oluşturabilirim?", a: "Web sitemizdeki Servis Talep Formu'nu doldurabilir veya telefon/WhatsApp üzerinden bizimle iletişime geçebilirsiniz." },
        { q: "SVN Makina'ya nasıl ulaşabilirim?", a: "info@svnmakina.com e-posta adresinden veya iletişim sayfamızdaki telefon numaralarından bize kolayca ulaşabilirsiniz." },
      ],
    },
    team: {
      tagline: "/// TEKNİK PERSONEL ///",
      title: "Uzman Ekibimiz",
      subtitle: "Deneyimli teknik kadromuzla makineleriniz emin ellerde. Aşağıdaki ekibimizle doğrudan iletişime geçebilirsiniz.",
      callBtn: "Ara",
      mailBtn: "E-posta",
    },
    contact: {
      tagline: "/// BİZE ULAŞIN ///",
      title: "İletişim Bilgilerimiz",
      hq: "Firma Merkezi",
      phone: "Telefon",
      email: "E-posta Destek",
      formTitle: "Servis Talep Formu",
      formSubtitle: "Formu doldurun, uzman ekibimiz en kısa sürede size dönüş yapsın.",
      fields: { name: "Ad Soyad", phone: "Telefon", email: "E-posta", subject: "Konu", message: "Mesajınız" },
      submit: "Gönder",
      success: "Talebiniz alındı! En kısa sürede size dönüş yapacağız.",
    },
    footer: {
      about: "SVN Makina, Türkiye genelinde iş makineleri için hızlı ve güvenilir bakım, onarım ve yedek parça hizmeti sunar.",
      quickLinks: "Hızlı Bağlantılar",
      contact: "İletişim",
      rights: "Tüm hakları saklıdır.",
    },
    pageTitles: {
      about: "Kurumsal",
      team: "Teknik Personel",
      services: "Hizmetlerimiz",
      faq: "Sıkça Sorulan Sorular",
      contact: "İletişim",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "Corporate",
      team: "Technical Staff",
      services: "Services",
      faq: "FAQ",
      contact: "Contact",
      cta: "Service Request",
    },
    hero: {
      tagline: "/// Technical Service ///",
      title: "SVN MAKİNA SPECIAL SERVICE",
      subtitle:
        "As SVN Makina, we provide fast and reliable heavy machinery maintenance, repair and spare parts services across Türkiye with our expert team.",
      primary: "Contact Us",
      whatsapp: "WhatsApp",
    },
    about: {
      tagline: "/// ABOUT US ///",
      title: "Why Choose Us?",
      p1: "As SVN Makina, we make a difference with the professional services we offer across Türkiye. Our expert staff has extensive knowledge and experience in heavy machinery. We provide fast and reliable solutions for all your maintenance, repair and spare parts needs.",
      p2: "We make customer satisfaction our priority, providing transparent and quality service at every stage. We develop solutions tailored to your needs, ensuring your machines run long and efficiently.",
      points: [
        "Fast and Reliable Technical Service",
        "Original and Warranted Spare Parts",
        "Machinery Rental to Suit Your Needs",
        "Regular and Comprehensive Maintenance",
        "Machinery Sales at Advantageous Prices",
      ],
    },
    services: {
      tagline: "/// OUR SERVICES ///",
      title: "How Can We Help You?",
      detail: "View Details",
      items: {
        technical: { title: "Machinery Technical Service", desc: "We offer expert technical service for your machinery across Türkiye. Run your machines safely with fast intervention, quality workmanship and original spare parts." },
        pricing: { title: "Service Prices 2025", desc: "We offer affordable and competitive solutions for 2025 service, maintenance and spare parts prices. Contact us to get quality service at the best prices." },
        parts: { title: "Spare Parts", desc: "We supply original and warranted spare parts for your machinery. Run your machines safely with quality parts for long and trouble-free use." },
        maintenance: { title: "Periodic Maintenance", desc: "Regular maintenance is essential for your machines to run efficiently. We prevent possible failures with periodic maintenance by our professional team." },
        rental: { title: "Machinery Rental", desc: "Rent machinery suitable for your needs at affordable prices. We provide uninterrupted support to your projects with our well-maintained and reliable vehicles." },
        sale: { title: "Used Machinery Sales", desc: "We provide sales service with the most affordable prices and a wide range of used machinery. Contact us for high-performance and reliable machines." },
      },
    },
    features: {
      staff: { title: "Expert Team", desc: "Your machines are in safe hands with our experienced and trained team." },
      satisfaction: { title: "Customer Satisfaction", desc: "We are with you with a quality service approach focused on your needs." },
      fast: { title: "Fast Solutions", desc: "We offer instant intervention to failures with fast and effective repair guarantee." },
    },
    faq: {
      tagline: "/// FAQ ///",
      title: "Frequently Asked Questions",
      items: [
        { q: "What services does SVN Makina offer?", a: "We offer a wide range of services including technical service, periodic maintenance, original spare parts supply, machinery rental and used machinery sales." },
        { q: "In which sectors is heavy machinery used?", a: "It is used in all sectors requiring heavy lifting and handling, primarily construction, agriculture, industry and logistics." },
        { q: "How is maintenance and repair done?", a: "Operations such as oil change, filter check, hydraulic system inspection and tire pressure adjustment are performed with original parts by our expert technicians." },
        { q: "Why is periodic maintenance important?", a: "Periodic maintenance increases the efficiency of machines, prevents possible failures and ensures work safety." },
        { q: "How can I create a service request?", a: "You can fill out the Service Request Form on our website or contact us by phone/WhatsApp." },
        { q: "How can I reach SVN Makina?", a: "You can easily reach us via info@svnmakina.com or the phone numbers on our contact page." },
      ],
    },
    team: {
      tagline: "/// TECHNICAL STAFF ///",
      title: "Our Expert Team",
      subtitle: "Your machines are in safe hands with our experienced technical staff. You can contact our team directly below.",
      callBtn: "Call",
      mailBtn: "Email",
    },
    contact: {
      tagline: "/// CONTACT ///",
      title: "Contact Information",
      hq: "Head Office",
      phone: "Phone",
      email: "Email Support",
      formTitle: "Service Request Form",
      formSubtitle: "Fill out the form and our expert team will get back to you as soon as possible.",
      fields: { name: "Full Name", phone: "Phone", email: "Email", subject: "Subject", message: "Your Message" },
      submit: "Send",
      success: "Your request has been received! We will get back to you shortly.",
    },
    footer: {
      about: "SVN Makina offers fast and reliable maintenance, repair and spare parts services for heavy machinery across Türkiye.",
      quickLinks: "Quick Links",
      contact: "Contact",
      rights: "All rights reserved.",
    },
    pageTitles: {
      about: "Corporate",
      team: "Technical Staff",
      services: "Services",
      faq: "Frequently Asked Questions",
      contact: "Contact",
    },
  },
};

export { SERVICE_KEYS };
