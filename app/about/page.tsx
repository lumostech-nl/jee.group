import { PersianHeader } from "../../components/persian-header";
import { PersianFooter } from "../../components/persian-footer";
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col">
      <PersianHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <h1 className="text-[#37322F] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                درباره آتی ارتباطات ژی
              </h1>
              <p className="text-[#605A57] text-lg sm:text-xl leading-relaxed max-w-[800px] mx-auto">
                یک مجموعه با تمرکز بر طراحی، توسعه، و پیاده‌سازی راهکارهای تحول
                دیجیتال، فناوری ابری و اینترنت اشیا در صنایع مختلف
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6">
                  ماموریت ما
                </h2>
                <p className="text-[#605A57] text-base sm:text-lg leading-relaxed mb-6">
                  ارتقای بهره‌وری و هوشمندسازی کسب‌وکارها با استفاده از آخرین
                  نوآوری‌های فناوری و دانش تخصصی است.
                </p>
                <p className="text-[#605A57] text-base sm:text-lg leading-relaxed">
                  ما متعهد به توسعه فناوری‌های جدید و ارزش‌آفرینی پایدار برای
                  صنایع ایرانی هستیم.
                </p>
              </div>
              <div className="bg-white rounded-lg p-8 shadow-sm">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#37322F] mb-2">
                      ۱۰+
                    </div>
                    <div className="text-sm text-[#605A57]">سال تجربه</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#37322F] mb-2">
                      ۵۰+
                    </div>
                    <div className="text-sm text-[#605A57]">پروژه موفق</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#37322F] mb-2">
                      ۲۰+
                    </div>
                    <div className="text-sm text-[#605A57]">متخصص</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#37322F] mb-2">
                      ۱۰۰+
                    </div>
                    <div className="text-sm text-[#605A57]">مشتری راضی</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
                ویژگی‌ها و ارزش‌های ما
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-3">
                  تحقیق و توسعه مستمر
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  تکیه بر تحقیق و توسعه مستمر و ارائه راهکارهای بومی
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-3">
                  پلتفرم‌های ابری
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  توسعه پلتفرم‌های خدمات ابری و یکپارچه‌سازی نرم‌افزارهای
                  سازمانی
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-3">
                  معماری مقیاس‌پذیر
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  پیاده‌سازی معماری‌های مقیاس‌پذیر مبتنی بر microservice و API
                  های استاندارد
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-3">
                  امنیت داده
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  رعایت استانداردهای امنیت داده، رمزنگاری و احراز هویت
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-3">
                  اتوماسیون صنعتی
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  ارائه راهکارهای انحصاری برای اتوماسیون صنعتی و مدیریت داده‌های
                  حجیم
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-[#37322F] rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-3">
                  ساینیج دیجیتال
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  طراحی و راه‌اندازی سیستم‌های دیجیتال ساینیج و مانیتورینگ صنعتی
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Karizor Brand Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6">
                  برند کاریزور (Karizor.com)
                </h2>
                <p className="text-[#605A57] text-base sm:text-lg leading-relaxed mb-6">
                  یکی از برندهای پیشرو ما، شرکت دانش بنیانی «کاریزور» است که در
                  حوزه تبلیغات دیجیتال، ساینیج و هوشمندسازی کسب‌وکارهای محلی و
                  کوچک فعال است.
                </p>
                <p className="text-[#605A57] text-base sm:text-lg leading-relaxed mb-6">
                  شرکت دانش بنیانی کاریزور با توسعه و ارائه نمایشگرهای تبلیغاتی
                  (Brandboard)، کمک می‌کند تا کسب‌وکارها به شیوه‌ای نوآورانه
                  پیام خود را به مخاطبان هدف انتقال دهند.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-[#F7F5F3] text-[#37322F] text-sm rounded-full">
                    زیرساخت ابری
                  </span>
                  <span className="px-3 py-1 bg-[#F7F5F3] text-[#37322F] text-sm rounded-full">
                    API های پیشرفته
                  </span>
                  <span className="px-3 py-1 bg-[#F7F5F3] text-[#37322F] text-sm rounded-full">
                    مدیریت کمپین
                  </span>
                  <span className="px-3 py-1 bg-[#F7F5F3] text-[#37322F] text-sm rounded-full">
                    داده‌های لحظه‌ای
                  </span>
                </div>
              </div>
              <div className="bg-[#F7F5F3] rounded-lg  text-center">
                <Image
                  src="/karizor-about.jpg"
                  alt="karizor"
                  className="w-full h-full object-cover rounded-lg border border-[rgba(55,50,47,0.08)] overflow-hidden"
                  width={1000}
                  height={1000}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Expertise Areas */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
                حوزه‌های تخصصی
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="group p-6 rounded-xl border border-[rgba(55,50,47,0.08)] hover:border-[#37322F] hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#37322F] rounded-full mb-4 group-hover:scale-125 transition-transform duration-300"></div>
                <h3 className="text-[#37322F] text-lg font-medium mb-3 leading-tight">
                  طراحی و پیاده‌سازی پلتفرم‌های ابری
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed opacity-80">
                  خدمات سازمانی و زیرساخت‌های Cloud Native برای مقیاس‌پذیری و
                  توسعه سریع
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-[rgba(55,50,47,0.08)] hover:border-[#37322F] hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#37322F] rounded-full mb-4 group-hover:scale-125 transition-transform duration-300"></div>
                <h3 className="text-[#37322F] text-lg font-medium mb-3 leading-tight">
                  اینترنت اشیا و یکپارچگی داده‌ها
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed opacity-80">
                  اتصال دستگاه‌ها و سنسورها با پردازش داده‌های بی‌درنگ
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-[rgba(55,50,47,0.08)] hover:border-[#37322F] hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#37322F] rounded-full mb-4 group-hover:scale-125 transition-transform duration-300"></div>
                <h3 className="text-[#37322F] text-lg font-medium mb-3 leading-tight">
                  خودکارسازی صنعتی و Smart Factory
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed opacity-80">
                  پیاده‌سازی سیستم‌های هوشمند برای بهینه‌سازی فرآیندهای تولید
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-[rgba(55,50,47,0.08)] hover:border-[#37322F] hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#37322F] rounded-full mb-4 group-hover:scale-125 transition-transform duration-300"></div>
                <h3 className="text-[#37322F] text-lg font-medium mb-3 leading-tight">
                  توسعه نرم‌افزارهای مانیتورینگ
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed opacity-80">
                  سیستم‌های کنترل و اتوماسیون برای نظارت بر عملکرد تجهیزات
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-[rgba(55,50,47,0.08)] hover:border-[#37322F] hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#37322F] rounded-full mb-4 group-hover:scale-125 transition-transform duration-300"></div>
                <h3 className="text-[#37322F] text-lg font-medium mb-3 leading-tight">
                  برندینگ دیجیتال و تبلیغات هوشمند
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed opacity-80">
                  ابزارهای نوآورانه برای ارتباط مؤثر با مخاطبان هدف
                </p>
              </div>

              <div className="group p-6 rounded-xl border border-[rgba(55,50,47,0.08)] hover:border-[#37322F] hover:shadow-lg transition-all duration-300 bg-white/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#37322F] rounded-full mb-4 group-hover:scale-125 transition-transform duration-300"></div>
                <h3 className="text-[#37322F] text-lg font-medium mb-3 leading-tight">
                  توسعه استانداردهای API و امنیت
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed opacity-80">
                  پیاده‌سازی پروتکل‌های امن و استاندارد برای تبادل داده
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-[#37322F] text-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6">
              آماده همکاری با ما هستید؟
            </h2>
            <p className="text-lg leading-relaxed mb-8 opacity-90">
              با تیم متخصص ما در تماس باشید و پروژه بعدی خود را شروع کنید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-3 bg-white text-[#37322F] rounded-full font-medium hover:bg-gray-100 transition-colors">
                <Link href={"contact"}>تماس با ما</Link>
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:text-[#37322F] transition-colors">
                <Link href={"/services"}>مشاهده خدمات</Link>
              </button>
            </div>
          </div>
        </section>
      </main>

      <PersianFooter />
    </div>
  );
}
