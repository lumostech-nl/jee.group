"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PersianHeader } from "../components/persian-header";
import { PersianFooter } from "../components/persian-footer";
import YourWorkInSync from "../components/your-work-in-sync";
import EffortlessIntegration from "../components/effortless-integration-updated";
import NumbersThatSpeak from "../components/numbers-that-speak";
import FAQSection from "../components/faq-section";

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] flex justify-start items-center gap-[8px] border border-[rgba(2,6,23,0.08)] shadow-xs">
      <div className="w-[14px] h-[14px] relative overflow-hidden flex items-center justify-center">
        {icon}
      </div>
      <div className="text-center flex justify-center flex-col text-[#37322F] text-xs font-medium leading-3 font-sans">
        {text}
      </div>
    </div>
  );
}

const companies = [
  { name: "بانک سپه", logo: "/BankSepah_Logo.png" },
  {
    name: "پرداخت الکترونیک پاسارگاد",
    logo: "/companyLogos/pasargad-epay.webp",
  },
  { name: "همراه اول", logo: "/companyLogos/hamrahe-aval-old-logo.svg" },
  { name: "ایرانسل", logo: "/companyLogos/irancell-logo.svg" },
  { name: "شرکت سروش رسانه", logo: "/companyLogos/soroush-rasaneh-logo.png" },
  {
    name: "سازمان فناوری اطلاعات و ارتباطات شهرداری تهران",
    logo: "/companyLogos/fanavari-etelaat-tehran.png",
  },
  {
    name: "مرکز تحقیقات مخابرات ایران",
    logo: "/companyLogos/markaz-tahghighat-mokhaberat.png",
  },
  {
    name: "مرکز ملی فضای مجازی",
    logo: "/companyLogos/markaz-meli-fazaye-majazi.webp",
  },
  {
    name: "سازمان تنظیم مقررات صوت و تصویر فراگیر در فضای مجازی",
    logo: "/companyLogos/satra-logo.png",
  },
  {
    name: "شرکت چشم‌انداز ارتباط",
    logo: "/companyLogos/cheshm-andaz-ertebat-logo.jpg",
  },
  { name: "شرکت مگفا", logo: "/companyLogos/magfa-logo.webp" },
  { name: "شرکت ملی گاز ایران", logo: "/companyLogos/sherkat-gas-logo.svg" },
  { name: "شرکت توانیر", logo: "/companyLogos/tavanir-logo.png" },
  { name: "شرکت ایزایران", logo: "/companyLogos/isiran-logo.svg" },
  { name: "پژوهشگاه نیرو", logo: "/companyLogos/pazhoheshgah-niro.png" },
  {
    name: "پژوهشکده علوم و فناوری انرژی شریف",
    logo: "/companyLogos/sharif-university-of-technology-logo.svg",
  },
  { name: "دانشگاه تهران", logo: "/companyLogos/daneshgah-tehran-logo.svg" },
  {
    name: "سازمان صدا و سیمای جمهوری اسلامی ایران",
    logo: "/companyLogos/seda-sima-logo.svg",
  },
  {
    name: "مرکز همکاری‌های ریاست جمهوری",
    logo: "/companyLogos/markaz-hamkari-rais-jomhur-logo.png",
  },
  { name: "کاریزر", logo: "/companyLogos/karizor-logo.png" },
];
export default function PersianLandingPage() {
  const [activeCard, setActiveCard] = useState(0);
  const [progress, setProgress] = useState(0);
  const mountedRef = useRef(true);
  const router = useRouter();

  useEffect(() => {
    const progressInterval = setInterval(() => {
      if (!mountedRef.current) return;

      setProgress((prev) => {
        if (prev >= 100) {
          if (mountedRef.current) {
            setActiveCard((current) => (current + 1) % 3);
          }
          return 0;
        }
        return prev + 2; // 2% every 100ms = 5 seconds total
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleCardClick = (index: number) => {
    if (!mountedRef.current) return;
    setActiveCard(index);
    setProgress(0);
  };

  const getDashboardContent = () => {
    switch (activeCard) {
      case 0:
        return (
          <div className="text-[#828387] text-sm">
            وضعیت و جزئیات پلتفرم اینترنت اشیا
          </div>
        );
      case 1:
        return (
          <div className="text-[#828387] text-sm">
            داشبورد تحلیلی - بینش‌های لحظه‌ای
          </div>
        );
      case 2:
        return (
          <div className="text-[#828387] text-sm">
            تجسم داده‌ها - نمودارها و معیارها
          </div>
        );
      default:
        return (
          <div className="text-[#828387] text-sm">
            وضعیت و جزئیات پلتفرم اینترنت اشیا
          </div>
        );
    }
  };

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center">
      <PersianHeader />

      <div className="relative flex flex-col justify-start items-center w-full">
        {/* Main container with proper margins */}
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line - RTL adjusted */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          {/* Right vertical line - RTL adjusted */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Navigation - Removed as PersianHeader is added */}

            {/* Hero Section */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[120px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full  max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#37322F] text-[22px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    پلتفرم‌های پیشرفته
                    <br />
                    برای صنایع هوشمند
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    نوآوری در تحول دیجیتال
                    <br className="hidden sm:block" />
                    برای افزایش کارایی، اتوماسیون و رشد پایدار در صنایع مختلف{" "}
                  </div>
                </div>
              </div>

              <div className="w-full max-w-[497px] lg:w-[497px] flex flex-col justify-center items-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 relative z-10 mt-6 sm:mt-8 md:mt-10 lg:mt-12">
                <div className="backdrop-blur-[8.25px] flex justify-start items-center gap-4">
                  <button
                    onClick={() => router.push("/products")}
                    className="h-10 sm:h-11 md:h-12 px-6 sm:px-8 md:px-10 lg:px-12 py-2 sm:py-[6px] bg-[#a8cac8] rounded-full flex justify-center items-center hover:bg-[#92B2B0]/90 transition-colors cursor-pointer"
                  >
                    <div className="text-slate-900 font-bold text-sm sm:text-base md:text-[15px] lg:text-lg leading-5 font-sans">
                      شروع کنید!
                    </div>
                  </button>
                </div>
              </div>

              <div className="absolute top-[232px] sm:top-[248px] md:top-[264px] lg:top-[320px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none">
                <img
                  src="/mask-group-pattern.svg"
                  alt=""
                  className="w-[936px] sm:w-[1404px] md:w-[2106px] lg:w-[2808px] h-auto opacity-30 sm:opacity-40 md:opacity-50 mix-blend-multiply"
                  style={{
                    filter: "hue-rotate(15deg) saturate(0.7) brightness(1.2)",
                  }}
                />
              </div>

              <div className="w-full max-w-[960px] lg:w-[960px] pt-2 sm:pt-4 pb-6 sm:pb-8 md:pb-10 px-2 sm:px-4 md:px-6 lg:px-11 flex flex-col justify-center items-center gap-2 relative z-5 my-8 sm:my-12 md:my-16 lg:my-16 mb-0 lg:pb-0">
                <div className="w-full max-w-[960px] lg:w-[960px] h-[200px] sm:h-[280px] md:h-[450px] lg:h-[695.55px] bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] flex flex-col justify-start items-start">
                  {/* Dashboard Content */}
                  <div className="self-stretch flex-1 flex justify-start items-start">
                    {/* Main Content */}
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="relative w-full h-full overflow-hidden">
                        {/* Platform Images */}
                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 0
                              ? "opacity-100 scale-100 blur-0"
                              : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <img
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dsadsadsa.jpg-xTHS4hGwCWp2H5bTj8np6DXZUyrxX7.jpeg"
                            alt="پلتفرم اینترنت اشیا"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 1
                              ? "opacity-100 scale-100 blur-0"
                              : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <img
                            src="/analytics-dashboard-with-charts-graphs-and-data-vi.jpg"
                            alt="داشبورد تحلیلی"
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div
                          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                            activeCard === 2
                              ? "opacity-100 scale-100 blur-0"
                              : "opacity-0 scale-95 blur-sm"
                          }`}
                        >
                          <img
                            src="/data-visualization-dashboard-with-interactive-char.jpg"
                            alt="تجسم داده‌ها"
                            className="w-full h-full object-contain" // Changed from object-cover to object-contain to preserve landscape aspect ratio
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Cards Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                      icon={
                        <svg
                          width="12"
                          height="10"
                          viewBox="0 0 12 10"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="1"
                            y="3"
                            width="4"
                            height="6"
                            stroke="#37322F"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="7"
                            y="1"
                            width="4"
                            height="8"
                            stroke="#37322F"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="2"
                            y="4"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="3.5"
                            y="4"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="2"
                            y="5.5"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="3.5"
                            y="5.5"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="8"
                            y="2"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="9.5"
                            y="2"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="8"
                            y="3.5"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="9.5"
                            y="3.5"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="8"
                            y="5"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="9.5"
                            y="5"
                            width="1"
                            height="1"
                            fill="#37322F"
                          />
                        </svg>
                      }
                      text="اعتماد مشتریان"
                    />
                    <div className="w-full max-w-[586px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                      <div className="text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                        اعتماد مبتنی بر نتایج
                      </div>
                      <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                        مشتریان ما هر روز بیشتر پیشرفت می‌کنند
                        <br className="hidden sm:block" />
                        چون ابزارهایشان ساده، قدرتمند و شفاف است
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Grid - keeping existing structure */}
                <div className="self-stretch border-[rgba(55,50,47,0.12)] flex justify-center items-start border-t border-b-0">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {/* Logo Grid - Responsive grid */}
                    {companies.map((company, index) => {
                      const isMobileFirstColumn = index % 2 === 0;
                      const isDesktopFirstColumn = index % 4 === 0;
                      const isDesktopLastColumn = index % 4 === 3;
                      const isDesktopTopRow = index < 4;
                      const desktopColumns = 4;
                      const lastDesktopRowStart =
                        Math.floor((companies.length - 1) / desktopColumns) *
                        desktopColumns;
                      const isDesktopBottomRow = index >= lastDesktopRowStart;

                      return (
                        <div
                          key={company.name || index}
                          className={`
                            h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40 flex justify-center items-center gap-1 xs:gap-2 sm:gap-3
                            border-b border-[rgba(227,226,225,0.5)]
                            ${index < 6 ? "sm:border-b-[0.5px]" : "sm:border-b"}
                            ${index >= 6 ? "border-b" : ""}
                            ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}
                            sm:border-r-[0.5px] sm:border-l-0
                            ${
                              isDesktopFirstColumn
                                ? "md:border-l"
                                : "md:border-l-[0.5px]"
                            }
                            ${
                              isDesktopLastColumn
                                ? "md:border-r"
                                : "md:border-r-[0.5px]"
                            }
                            ${isDesktopTopRow ? "md:border-b-[0.5px]" : ""}
                            ${
                              isDesktopBottomRow
                                ? "md:border-t-[0.5px] md:border-b"
                                : ""
                            }
                            border-[#E3E2E1]
                          `}
                        >
                          <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-30 lg:h-20 relative  overflow-hidden rounded-full shrink-0 p-2 sm:p-2.5 md:p-3">
                            <img
                              src={company.logo}
                              alt={company.name}
                              className="w-full h-full object-contain select-none pointer-events-none"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 50 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left  outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/*See More Section*/}

              {/* Contact CTA Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-12 sm:py-16 md:py-20 flex flex-col justify-center items-center gap-6 sm:gap-8">
                  <div className="w-full max-w-[600px] text-center">
                    <h3 className="text-[#37322F] text-xl sm:text-2xl md:text-3xl font-semibold leading-tight mb-4">
                      آماده شروع همکاری هستید؟
                    </h3>
                    <p className="text-[#605A57] text-base sm:text-lg leading-relaxed mb-8">
                      با تیم متخصص ما تماس بگیرید و از مشاوره رایگان بهره‌مند
                      شوید
                    </p>
                    <div className="flex justify-center items-center">
                      <button
                        onClick={() => router.push("/contact")}
                        className="cursor-pointer px-8 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#37322F]/90 transition-colors"
                      >
                        با ما در تماس باشید
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Features Section */}
              <div className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col justify-center items-center">
                {/* Header Section */}
                <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-8 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center gap-6">
                  <div className="w-full max-w-[616px] lg:w-[616px] px-4 sm:px-6 py-4 sm:py-5 shadow-[0px_2px_4px_rgba(50,45,43,0.06)] overflow-hidden rounded-lg flex flex-col justify-start items-center gap-3 sm:gap-4 shadow-none">
                    <Badge
                      icon={
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="6"
                            cy="6"
                            r="2"
                            stroke="#37322F"
                            strokeWidth="1"
                            fill="none"
                          />
                          <circle
                            cx="6"
                            cy="6"
                            r="5"
                            stroke="#37322F"
                            strokeWidth="1"
                            fill="none"
                          />
                          <rect
                            x="5.5"
                            y="1"
                            width="1"
                            height="2"
                            fill="#37322F"
                          />
                          <rect
                            x="5.5"
                            y="9"
                            width="1"
                            height="2"
                            fill="#37322F"
                          />
                          <rect
                            x="1"
                            y="5.5"
                            width="2"
                            height="1"
                            fill="#37322F"
                          />
                          <rect
                            x="9"
                            y="5.5"
                            width="2"
                            height="1"
                            fill="#37322F"
                          />
                        </svg>
                      }
                      text="درباره ما"
                    />
                    <div className="w-full max-w-[598.06px] lg:w-[598.06px] text-center flex justify-center flex-col text-[#49423D] text-xl sm:text-2xl md:text-3xl lg:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight">
                      پلتفرم‌های فنی و محصولات نرم‌افزاری
                    </div>
                    <div className="self-stretch text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
                      توسعه‌دهنده پلتفرم‌های IoT، سیستم‌های ابری و ابزارهای
                      تحلیلی
                      <br />
                      برای اتوماسیون صنعتی و هوشمندسازی کسب‌وکارها
                    </div>
                  </div>
                </div>

                {/* Company Features Content */}
                <div className="self-stretch flex justify-center items-start">
                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Left decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">
                    {/* Mission Statement */}
                    <div className="border-b border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          پلتفرم IoT صنعتی
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          پلتفرم جامع اینترنت اشیا برای مانیتورینگ، کنترل و
                          بهینه‌سازی فرآیندهای صنعتی
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg overflow-hidden">
                        <img
                          src="/jee-growth.webp"
                          alt="رشد و توسعه گروه ژی"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* R&D and Local Solutions */}
                    <div className="border-b border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] font-semibold leading-tight font-sans text-lg sm:text-xl">
                          سیستم‌های ابری
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          پلتفرم‌های ابری مقیاس‌پذیر با معماری microservice برای
                          مدیریت داده‌های حجیم
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden text-right items-center justify-center">
                        <YourWorkInSync
                          width="400"
                          height="250"
                          theme="light"
                          className="scale-60 sm:scale-75 md:scale-90"
                        />
                      </div>
                    </div>

                    {/* Cloud Platforms */}
                    <div className="border-r-0 md:border-r border-[rgba(55,50,47,0.12)] p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6 bg-transparent">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          ابزارهای تحلیلی
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          داشبوردهای تحلیلی پیشرفته با هوش مصنوعی برای پردازش و
                          تجسم داده‌های صنعتی
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden justify-center items-center relative bg-transparent">
                        <div className="w-full h-full flex items-center justify-center bg-transparent">
                          <EffortlessIntegration
                            width={400}
                            height={250}
                            className="max-w-full max-h-full"
                          />
                        </div>
                        {/* Gradient mask for soft bottom edge */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                      </div>
                    </div>

                    {/* Security & Analytics */}
                    <div className="p-4 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-start items-start gap-4 sm:gap-6">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-[#37322F] text-lg sm:text-xl font-semibold leading-tight font-sans">
                          امنیت و احراز هویت
                        </h3>
                        <p className="text-[#605A57] text-sm md:text-base font-normal leading-relaxed font-sans">
                          سیستم‌های امنیتی پیشرفته با رمزنگاری end-to-end و
                          احراز هویت چندمرحله‌ای
                        </p>
                      </div>
                      <div className="w-full h-[200px] sm:h-[250px] md:h-[300px] rounded-lg flex overflow-hidden items-center justify-center relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <NumbersThatSpeak
                            width="100%"
                            height="100%"
                            theme="light"
                            size="sm"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        {/* Gradient mask for soft bottom edge */}
                        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F7F5F3] to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </div>

                  <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
                    {/* Right decorative pattern */}
                    <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
                      {Array.from({ length: 200 }).map((_, i) => (
                        <div
                          key={i}
                          className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <FAQSection />

              {/* CTA Section */}
              <div className="w-full py-16 sm:py-20 md:py-24 flex flex-col justify-center items-center">
                <div className="max-w-[600px] text-center">
                  <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight mb-6">
                    درباره ما و سرویس‌های ما
                  </h2>
                  <p className="text-[#605A57] text-base sm:text-lg leading-relaxed mb-8">
                    با تیم ما و خدمات متنوعی که ارائه می‌دهیم آشنا شوید
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => router.push("/services")}
                      className="cursor-pointer px-8 py-3 bg-[#37322F] text-white rounded-full font-medium hover:bg-[#37322F]/90 transition-colors"
                    >
                      سرویس ها
                    </button>
                    <button
                      onClick={() => router.push("/about")}
                      className="cursor-pointer px-8 py-3 border border-[#37322F] text-[#37322F] rounded-full font-medium hover:bg-[#37322F]/5 transition-colors"
                    >
                      درباره ما
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              {/* <FooterSection /> */}
            </div>
          </div>
        </div>
      </div>

      <PersianFooter />
    </div>
  );
}

function FeatureCard({
  title,
  description,
  isActive,
  progress,
  onClick,
}: {
  title: string;
  description: string;
  isActive: boolean;
  progress: number;
  onClick: () => void;
}) {
  return (
    <div
      className={`w-full md:flex-1 self-stretch px-6 py-5 overflow-hidden flex flex-col justify-start items-start gap-2 cursor-pointer relative border-b md:border-b-0 last:border-b-0 ${
        isActive
          ? "bg-white shadow-[0px_0px_0px_0.75px_#E0DEDB_inset]"
          : "border-l-0 border-r-0 md:border border-[#E0DEDB]/80"
      }`}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-[rgba(50,45,43,0.08)]">
          <div
            className="h-full bg-[#322D2B] transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="self-stretch flex justify-center flex-col text-[#49423D] text-sm md:text-sm font-semibold leading-6 md:leading-6 font-sans">
        {title}
      </div>
      <div className="self-stretch text-[#605A57] text-[13px] md:text-[13px] font-normal leading-[22px] md:leading-[22px] font-sans">
        {description}
      </div>
    </div>
  );
}
