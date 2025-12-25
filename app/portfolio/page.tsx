import { PersianHeader } from "../../components/persian-header";
import { PersianFooter } from "../../components/persian-footer";
import Link from "next/link";

export default function PortfolioPage() {
  const projects = [
    {
      title: "پلتفرم ابری مدیریت یکپارچه نمایشگرهای تبلیغاتی",
      description:
        "سامانه حرفه‌ای برای مدیریت متمرکز و هوشمند نمایشگرهای دیجیتال تبلیغاتی، با پوشش کامل از سخت‌افزار تا محتوای چندرسانه‌ای و گزارش‌دهی بی‌وقفه، مناسب برای سازمان‌ها، فروشگاه‌ها و مراکز خدماتی.",
      technologies: [
        "Android Box",
        "Smart TV",
        "Windows",
        "Linux",
        "Local Caching",
        "Snapshot Monitoring",
        "POS Integration",
        "RSS",
        "Social Media Sync",
        "Open API",
        "Proof-of-Play",
        "Content Analytics",
        "Encryption",
        "Digital Certificate Management",
      ],
      image: "portfolioImages/digital-signage.jpeg",
      results: [
        "کاهش هزینه‌های عملیاتی با مدیریت متمرکز نمایشگرها",
        "افزایش اثربخشی کمپین‌های تبلیغاتی با زمان‌بندی هوشمند",
        "کنترل سلامت و عملکرد نمایشگرها از راه دور",
        "ادغام آسان با سیستم‌های فروشگاهی و سازمانی",
        "شفافیت در گزارش‌دهی و اثبات پخش محتوا",
        "مدیریت چندشعبه‌ای با حداقل نیاز به نیروی انسانی",
      ],

      year: 2022,
      category: "Digital Signage Platform",
    },
    {
      title: "پلتفرم ابری پخش موسیقی",
      description:
        "بزرگ‌ترین سرویس بومی پخش موسیقی آنلاین با بیش از ۵۰۰ هزار کاربر و ارائه رسمی بیش از ۷۰ هزار قطعه موسیقی، با همکاری اپراتورهای برتر و پشتیبانی حقوقی از موسیقی‌دانان ایرانی.",
      technologies: [
        "Streaming",
        "Offline Download",
        "Smart Recommendation Engine",
        "Playlist Automation",
        "Web Client",
        "Mobile Client",
        "Content Licensing",
        "Publisher Settlement System",
        "Audio/Visual Advertising",
        "Subscription Management",
      ],
      image: "/portfolioImages/tapsong.jpeg",
      results: [
        "دسترسی قانونی و سریع به موسیقی با کیفیت‌های مختلف",
        "افزایش تعامل کاربران با پیشنهاد هوشمند و پلی‌لیست‌های خودکار",
        "شفافیت در تسویه حقوق ناشران و صاحبان اثر",
        "درآمدزایی از طریق تبلیغات و فروش اشتراک",
        "پشتیبانی از اپراتورها و سازمان‌ها با بسته‌های ویژه",
        "تجربه کاربری یکپارچه روی موبایل و دسکتاپ",
      ],

      year: 2021,
      category: "Music Streaming Platform",
    },
    {
      title: "پلتفرم کتابخانه آنلاین",
      description:
        "اولین سامانه کتابخانه آنلاین با بیش از ۶۰۰ هزار عضو و ۱۰ هزار عنوان کتاب، با قابلیت مطالعه آنلاین و آفلاین، پیشنهاد هوشمند کتاب، و داشبورد مدیریتی ویژه سازمان‌ها و مدارس.",
      technologies: [
        "EPUB",
        "PDF",
        "Highlighting",
        "Note-taking",
        "Device Sync",
        "Recommendation Engine",
        "Web App",
        "Mobile App",
        "Usage Dashboard",
        "Content Personalization",
      ],
      image: "/portfolioImages/ketap.png",
      results: [
        "افزایش زمان مطالعه با ابزارهای تعاملی و همگام‌سازی",
        "پیشنهاد کتاب‌های مناسب براساس علائق و سبک خواندن",
        "دسترسی به مجلات و ویژه‌نامه‌ها در کنار کتاب‌ها",
        "مدیریت مصرف و گزارش‌گیری برای مدارس و سازمان‌ها",
        "مطالعه قانونی و آسان در قالب‌های متنی و تصویری",
        "پشتیبانی از مطالعه آفلاین و تجربه کاربری روان",
      ],

      year: 2023,
      category: "Digital Library Platform",
    },
    {
      title: "پلتفرم آموزش زبان انگلیسی",
      description:
        "سرویس کامل آموزش زبان انگلیسی با قابلیت‌های تعاملی و شخصی‌سازی، الهام‌گرفته از تجربه کاربری اپلیکیشن‌هایی همچون Duolingo، Babbel و Elsa، مناسب کاربران فردی و سازمانی از سطح مبتدی تا آمادگی آزمون‌های تخصصی.",
      technologies: [
        "Adaptive Testing",
        "IELTS Simulator",
        "Learning Calendar",
        "Listening/Speaking/Writing Practice",
        "Fast Feedback Engine",
        "Content Personalization",
        "Web Client",
        "Mobile Client",
        "Progress Tracking",
        "Multilingual Support",
        "Organizational Customization",
      ],
      image: "/portfolioImages/zaban-plus.png",
      results: [
        "آموزش زبان انگلیسی با مسیر یادگیری شخصی‌سازی‌شده",
        "پوشش کامل مهارت‌های زبانی با تمرین‌های تعاملی",
        "آمادگی برای آزمون‌های بین‌المللی با شبیه‌ساز IELTS",
        "پشتیبانی از زبان فارسی و نیازهای سازمانی مانند ایرانسل",
        "ردیابی پیشرفت و شناخت سطح زبان‌آموز به‌صورت تطبیقی",
        "تجربه کاربری روان و یکپارچه روی موبایل و وب",
      ],

      year: 2022,
      category: "Language Learning Platform",
    },
    {
      title: "پلتفرم ابری ویدئو درخواستی (VOD) و IPTV",
      description:
        "سامانه برای استقرار سریع سرویس‌های ویدئوی درخواستی، مناسب اپراتورها، شرکت‌های مخابراتی و ناشران محتوا، با زنجیره کامل تولید، توزیع، و مدیریت مشترکین و تبلیغات.",
      technologies: [
        "Adaptive Bitrate Streaming",
        "HLS",
        "DASH",
        "DRM",
        "Live Broadcasting",
        "Subscriber Management",
        "Content Marketing Tools",
        "Advertising Management",
        "CDN Integration",
        "Secure Video Delivery",
      ],
      image: "/portfolioImages/abr-arvan.webp",
      results: [
        "استقرار سریع سرویس‌های VOD و IPTV برای اپراتورها و ناشران محتوا",
        "پخش زنده و درخواستی با کیفیت تطبیقی و امنیت DRM",
        "مدیریت کامل کاربران، محتوا و تبلیغات از یک پنل متمرکز",
        "افزایش درآمد از طریق بازاریابی هدفمند و تبلیغات درون‌ویدیویی",
        "پشتیبانی از پروژه‌های داخلی و بین‌المللی با مقیاس‌پذیری بالا",
        "یکپارچگی با CDN برای تحویل سریع و پایدار محتوا",
      ],

      year: 2021,
      category: "Cloud VOD/IPTV Platform",
    },
    {
      title: "پلتفرم ابری اینترنت اشیا",
      description:
        "پلتفرم ابری انتها به انتها، ویژه خدمات عمودی مانند ردیابی، مانیتورینگ ایستگاه‌های گاز، سامانه کنتورهای هوشمند و آلرتینگ، با امنیت و مقیاس‌پذیری سازمانی.",
      technologies: [
        "Digital Twin",
        "Real-time Command & Control",
        "Visual Analytics",
        "Multi-channel Alerts",
        "Device Provisioning",
        "Fleet Management",
        "Encryption",
        "Component Isolation",
        "Audit Logging",
        "Responsive Dashboard",
        "API Integration",
      ],
      image: "/portfolioImages/internet-ashia.png",
      results: [
        "مدیریت بلادرنگ ناوگان دستگاه‌های IoT با امنیت سطح سازمانی",
        "تحلیل داده‌ها و هشدارهای چندکاناله از طریق داشبورد تعاملی",
        "پشتیبانی از خدمات عمودی مانند مانیتورینگ گاز و ردیابی",
        "ثبت انبوه و پروویژن سریع دستگاه‌ها با Digital Twin",
        "تفکیک کامل اجزای سامانه برای افزایش پایداری و امنیت",
        "ارائه API برای توسعه سرویس‌های سفارشی و یکپارچه",
      ],

      year: 2022,
      category: "IoT Cloud Platform",
    },
    {
      title: "سامانه هوشمند مدیریت آلارم",
      description:
        "سامانه جامع برای مجتمع‌های مسکونی و تجاری با پوشش انواع هشدار (حریق، نشت، تهاجم) و مرکز مانیتورینگ متمرکز با قابلیت کنترل واکنش و مستندسازی رخدادها، مناسب برای افزایش ایمنی و کاهش زمان پاسخ‌گویی.",
      technologies: [
        "Fire/Gas/Intrusion Sensors",
        "Centralized Monitoring",
        "Event Logging",
        "Incident Documentation",
        "Secure Gateway Communication",
        "Multi-zone Configuration",
        "Offline Buffering",
        "Real-time Sync",
        "Audit Trail",
        "Building System Integration",
      ],
      image: "/portfolioImages/alarm-management.png",
      results: [
        "افزایش ایمنی مجتمع‌ها با پوشش کامل هشدارهای حیاتی",
        "کاهش زمان واکنش به حوادث با مرکز مانیتورینگ متمرکز",
        "کنترل و مستندسازی دقیق رخدادها با ثبت شواهد",
        "پایداری ارتباطی با بافرینگ آفلاین و همگام‌سازی پس از اتصال",
        "امکان اتصال به سامانه‌های ساختمانی و مدیریت تسهیلات",
        "افزایش شفافیت عملکرد با ممیزی و گزارش‌های دوره‌ای",
      ],

      year: 2020,
      category: "Smart Alarm Management System",
    },
    {
      title: "آزمایشگاه VR/AR",
      description:
        "اولین سیستم بومی پردازش و پخش زنده تصاویر واقعیت مجازی ۳۶۰ درجه، مناسب صنعت رویداد، آموزش و گردشگری، با پشتیبانی انتشار زنده روی موبایل و هدست‌های VR.",
      technologies: [
        "360° Video Processing",
        "Real-time Stitching",
        "Mobile Streaming",
        "VR Headset Streaming",
        "Gyroscope Integration",
        "Live Event Capture",
        "Color Correction",
        "Low-latency Delivery",
        "Modular Architecture",
        "GPU Acceleration",
      ],
      image: "/portfolioImages/vr-lab.png",
      results: [
        "پوشش زنده رویدادها با واقعیت مجازی ۳۶۰ درجه",
        "انتشار همزمان روی موبایل و هدست‌های VR",
        "افزایش تعامل در آموزش و گردشگری از راه دور",
        "تولید محتوای با کیفیت بالا با پردازش GPU و تصحیح رنگ",
        "پشتیبانی از تجربه تعاملی با سنسور ژیروسکوپ",
        "استفاده در پروژه‌های داخلی و بین‌المللی با معماری ماژولار",
      ],

      year: 2020,
      category: "VR/AR Media Platform",
    },
  ];

  const stats = [
    { number: "۵۰+", label: "پروژه موفق" },
    { number: "۱۰۰+", label: "مشتری راضی" },
    { number: "۵", label: "سال تجربه" },
    { number: "۲۰+", label: "متخصص" },
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
                نمونه‌کارها و پروژه‌ها
              </h1>
              <p className="text-[#605A57] text-lg sm:text-xl leading-relaxed max-w-[800px] mx-auto">
                مجموعه‌ای از پروژه‌های موفق ما در حوزه‌های مختلف تحول دیجیتال،
                اینترنت اشیا و نرم‌افزارهای سازمانی
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-[#37322F] mb-2">
                    {stat.number}
                  </div>
                  <div className="text-[#605A57] text-sm sm:text-base">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-[#37322F] text-white text-xs rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-[#37322F] text-xl font-semibold leading-tight">
                        {project.title}
                      </h3>
                      <span className="text-[#605A57] text-sm">
                        {project.year}
                      </span>
                    </div>

                    <p className="text-[#605A57] text-sm leading-relaxed mb-4">
                      {project.description}
                    </p>

                    <div className="mb-4">
                      <h4 className="text-[#37322F] font-medium mb-2">
                        فناوری‌های استفاده شده:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-[#F7F5F3] text-[#37322F] text-xs rounded border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-[#37322F] font-medium mb-2">
                        نتایج حاصل:
                      </h4>
                      <ul className="space-y-1">
                        {project.results.map((result, resultIndex) => (
                          <li
                            key={resultIndex}
                            className="flex items-center gap-2 text-sm text-[#605A57]"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></div>
                            {result}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Karizor Showcase */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
                برند کاریزور (Karizor.com)
              </h2>
              <p className="text-[#605A57] text-lg leading-relaxed max-w-[600px] mx-auto">
                یکی از محصولات پیشرو ما در حوزه ساینیج دیجیتال و تبلیغات هوشمند
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-[#37322F] text-2xl font-semibold mb-6">
                  ویژگی‌های کلیدی کاریزور
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#37322F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-[#37322F] font-medium mb-1">
                        مدیریت متمرکز محتوا
                      </h4>
                      <p className="text-[#605A57] text-sm">
                        کنترل و مدیریت تمام نمایشگرها از یک پنل واحد
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#37322F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-[#37322F] font-medium mb-1">
                        کمپین‌های هوشمند
                      </h4>
                      <p className="text-[#605A57] text-sm">
                        زمان‌بندی و هدف‌گذاری دقیق تبلیغات
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#37322F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-[#37322F] font-medium mb-1">
                        تحلیل‌های پیشرفته
                      </h4>
                      <p className="text-[#605A57] text-sm">
                        گزارش‌گیری دقیق از عملکرد و تعامل مخاطبان
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-[#37322F] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <h4 className="text-[#37322F] font-medium mb-1">
                        زیرساخت ابری
                      </h4>
                      <p className="text-[#605A57] text-sm">
                        مقیاس‌پذیری و دسترسی از هر نقطه
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#F7F5F3] rounded-lg p-8">
                <div className="aspect-video bg-white rounded-lg mb-6 flex items-center justify-center">
                  <img
                    src="/karizor-admin.png"
                    alt="رابط کاربری کاریزور"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-[#37322F] text-lg font-semibold mb-2">
                    پنل مدیریت کاریزور
                  </h4>
                  <p className="text-[#605A57] text-sm mb-4">
                    رابط کاربری ساده و قدرتمند برای مدیریت کمپین‌ها
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
                نظرات مشتریان
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#605A57] text-sm leading-relaxed mb-4">
                  "پلتفرم اینترنت اشیا که برای ما طراحی کردند، کیفیت تولید ما را
                  به طور چشمگیری بهبود داد. تیم حرفه‌ای و پشتیبانی عالی."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#37322F] rounded-full flex items-center justify-center text-white font-medium">
                    ا.ر
                  </div>
                  <div>
                    <div className="text-[#37322F] font-medium text-sm">
                      احمد رضایی
                    </div>
                    <div className="text-[#605A57] text-xs">
                      مدیر فنی شرکت پارس
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#605A57] text-sm leading-relaxed mb-4">
                  "سیستم مدیریت انبار آن‌ها واقعاً انقلابی بود. خطاهای انسانی به
                  حداقل رسید و سرعت عملیات چندین برابر شد."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#37322F] rounded-full flex items-center justify-center text-white font-medium">
                    م.ک
                  </div>
                  <div>
                    <div className="text-[#37322F] font-medium text-sm">
                      مریم کریمی
                    </div>
                    <div className="text-[#605A57] text-xs">
                      مدیر عملیات گروه آسیا
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#605A57] text-sm leading-relaxed mb-4">
                  "کاریزور تبلیغات ما را متحول کرد. حالا می‌توانیم به راحتی
                  کمپین‌هایمان را مدیریت کنیم و نتایج فوق‌العاده‌ای داریم."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#37322F] rounded-full flex items-center justify-center text-white font-medium">
                    ع.م
                  </div>
                  <div>
                    <div className="text-[#37322F] font-medium text-sm">
                      علی محمدی
                    </div>
                    <div className="text-[#605A57] text-xs">
                      مدیر بازاریابی رفاه
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-[#37322F] text-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6">
              پروژه بعدی شما را شروع کنیم؟
            </h2>
            <p className="text-lg leading-relaxed mb-8 opacity-90 max-w-[600px] mx-auto">
              با تجربه موفق در پروژه‌های مختلف، آماده همکاری با شما برای تحقق
              اهداف دیجیتال‌تان هستیم
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-3 bg-white text-[#37322F] rounded-full font-medium hover:bg-gray-100 transition-colors">
                <Link href={"/contact"}>شروع پروژه</Link>
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:text-[#37322F] transition-colors">
                <Link href={"/contact"}>مشاوره رایگان</Link>
              </button>
            </div>
          </div>
        </section>
      </main>

      <PersianFooter />
    </div>
  );
}
