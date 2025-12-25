import { PersianHeader } from "../../components/persian-header";
import { PersianFooter } from "../../components/persian-footer";
import {
  FaDocker,
  FaServer,
  FaWifi,
  FaLink,
  FaGlobe,
  FaNetworkWired,
  FaCogs,
  FaCloud,
  FaMicrochip,
  FaBrain,
  FaDatabase,
  FaBitcoin,
} from "react-icons/fa";
import {
  GlobeLock,
  Library,
  Scale,
  Terminal,
  Workflow,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      title: "زیرساخت داده",
      description:
        "طراحی و پیاده‌سازی معماری مدرن لیک‌هاوس (Lakehouse) با ترکیب Data Lake و Data Warehouse، برای مدیریت داده‌های عظیم و ایجاد بستری امن برای تحلیل.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM9 12h6M12 9v6"
          />
        </svg>
      ),
      features: [
        "طراحی و پیاده‌سازی معماری Lakehouse",
        "ایجاد لایه‌های دریافت، ذخیره‌سازی، پردازش، و ارائه داده",
        "پیاده‌سازی Zero Trust Architecture (ZTA) برای امنیت داده",
      ],
    },
    {
      title: "هوش مصنوعی و تحلیل داده",
      description:
        "توسعه ابزارهای پیشرفته برای تحلیل، پیش‌بینی و پشتیبانی از تصمیم‌گیری. به‌کارگیری الگوریتم‌های یادگیری ماشین (Machine Learning) برای ارزیابی عملکرد.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9a3 3 0 013-3h2a3 3 0 013 3m0 6a3 3 0 01-3 3h-2a3 3 0 01-3-3M8 9v6m8-6v6M5 12h2m10 0h2M12 3v2m0 14v2M7 5l1.5 1.5M17 5l-1.5 1.5M7 19l1.5-1.5M17 19l-1.5-1.5"
          />
        </svg>
      ),
      features: [
        "توسعه ابزارهای تحلیل داده، پیش‌بینی و تصمیم‌یار",
        "الگوریتم‌های Machine Learning برای پایش و تحلیل پروژه‌ها",
        "ارزیابی شاخص‌های کلیدی عملکرد (KPIs)",
      ],
    },
    {
      title: "داشبوردها و سامانه‌های مدیریتی",
      description:
        "طراحی داشبوردهای هوشمند برای پایش لحظه‌ای پروژه‌ها و گزارش‌دهی متمرکز، به‌ویژه در حوزه حکمرانی داده.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" stroke-width="2" />

          <path
            d="M7 14l3-3 3 2 4-4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
      features: [
        "طراحی داشبوردهای پایش پروژه‌ها",
        "سامانه ارزیابی بلوغ دیجیتال سازمان‌ها",
        "داشبورد حکمرانی داده و گزارش‌دهی لحظه‌ای",
      ],
    },
    {
      title: "مطالعات تطبیقی و تدوین چارچوب حکمرانی داده",
      description:
        "بررسی و تحلیل مدل‌های جهانی حکمرانی داده و بومی‌سازی چارچوب‌های متناسب با نیازها و مقررات داخلی کشور (نظیر ایمیدرو).",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Back document */}
          <rect x="4" y="5" width="16" height="14" rx="2" strokeWidth={1.5} />

          {/* Front document */}
          <rect x="6" y="3" width="16" height="14" rx="2" strokeWidth={1.5} />

          {/* Top layer / framework line */}
          <line
            x1="8"
            y1="7"
            x2="16"
            y2="7"
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Middle layer / framework line */}
          <line
            x1="8"
            y1="10"
            x2="16"
            y2="10"
            strokeWidth={1.5}
            strokeLinecap="round"
          />

          {/* Bottom layer / framework line */}
          <line
            x1="8"
            y1="13"
            x2="14"
            y2="13"
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </svg>
      ),
      features: [
        "بررسی مدل‌های جهانی حکمرانی داده",
        "بومی‌سازی چارچوب متناسب با شرایط ایران",
      ],
    },
    {
      title: "تعریف و طراحی شاخص‌ها",
      description:
        "استخراج شاخص‌های کلیدی عملکرد (KPIs) و شاخص‌های کلیدی ریسک (KRIs) برای ارزیابی پروژه‌های دیجیتال و تدوین مدل‌های بلوغ دیجیتال.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer panel / container */}
          <rect x="3" y="4" width="18" height="16" rx="2" strokeWidth={1.5} />

          {/* Bar 1 */}
          <rect x="7" y="12" width="2" height="6" rx="0.5" strokeWidth={1.5} />

          {/* Bar 2 */}
          <rect x="11" y="9" width="2" height="9" rx="0.5" strokeWidth={1.5} />

          {/* Bar 3 */}
          <rect x="15" y="6" width="2" height="12" rx="0.5" strokeWidth={1.5} />
        </svg>
      ),
      features: [
        "استخراج KPIs و KRIs برای پروژه‌های دیجیتال",
        "استخراج KPIs و KRIs برای پروژه‌های دیجیتال",
      ],
    },
    {
      title: "مشاوره و راهبری تحول دیجیتال",
      description:
        "کمک به سازمان‌ها در تدوین نقشه‌راه دیجیتال و اطمینان از هم‌راستایی آن با مقررات بالادستی و استانداردهای بین‌المللی (GDPR, HIPAA).",
      icon: <Workflow className="w-6 h-6" />,
      features: [
        "کمک به سازمان‌ها برای نقشه‌راه دیجیتال",
        "هم‌راستاسازی با مقررات بالادستی و استانداردهای امنیتی",
      ],
    },
    {
      title: "امنیت داده و شبکه",
      description:
        "پیاده‌سازی سیاست‌های امنیتی سطح بالا برای حفاظت از زیرساخت و داده، همراه با مانیتورینگ مداوم و ممیزی‌های دوره‌ای.",
      icon: <GlobeLock className="w-6 h-6" />,
      features: [
        "پیاده‌سازی سیاست‌های امنیتی سطح بالا",
        "تست نفوذ، مانیتورینگ امنیتی، و ممیزی دوره‌ای",
      ],
    },
    {
      title: "انطباق با قوانین",
      description:
        "اطمینان از رعایت استانداردهای حفاظت از داده (شامل GDPR و مقررات داخلی) و طراحی سیاست‌های حفظ محرمانگی و حریم خصوصی.",
      icon: <Scale className="w-6 h-6" />,
      features: [
        "رعایت استانداردهای حفاظت از داده (GDPR، مقررات داخلی کشور)",
        "طراحی سیاست‌های حفظ محرمانگی و حریم خصوصی",
      ],
    },
    {
      title: "توسعه نرم‌افزار و ابزارها",
      description:
        "تولید سریع نمونه اولیه (Prototype/MVP) و توسعه ماژول‌های اختصاصی برای پایش، گزارش‌گیری، و ارزیابی عملکرد سامانه‌ها.",
      icon: <Terminal className="w-6 h-6" />,
      features: [
        "تولید نمونه اولیه (Prototype/MVP)",
        "توسعه ماژول‌های پایش، گزارش‌گیری، و ارزیابی",
      ],
    },
    {
      title: "آموزش و انتقال دانش",
      description:
        "برگزاری کارگاه‌های تحول دیجیتال و حکمرانی داده، و آموزش تخصصی تیم‌های داخلی کارفرما برای انتقال کامل دانش فنی.",
      icon: <Library className="w-6 h-6" />,
      features: [
        "آموزش تیم‌های داخلی کارفرما",
        "برگزاری کارگاه‌های تحول دیجیتال و حکمرانی داده",
      ],
    },
    {
      title: "پشتیبانی و نگهداری",
      description:
        "ارائه خدمات تضمین پایداری پلتفرم با تعریف SLA/SLO، همراه با ارتقا و توسعه مستمر سامانه‌های اجراشده.",
      icon: <Settings className="w-6 h-6" />,
      features: [
        "ارائه خدمات SLA/SLO برای پایداری پلتفرم",
        "ارتقا و توسعه مستمر سامانه‌ها",
      ],
    },
    {
      title: "مشاوره و تدوین راهبرد دیجیتال",
      description:
        "تحلیل وضعیت فعلی، شناسایی فرصت‌ها و تهدیدها، طراحی نقشه راه تحول سازمانی و فناوری",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
      ),
      features: [
        "تحلیل وضعیت فعلی سازمان",
        "شناسایی فرصت‌ها و تهدیدها",
        "طراحی نقشه راه تحول",
        "راهبرد فناوری اطلاعات",
      ],
    },
    {
      title: "توسعه پلتفرم‌های ابری و مدیریت داده‌های حجیم",
      description:
        "پیاده‌سازی نرم‌افزارهای اختصاصی، سامانه‌های سازمانی، و زیرساخت ابری با امنیت و مقیاس‌پذیری بالا",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
          />
        </svg>
      ),
      features: [
        "نرم‌افزارهای اختصاصی",
        "سامانه‌های سازمانی",
        "زیرساخت ابری امن",
        "مقیاس‌پذیری بالا",
      ],
    },
    {
      title: "راهکارهای اینترنت اشیا (IoT)",
      description:
        "اتصال سخت‌افزارها و سنسورها به پلتفرم‌های ابری، پیاده‌سازی معماری مایکروسرویس، جمع‌آوری و آنالیز داده‌های لحظه‌ای",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
      ),
      features: [
        "API های استاندارد MQTT، HTTP",
        "معماری مایکروسرویس",
        "داشبورد مانیتورینگ هوشمند",
        "آنالیز داده‌های لحظه‌ای",
      ],
    },
    {
      title: "طراحی و استقرار ساینیج دیجیتال",
      description:
        "اجرای سیستم‌های نمایشگر و ابزارهای تبلیغاتی برای فروشگاه‌ها، مراکز خرید و شرکت‌های مختلف با برند کاریزور",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      features: [
        "سیستم‌های نمایشگر تبلیغاتی",
        "مدیریت محتوای تبلیغاتی",
        "کمپین‌های هوشمند",
        "ارتباط برخط با مخاطب",
      ],
    },
    {
      title: "اتوماسیون صنعتی و کارخانه هوشمند",
      description:
        "طراحی و پیاده‌سازی نرم‌افزارهای مانیتورینگ، کنترل ماشین‌آلات، و واحدهای تولیدی",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      features: [
        "سیستم‌های هوش مصنوعی",
        "بهینه‌سازی فرآیندها",
        "پروتکل‌های ارتباطی API، Wi-Fi، LTE",
        "کنترل ماشین‌آلات",
      ],
    },
    {
      title: "امنیت اطلاعات و مدیریت ریسک فناوری",
      description:
        "پیاده‌سازی روش‌های رمزنگاری داده، احراز هویت کاربران، کنترل دسترسی و مدیریت امنیت سامانه‌های سازمانی",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      features: [
        "رمزنگاری داده",
        "احراز هویت کاربران",
        "کنترل دسترسی",
        "مانیتورینگ امنیت شبکه",
      ],
    },
    {
      title: "توسعه نرم‌افزار و اپلیکیشن‌های سفارشی",
      description:
        "طراحی بر اساس نیاز بازار و مشتریان، توسعه اپلیکیشن‌های موبایل و وب، داشبورد مدیریتی",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      ),
      features: [
        "اپلیکیشن‌های موبایل",
        "اپلیکیشن‌های وب",
        "داشبورد مدیریتی",
        "ابزارهای ویژه سازمانی",
      ],
    },
    {
      title: "پشتیبانی، آموزش، و ارتقاء سامانه‌ها",
      description:
        "ارائه خدمات پس از فروش، بروزرسانی پروژه‌های اجراشده، و آموزش تیم‌های مشتری",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
      features: [
        "خدمات پس از فروش",
        "بروزرسانی پروژه‌ها",
        "آموزش تیم‌های مشتری",
        "پشتیبانی فنی مستمر",
      ],
    },
  ];

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col">
      <PersianHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <h1 className="text-[#37322F] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                خدمات ما
              </h1>
              <p className="text-[#605A57] text-lg sm:text-xl leading-relaxed max-w-[800px] mx-auto">
                آتی ارتباطات ژی مجموعه‌ای کامل از خدمات تحول دیجیتال، نرم‌افزار
                و سخت‌افزار را برای کسب‌وکارهای ایرانی و بین‌المللی ارائه می‌کند
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-[#37322F] rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {service.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#37322F] text-xl font-semibold leading-tight mb-3">
                        {service.title}
                      </h3>
                      <p className="text-justify text-[#605A57] text-sm leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[rgba(55,50,47,0.12)] pt-6">
                    <h4 className="text-[#37322F] font-medium mb-3">
                      ویژگی‌های کلیدی:
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-start gap-2 text-sm text-[#605A57]"
                        >
                          <div className="w-1.5 h-1.5 bg-[#37322F] rounded-full flex-shrink-0 mt-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
                فرآیند همکاری
              </h2>
              <p className="text-[#605A57] text-lg leading-relaxed max-w-[600px] mx-auto">
                ما با یک فرآیند منظم و حرفه‌ای پروژه‌های شما را از ایده تا اجرا
                پیش می‌بریم
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  ۱
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-2">
                  مشاوره و تحلیل
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  بررسی نیازها و ارائه راهکار مناسب
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  ۲
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-2">
                  طراحی و برنامه‌ریزی
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  تدوین نقشه راه و معماری سیستم
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  ۳
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-2">
                  توسعه و پیاده‌سازی
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  اجرای پروژه با بالاترین کیفیت
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  ۴
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-2">
                  پشتیبانی و نگهداری
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  خدمات پس از فروش و بروزرسانی
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
                فناوری‌های مورد استفاده
              </h2>
              <p className="text-[#605A57] text-lg leading-relaxed max-w-[600px] mx-auto">
                ما از آخرین فناوری‌ها و ابزارهای روز دنیا برای ارائه بهترین
                خدمات استفاده می‌کنیم
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  {/* @ts-ignore */}
                  <FaDocker className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  Docker
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaServer className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  Kubernetes
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaWifi className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">MQTT</span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaLink className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">CoAP</span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaGlobe className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">HTTP</span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaNetworkWired className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  API Gateway
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaCogs className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  Microservices
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaCloud className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  Cloud Native
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaMicrochip className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">IoT</span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaBrain className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  AI/ML
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaDatabase className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  Big Data
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#F7F5F3] rounded-lg flex items-center justify-center mx-auto mb-3">
                  {/* @ts-ignore */}
                  <FaBitcoin className="w-6 h-6 text-[#37322F]" />
                </div>
                <span className="text-[#37322F] text-sm font-medium">
                  Blockchain
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-[#37322F] text-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6">
              پروژه خود را با ما شروع کنید
            </h2>
            <p className="text-lg leading-relaxed mb-8 opacity-90 max-w-[600px] mx-auto">
              تیم متخصص ما آماده ارائه مشاوره رایگان و طراحی راهکار مناسب برای
              کسب‌وکار شما است
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-3 bg-white text-[#37322F] rounded-full font-medium hover:bg-gray-100 transition-colors">
                <Link href={"/contact"}>مشاوره رایگان</Link>
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:text-[#37322F] transition-colors">
                <Link href={"/portfolio"}>مشاهده نمونه‌کارها</Link>
              </button>
            </div>
          </div>
        </section>
      </main>

      <PersianFooter />
    </div>
  );
}
