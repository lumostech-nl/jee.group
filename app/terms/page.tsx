import React from "react";
import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";
import type { Metadata } from "next";
import { generateMetadata } from "@/lib/seo";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Info,
  FileText,
  UserCheck,
  Shield,
  Lock,
  Ban,
  Scale,
  RefreshCcw,
  Mail,
  CreditCard,
  Copyright,
} from "lucide-react";

export const metadata: Metadata = generateMetadata({
  title: "شرایط استفاده | گروه ژی",
  description:
    "شرایط و ضوابط استفاده از خدمات، محصولات و پلتفرم‌های گروه ژی برای کاربران و مشتریان.",
  keywords: "شرایط استفاده, قوانین, ضوابط, ژی, Jee Group",
  url: process.env.NEXT_PUBLIC_SITE_URL
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/terms`
    : undefined,
  type: "website",
});

const sections = [
  { id: "overview", title: "مرور کلی" },
  { id: "acceptance", title: "پذیرش شرایط" },
  { id: "definitions", title: "تعاریف" },
  { id: "accounts", title: "حساب کاربری و دسترسی" },
  { id: "payments", title: "پرداخت‌ها و اشتراک‌ها" },
  { id: "usage", title: "الزامات و استفاده مجاز" },
  { id: "prohibited", title: "فعالیت‌های ممنوع" },
  { id: "ip", title: "مالکیت فکری" },
  { id: "privacy-security", title: "حریم خصوصی و امنیت" },
  { id: "warranty", title: "عدم ضمانت" },
  { id: "liability", title: "محدودیت مسئولیت" },
  { id: "termination", title: "تعلیق و خاتمه" },
  { id: "law", title: "قانون حاکم و حل اختلاف" },
  { id: "changes", title: "تغییرات در شرایط" },
  { id: "contact", title: "ارتباط با ما" },
];

const TOC = dynamic(() => import("@/components/privacy/toc"), { ssr: false });

const TermsOfServicesPage = () => {
  const updatedAt = new Date().toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="w-full min-h-screen bg-[#F7F5F3] flex flex-col">
      <PersianHeader />

      <main className="w-full flex-1">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] mx-auto py-10 sm:py-12 md:py-16">
          <div className="flex items-center justify-between border-b border-[rgba(55,50,47,0.12)] pb-6 mb-8">
            <h1 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-bold">
              شرایط استفاده
            </h1>
            <div className="text-[#605A57] text-sm">
              آخرین به‌روزرسانی: {updatedAt}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-[rgba(55,50,47,0.12)] bg-white p-4">
                <div className="text-[#37322F] font-semibold mb-3">فهرست</div>
                <TOC sections={sections} />
              </div>
            </aside>

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
                  این سند شرایط و ضوابط استفاده از خدمات، محصولات و پلتفرم‌های
                  آتی ارتباطات ژی را مشخص می‌کند. با دسترسی یا استفاده از خدمات،
                  شما با این شرایط موافقت می‌کنید.
                </p>
              </div>

              <div
                id="acceptance"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#37322F]" aria-hidden />
                  پذیرش شرایط
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  استفاده از خدمات، به منزلهٔ پذیرش کامل این شرایط و سیاست‌های
                  تکمیلی از جمله{" "}
                  <Link
                    href="/privacy"
                    className="text-[#37322F] underline mx-1"
                  >
                    حریم خصوصی
                  </Link>
                  است. اگر با هر بخشی موافق نیستید، لطفاً از خدمات استفاده
                  نکنید.
                </p>
              </div>

              <div
                id="definitions"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#37322F]" aria-hidden />
                  تعاریف
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>
                    «خدمات»: هر آنچه توسط ژی ارائه می‌شود، اعم از نرم‌افزار، API
                    و پشتیبانی.
                  </li>
                  <li>
                    «کاربر»: هر شخصی که به خدمات دسترسی داشته یا از آن استفاده
                    می‌کند.
                  </li>
                  <li>
                    «مشتری»: شخص حقیقی/حقوقی دارای قرارداد یا اشتراک فعال.
                  </li>
                </ul>
              </div>

              <div
                id="accounts"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#37322F]" aria-hidden />
                  حساب کاربری و دسترسی
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>
                    شما مسئول حفظ محرمانگی اطلاعات ورود و فعالیت‌های حساب خود
                    هستید.
                  </li>
                  <li>ارائه اطلاعات صحیح و به‌روز هنگام ثبت‌نام الزامی است.</li>
                  <li>
                    دسترسی‌ها ممکن است بر اساس نقش و سیاست‌های امنیتی محدود شود.
                  </li>
                </ul>
              </div>

              <div
                id="payments"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#37322F]" aria-hidden />
                  پرداخت‌ها و اشتراک‌ها
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>
                    هزینه‌ها طبق طرح‌های مصوب و فاکتورهای صادره دریافت می‌شود.
                  </li>
                  <li>
                    عدم پرداخت به‌موقع می‌تواند به تعلیق یا خاتمهٔ سرویس منجر
                    شود.
                  </li>
                  <li>
                    شرایط بازپرداخت (در صورت اعمال) مطابق قرارداد/صورتحساب است.
                  </li>
                </ul>
              </div>

              <div
                id="usage"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#37322F]" aria-hidden />
                  الزامات و استفاده مجاز
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>
                    رعایت قوانین مرتبط، حقوق اشخاص ثالث و سیاست‌های امنیتی
                    الزامی است.
                  </li>
                  <li>
                    مصرف منصفانه منابع و رعایت حدود تعیین‌شده بخشی از شرایط
                    خدمات است.
                  </li>
                  <li>
                    مسئولیت داده‌های بارگذاری‌شده و خروجی‌های تولیدی بر عهدهٔ
                    شماست.
                  </li>
                </ul>
              </div>

              <div
                id="prohibited"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Ban className="w-5 h-5 text-[#37322F]" aria-hidden />
                  فعالیت‌های ممنوع
                </h2>
                <ul className="list-disc pr-6 text-[#605A57] leading-8 text-sm sm:text-base">
                  <li>
                    سوءاستفاده، حملات امنیتی، مهندسی معکوس، اسپم یا نقض حقوق
                    مالکیت.
                  </li>
                  <li>
                    استفاده خارج از چارچوب مجوز، اشتراک‌گذاری غیرمجاز یا دورزدن
                    محدودیت‌ها.
                  </li>
                  <li>استفاده برای اهداف غیرقانونی یا نقض حقوق سایرین.</li>
                </ul>
              </div>

              <div id="ip" className="space-y-3 scroll-mt-28 md:scroll-mt-32">
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Copyright className="w-5 h-5 text-[#37322F]" aria-hidden />
                  مالکیت فکری
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  کلیهٔ حقوق مالکیت فکری مرتبط با خدمات، علائم تجاری، محتوا و
                  کدهای منبع متعلق به ژی یا اعطا شده تحت مجوزهای معتبر است. هیچ
                  حقی جز آنچه به‌صراحت اعطا شده، به شما منتقل نمی‌شود.
                </p>
              </div>

              <div
                id="privacy-security"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Lock className="w-5 h-5 text-[#37322F]" aria-hidden />
                  حریم خصوصی و امنیت
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  پردازش داده‌ها مطابق سیاست{" "}
                  <Link
                    href="/privacy"
                    className="text-[#37322F] underline mx-1"
                  >
                    حریم خصوصی
                  </Link>
                  انجام می‌شود. ما اقدامات امنیتی متناسبی برای حفاظت از داده‌ها
                  اتخاذ می‌کنیم.
                </p>
              </div>

              <div
                id="warranty"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#37322F]" aria-hidden />
                  عدم ضمانت
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  خدمات «همان‌گونه که هست» ارائه می‌شوند و هیچ‌گونه ضمانت صریح
                  یا ضمنی از جمله قابلیت فروش، تناسب برای هدف خاص یا عدم نقض را
                  شامل نمی‌شوند.
                </p>
              </div>

              <div
                id="liability"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#37322F]" aria-hidden />
                  محدودیت مسئولیت
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  در حدود مجاز قوانین قابل اعمال، ژی و وابستگانش تحت هیچ شرایطی
                  در قبال خسارات غیرمستقیم، اتفاقی، ویژه، تبعی یا از دست‌رفتن
                  سود مسئول نخواهند بود.
                </p>
              </div>

              <div
                id="termination"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <RefreshCcw className="w-5 h-5 text-[#37322F]" aria-hidden />
                  تعلیق و خاتمه
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  ما می‌توانیم در صورت نقض شرایط یا الزامات قانونی، دسترسی شما
                  را معلق یا خاتمه دهیم. شما نیز می‌توانید هر زمان با قطع
                  استفاده و تسویه تعهدات، حساب خود را خاتمه دهید.
                </p>
              </div>

              <div id="law" className="space-y-3 scroll-mt-28 md:scroll-mt-32">
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <Scale className="w-5 h-5 text-[#37322F]" aria-hidden />
                  قانون حاکم و حل اختلاف
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  تفسیر و اجرای این شرایط تابع قوانین قابل اعمال در حوزهٔ قضایی
                  تعیین‌شده در قراردادهای مربوطه است. روش حل اختلاف می‌تواند
                  مذاکره، داوری یا مراجع صالح قضایی باشد.
                </p>
              </div>

              <div
                id="changes"
                className="space-y-3 scroll-mt-28 md:scroll-mt-32"
              >
                <h2 className="text-[#37322F] text-xl md:text-2xl font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#37322F]" aria-hidden />
                  تغییرات در شرایط
                </h2>
                <p className="text-[#605A57] leading-8 text-sm sm:text-base">
                  ممکن است این شرایط را به‌روزرسانی کنیم. تغییرات مهم از طریق
                  وب‌سایت یا اعلان‌های مناسب اطلاع‌رسانی می‌شود. ادامهٔ استفاده
                  به منزلهٔ پذیرش نسخهٔ به‌روزشده است.
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
                  برای سوالات مرتبط با این شرایط، از طریق صفحه
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

export default TermsOfServicesPage;
