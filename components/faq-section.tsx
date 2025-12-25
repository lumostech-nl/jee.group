"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "شرکت ژی چیست و برای چه کسانی مناسب است؟",
    answer:
      "آتی ارتباطات ژی یک مجموعه با تمرکز بر طراحی، توسعه، و پیاده‌سازی راهکارهای تحول دیجیتال، فناوری ابری و اینترنت اشیا در صنایع مختلف است. برای شرکت‌ها و سازمان‌هایی که به دنبال هوشمندسازی و ارتقای بهره‌وری هستند، مناسب است.",
  },
  {
    question: "چگونه پلتفرم‌های ابری شما کار می‌کنند؟",
    answer:
      "ما پلتفرم‌های خدمات ابری مبتنی بر معماری‌های مقیاس‌پذیر microservice طراحی می‌کنیم که با API های استاندارد و اتصال انواع تجهیزات هوشمند، یکپارچه‌سازی نرم‌افزارهای سازمانی را فراهم می‌کنند.",
  },
  {
    question: "آیا می‌توانید با سیستم‌های موجود ما یکپارچه شوید؟",
    answer:
      "بله! ما متخصص یکپارچه‌سازی نرم‌افزارهای سازمانی هستیم و با استفاده از API های استاندارد و معماری‌های مقیاس‌پذیر، سیستم‌های موجود شما را به راحتی متصل می‌کنیم.",
  },
  {
    question: "چه نوع پشتیبانی ارائه می‌دهید؟",
    answer:
      "ما خدمات مشاوره تخصصی، پیاده‌سازی کامل پروژه‌ها، آموزش تیم‌های فنی، و پشتیبانی مستمر ارائه می‌دهیم. تیم متخصص ما در تمام مراحل پروژه در کنار شما خواهد بود.",
  },
  {
    question: "امنیت داده‌ها چگونه تضمین می‌شود؟",
    answer:
      "ما رعایت استانداردهای امنیت داده، رمزنگاری و احراز هویت را در اولویت قرار می‌دهیم. تمام راه‌حل‌های ما با بالاترین استانداردهای امنیتی طراحی و پیاده‌سازی می‌شوند.",
  },
  {
    question: "چگونه می‌توانم با شرکت آتی ارتباطات ژی شروع کنم؟",
    answer:
      "شروع بسیار ساده است! با تیم مشاوره ما تماس بگیرید تا نیازهای شما را بررسی کنیم و بهترین راه‌حل را برای کسب‌وکار شما طراحی کنیم. مشاوره اولیه رایگان است.",
  },
];

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FAQSection() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full flex justify-center items-start">
      <div className="flex-1 px-4 md:px-12 py-16 md:py-20 flex flex-col lg:flex-row justify-start items-start gap-6 lg:gap-12">
        {/* Left Column - Header */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-start gap-4 lg:py-5">
          <div className="w-full flex flex-col justify-center text-[#49423D] font-semibold leading-tight md:leading-[44px] font-sans text-4xl tracking-tight">
            سوالات متداول
          </div>
          <div className="w-full text-[#605A57] text-base font-normal leading-7 font-sans">
            راه‌حل‌های تحول دیجیتال، فناوری ابری
            <br className="hidden md:block" />و اینترنت اشیا برای کسب‌وکار شما
          </div>
        </div>

        {/* Right Column - FAQ Items */}
        <div className="w-full lg:flex-1 flex flex-col justify-center items-center">
          <div className="w-full flex flex-col">
            {faqData.map((item, index) => {
              const isOpen = openItems.includes(index);

              return (
                <div
                  key={index}
                  className="w-full border-b border-[rgba(73,66,61,0.16)] overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-5 py-[18px] flex justify-between items-center gap-5 text-right hover:bg-[rgba(73,66,61,0.02)] transition-colors duration-200"
                    aria-expanded={isOpen}
                  >
                    <div className="flex-1 text-[#49423D] text-base font-medium leading-6 font-sans text-right">
                      {item.question}
                    </div>
                    <div className="flex justify-center items-center">
                      <ChevronDownIcon
                        className={`w-6 h-6 text-[rgba(73,66,61,0.60)] transition-transform duration-300 ease-in-out ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </div>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-5 pb-[18px] text-[#605A57] text-sm font-normal leading-6 font-sans text-right">
                      {item.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
