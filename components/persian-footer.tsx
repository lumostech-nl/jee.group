import Link from "next/link";
import { Linkedin } from "lucide-react";

export function PersianFooter() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "خدمات",
      links: [
        { title: "مشاوره دیجیتال", href: "/services#consulting" },
        { title: "پلتفرم‌های ابری", href: "/services#cloud" },
        { title: "اینترنت اشیا", href: "/services#iot" },
        { title: "اتوماسیون صنعتی", href: "/services#automation" },
      ],
    },
    {
      title: "راه‌حل‌ها",
      links: [
        { title: "محیط ابری", href: "/solutions#cloud" },
        { title: "داده‌کاوی", href: "/solutions#data" },
        { title: "امنیت اطلاعات", href: "/solutions#security" },
        { title: "API Gateway", href: "/solutions#api" },
      ],
    },
    {
      title: "شرکت",
      links: [
        { title: "درباره ما", href: "/about" },
        { title: "نمونه‌کارها", href: "/portfolio" },
        { title: "صنایع تحت پوشش", href: "/industries" },
        { title: "نظرات مشتریان", href: "/testimonials" },
      ],
    },
    {
      title: "منابع",
      links: [
        { title: "وبلاگ و دیدگاه‌ها", href: "/blog" },
        { title: "فرصت‌های شغلی", href: "/careers" },
        { title: "تماس با ما", href: "/contact" },
        { title: "پشتیبانی فنی", href: "/contact" },
      ],
    },
  ];

  return (
    <footer className="w-full bg-[#37322f] text-white">
      <div className="max-w-[1060px] mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/jee-logo.png"
                alt="ژی"
                className="h-8 w-auto border border-white/20 rounded-lg"
              />
              <h3 className="text-xl font-bold">آتی ارتباطات ژی</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">
              متخصص در طراحی، توسعه و پیاده‌سازی راهکارهای تحول دیجیتال، فناوری
              ابری و اینترنت اشیا
            </p>
            <div className="flex space-x-reverse space-x-4">
              <a
                href="https://linkedin.com/company/your-company"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-white text-sm transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © {currentYear} آتی ارتباطات ژی. تمامی حقوق محفوظ است.
            </div>
            <div className="flex space-x-reverse space-x-6">
              <Link
                href="/privacy"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                حریم خصوصی
              </Link>
              <Link
                href="/terms"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                شرایط استفاده
              </Link>
              <Link
                href="/cookies"
                className="text-gray-300 hover:text-white text-sm transition-colors"
              >
                کوکی‌ها
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
