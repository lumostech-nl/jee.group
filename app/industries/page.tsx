import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Factory,
  Building2,
  Truck,
  GraduationCap,
  Heart,
  ShoppingCart,
  Zap,
  Wifi,
  BarChart3,
  Shield,
  Users,
  Smartphone,
} from "lucide-react";
import Link from "next/link";

export default function IndustriesPage() {
  const industries = [
    {
      icon: <Factory className="h-8 w-8" />,
      title: "صنایع تولیدی و کارخانه‌های هوشمند",
      description:
        "اتوماسیون صنعتی، مانیتورینگ تولید، نگهداری پیش‌بینانه و بهینه‌سازی فرآیندهای تولید",
      solutions: [
        "IIoT",
        "SCADA",
        "MES",
        "کارخانه هوشمند",
        "مانیتورینگ ماشین‌آلات",
      ],
      projects: [
        "سیستم مانیتورینگ صنعتی",
        "اتوماسیون خط تولید",
        "داشبورد کنترل کیفیت",
      ],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۱۵+", efficiency: "۳۰%" },
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "ساختمان‌های هوشمند و املاک",
      description:
        "سیستم‌های مدیریت ساختمان، کنترل دسترسی، مانیتورینگ انرژی و امنیت هوشمند",
      solutions: ["BMS", "کنترل دسترسی", "مانیتورینگ انرژی", "امنیت هوشمند"],
      projects: [
        "سیستم هشدار آتش‌سوزی",
        "کنترل روشنایی هوشمند",
        "مدیریت پارکینگ",
      ],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۲۰+", savings: "۲۵%" },
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "حمل‌ونقل و لجستیک",
      description:
        "ردیابی ناوگان، مدیریت انبار، بهینه‌سازی مسیر و سیستم‌های حمل‌ونقل هوشمند",
      solutions: ["GPS ردیابی", "مدیریت انبار", "بهینه‌سازی مسیر", "IoT خودرو"],
      projects: ["سیستم ردیابی کامیون", "مدیریت انبار هوشمند", "پلتفرم لجستیک"],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۱۲+", optimization: "۴۰%" },
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "آموزش و دانشگاه‌ها",
      description:
        "سیستم‌های مدیریت یادگیری، کلاس‌های هوشمند، امنیت دانشگاه و پلتفرم‌های آموزشی",
      solutions: ["LMS", "کلاس هوشمند", "امنیت دانشگاه", "آموزش آنلاین"],
      projects: ["پلتفرم یادگیری یکا", "سیستم حضور و غیاب", "کتابخانه دیجیتال"],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۸+", students: "۱۰۰۰۰+" },
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "بهداشت و درمان",
      description:
        "سیستم‌های مانیتورینگ بیمار، مدیریت بیمارستان، تله‌مدیسین و IoT پزشکی",
      solutions: ["مانیتورینگ بیمار", "HIS", "تله‌مدیسین", "IoT پزشکی"],
      projects: ["سیستم مانیتورینگ ICU", "مدیریت دارو", "پلتفرم تله‌مدیسین"],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۶+", patients: "۵۰۰۰+" },
    },
    {
      icon: <ShoppingCart className="h-8 w-8" />,
      title: "خرده‌فروشی و تجارت الکترونیک",
      description:
        "سیستم‌های فروش، مدیریت موجودی، تحلیل مشتری و پلتفرم‌های تجارت الکترونیک",
      solutions: ["POS", "مدیریت موجودی", "CRM", "تجارت الکترونیک"],
      projects: ["پلتفرم B2B", "سیستم فروش", "تحلیل مشتری"],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۱۰+", sales: "۵۰%" },
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "انرژی و آب",
      description:
        "مدیریت شبکه برق، کنتورهای هوشمند، مانیتورینگ مصرف و سیستم‌های انرژی تجدیدپذیر",
      solutions: [
        "کنتور هوشمند",
        "مدیریت شبکه",
        "انرژی تجدیدپذیر",
        "مانیتورینگ مصرف",
      ],
      projects: ["کنتور هوشمند گاز", "مانیتورینگ برق", "سیستم خورشیدی"],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۷+", efficiency: "۳۵%" },
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "مخابرات و IT",
      description:
        "زیرساخت شبکه، مراکز داده، امنیت سایبری و سیستم‌های ارتباطی پیشرفته",
      solutions: ["مرکز داده", "امنیت شبکه", "مانیتورینگ", "ارتباطات"],
      projects: ["مرکز داده ابری", "سیستم امنیت", "مانیتورینگ شبکه"],
      color: "bg-white border-[rgba(55,50,47,0.12)]",
      stats: { projects: "۱۸+", uptime: "۹۹.۹%" },
    },
  ];

  const successStories = [
    {
      industry: "تولیدی",
      company: "کارخانه فولاد",
      result: "کاهش ۳۰% هزینه نگهداری",
      solution: "سیستم مانیتورینگ IIoT",
    },
    {
      industry: "حمل‌ونقل",
      company: "شرکت باربری",
      result: "بهینه‌سازی ۴۰% مسیرها",
      solution: "سیستم ردیابی GPS",
    },
    {
      industry: "آموزش",
      company: "دانشگاه تهران",
      result: "۱۰۰۰۰+ دانشجو فعال",
      solution: "پلتفرم یادگیری آنلاین",
    },
    {
      industry: "انرژی",
      company: "شرکت گاز",
      result: "کاهش ۲۵% تلفات",
      solution: "کنتورهای هوشمند",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F3]" dir="rtl">
      <PersianHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#37322F] mb-6 text-balance">
            صنایع تحت پوشش
          </h1>
          <p className="text-xl text-[#605A57] mb-8 max-w-3xl mx-auto text-pretty">
            راه‌حل‌های تخصصی برای هر صنعت، از تولید تا خدمات، با فناوری‌های
            پیشرفته و تجربه عملی
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#37322F]">۸۰+</div>
              <div className="text-sm text-[#605A57]">پروژه موفق</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#37322F]">۸</div>
              <div className="text-sm text-[#605A57]">صنعت اصلی</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#37322F]">۵۰+</div>
              <div className="text-sm text-[#605A57]">مشتری فعال</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#37322F]">۹۵%</div>
              <div className="text-sm text-[#605A57]">رضایت مشتری</div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">
              صنایع مختلف، راه‌حل‌های متنوع
            </h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">
              تجربه کار با صنایع مختلف و ارائه راه‌حل‌های تخصصی برای هر حوزه
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => (
              <Card
                key={index}
                className={`${industry.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#F7F5F3] rounded-lg shadow-sm">
                      {industry.icon}
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {industry.stats.projects} پروژه
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-[#37322F]">
                    {industry.title}
                  </CardTitle>
                  <CardDescription className="text-[#605A57] text-sm leading-relaxed">
                    {industry.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#37322F] mb-2 text-sm">
                        راه‌حل‌ها:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {industry.solutions.map((solution, solutionIndex) => (
                          <Badge
                            key={solutionIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {solution}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#37322F] mb-2 text-sm">
                        پروژه‌های نمونه:
                      </h4>
                      <ul className="text-xs text-[#605A57] space-y-1">
                        {industry.projects.map((project, projectIndex) => (
                          <li
                            key={projectIndex}
                            className="flex items-center gap-2"
                          >
                            <div className="w-1 h-1 bg-[#605A57] rounded-full"></div>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">
              داستان‌های موفقیت
            </h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">
              نمونه‌هایی از پروژه‌های موفق ما در صنایع مختلف
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {successStories.map((story, index) => (
              <div
                key={index}
                className="bg-[#F7F5F3] p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-[rgba(55,50,47,0.12)]"
              >
                <div className="text-center">
                  <Badge className="mb-3">{story.industry}</Badge>
                  <h3 className="font-bold text-[#37322F] mb-2">
                    {story.company}
                  </h3>
                  <div className="text-2xl font-bold text-[#37322F] mb-2">
                    {story.result}
                  </div>
                  <p className="text-sm text-[#605A57]">{story.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">
              رویکرد ما به هر صنعت
            </h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">
              فرآیند استاندارد ما برای درک عمیق نیازهای هر صنعت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              {
                step: "۱",
                title: "تحلیل صنعت",
                desc: "مطالعه عمیق چالش‌ها و فرصت‌های صنعت",
                icon: <BarChart3 className="h-6 w-6" />,
              },
              {
                step: "۲",
                title: "شناسایی نیاز",
                desc: "درک دقیق نیازهای خاص مشتری",
                icon: <Users className="h-6 w-6" />,
              },
              {
                step: "۳",
                title: "طراحی راه‌حل",
                desc: "ارائه راه‌حل تخصصی و بهینه",
                icon: <Smartphone className="h-6 w-6" />,
              },
              {
                step: "۴",
                title: "پیاده‌سازی",
                desc: "اجرای دقیق و مرحله‌ای پروژه",
                icon: <Factory className="h-6 w-6" />,
              },
              {
                step: "۵",
                title: "پشتیبانی",
                desc: "حمایت مستمر و بهبود مداوم",
                icon: <Shield className="h-6 w-6" />,
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#37322F] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <div className="text-sm font-bold text-[#37322F] mb-2">
                  مرحله {item.step}
                </div>
                <h3 className="text-lg font-bold text-[#37322F] mb-2">
                  {item.title}
                </h3>
                <p className="text-[#605A57] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#37322F]">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            صنعت شما را نمی‌بینید؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            ما آماده همکاری با تمام صنایع هستیم. با ما تماس بگیرید تا راه‌حل
            مناسب صنعت شما را بیابیم
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-[#37322F]">
              <Link href={"/contact"}>مشاوره تخصصی</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#37322F] bg-transparent"
            >
              <Link href={"/portfolio"}>مشاهده پروژه‌ها</Link>
            </Button>
          </div>
        </div>
      </section>

      <PersianFooter />
    </div>
  );
}
