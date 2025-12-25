import React from "react";
import { PersianHeader } from "../../components/persian-header";
import { PersianFooter } from "../../components/persian-footer";
import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  Info,
  Database,
  FileText,
  Shield,
  Share2,
  Lock,
  UserCheck,
  Cookie,
  Mail,
} from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "حریم خصوصی | گروه ژی",
  description:
    "سیاست‌های حریم خصوصی گروه ژی در خصوص جمع‌آوری، استفاده و نگهداری از داده‌های کاربران و مشتریان.",
  keywords: "حریم خصوصی, حفاظت از داده, امنیت, ژی, Jee Group",
  url: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/privacy`
    : undefined,
  type: "website",
});

const sections = [
  { id: "overview", title: "مرور کلی" },
  { id: "data-we-collect", title: "چه داده‌هایی جمع‌آوری می‌کنیم" },
  { id: "how-we-use", title: "نحوه استفاده از داده‌ها" },
  { id: "legal-bases", title: "مبانی قانونی پردازش" },
  { id: "sharing", title: "اشتراک‌گذاری با اشخاص ثالث" },
  { id: "security", title: "امنیت و نگهداری" },
  { id: "your-rights", title: "حقوق شما" },
  { id: "cookies", title: "کوکی‌ها و فناوری‌های مشابه" },
  { id: "contact", title: "ارتباط با ما" },
];

const TOC = dynamic(() => import("@/components/privacy/toc"), { ssr: false });

const PrivacyPage = () => {
  const updatedAt = new Date().toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // TOC interactions handled in client component

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] flex flex-col">
      <PersianHeader />

      <main className="w-full flex-1">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] mx-auto py-10 sm:py-12 md:py-16">
          {/* Top meta row */}
          <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] pb-6 mb-8">
            <h1 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-bold">
              حریم خصوصی
            </h1>
            <div className="text-[#605A57] text-sm">
              آخرین به‌روزرسانی: {updatedAt}
            </div>
          </div>

          {/* Content layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-[rgba(55,50,47,0.12)] bg-white p-4">
                <div className="text-[#37322F] font-semibold mb-3">فهرست</div>
                <TOC sections={sections} />
              </div>
            </aside>

            {/* Main content */}
            <section className="bg-white rounded-lg border border-[rgba(55,50,47,0.12)] p-5 sm:p-6 md:p-8 space-y-10">
              <div
                id="overview"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#37322F]" aria-hidden />
                  مرور کلی
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  ما در گروه ژی به حفاظت از حریم خصوصی شما متعهدیم. این سیاست
                  توضیح می‌دهد چه اطلاعاتی را جمع‌آوری می‌کنیم، چگونه از آن‌ها
                  استفاده می‌کنیم و چه گزینه‌هایی برای کنترل داده‌هایتان دارید.
                </p>
              </div>

              <div
                id="data-we-collect"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Database className="w-5 h-5 text-[#37322F]" aria-hidden />
                  چه داده‌هایی جمع‌آوری می‌کنیم
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>اطلاعات هویتی مانند نام، ایمیل، شماره تماس</li>
                  <li>اطلاعات حساب و احراز هویت برای ورود امن</li>
                  <li>لاگ‌های فنی، IP و داده‌های تشخیصی برای بهبود کیفیت</li>
                  <li>ترجیحات کاربری، تنظیمات داشبورد و اعلان‌ها</li>
                  <li>اطلاعات تراکنشی مرتبط با خدمات سفارشی</li>
                </ul>
              </div>

              <div
                id="how-we-use"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#37322F]" aria-hidden />
                  نحوه استفاده از داده‌ها
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>ارائه و نگهداری سرویس‌های پلتفرمی و ابری</li>
                  <li>بهبود تجربه کاربری و عملکرد محصولات</li>
                  <li>امنیت، پیشگیری از سوءاستفاده و مدیریت ریسک</li>
                  <li>برقراری ارتباطات پشتیبانی و اطلاع‌رسانی‌های ضروری</li>
                  <li>رعایت تعهدات قانونی و قراردادی</li>
                </ul>
              </div>

              <div
                id="legal-bases"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#37322F]" aria-hidden />
                  مبانی قانونی پردازش
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  پردازش داده‌ها ممکن است مبتنی بر اجرای قرارداد، رضایت شما،
                  منافع مشروع یا الزامات قانونی باشد. در صورت اتکا به رضایت،
                  امکان لغو آن در هر زمان برای شما فراهم است.
                </p>
              </div>

              <div
                id="sharing"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#37322F]" aria-hidden />
                  اشتراک‌گذاری با اشخاص ثالث
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  ممکن است برای میزبانی، ذخیره‌سازی، تحلیل یا ارسال اعلان‌ها از
                  ارائه‌دهندگان خدمات مطمئن استفاده کنیم. این طرف‌ها صرفاً بر
                  اساس قرارداد و برای اهداف مشخص به داده‌ها دسترسی دارند.
                </p>
              </div>

              <div
                id="security"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#37322F]" aria-hidden />
                  امنیت و نگهداری
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>رمزنگاری در حال انتقال و در حالت سکون بر حسب نیاز</li>
                  <li>کنترل دسترسی مبتنی بر نقش و ثبت رخدادها</li>
                  <li>پشتیبان‌گیری و بازیابی در سطوح سرویس تعریف‌شده</li>
                  <li>حفظ داده‌ها تا زمانی که برای اهداف جمع‌آوری لازم باشد</li>
                </ul>
              </div>

              <div
                id="your-rights"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#37322F]" aria-hidden />
                  حقوق شما
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>دسترسی، تصحیح یا حذف اطلاعات شخصی</li>
                  <li>محدودسازی یا اعتراض به پردازش</li>
                  <li>دریافت نسخه قابل‌انتقال از داده‌ها (در صورت امکان)</li>
                  <li>ثبت شکایت نزد مراجع ذی‌صلاح</li>
                </ul>
              </div>

              <div
                id="cookies"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Cookie className="w-5 h-5 text-[#37322F]" aria-hidden />
                  کوکی‌ها و فناوری‌های مشابه
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  از کوکی‌ها برای حفظ نشست کاربری، شخصی‌سازی تجربه و تحلیل
                  استفاده می‌کنیم. می‌توانید از طریق تنظیمات مرورگر، کوکی‌ها را
                  مدیریت کنید؛ با این حال ممکن است برخی قابلیت‌ها محدود شود.
                </p>
              </div>

              <div
                id="contact"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#37322F]" aria-hidden />
                  ارتباط با ما
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  برای سوالات مربوط به این سیاست، از طریق صفحه{" "}
                  <Link
                    href="/contact"
                    className="text-[#37322F] underline mx-1"
                  >
                    تماس با ما
                  </Link>
                  با تیم پشتیبانی در ارتباط باشید.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <PersianFooter />
    </div>
  );
};

export default PrivacyPage;
