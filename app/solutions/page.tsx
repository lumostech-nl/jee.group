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
  Cloud,
  Database,
  Shield,
  Network,
  BarChart3,
  Container,
  Lock,
  Server,
} from "lucide-react";
import Link from "next/link";

export default function SolutionsPage() {
  const solutions = [
    {
      icon: <Cloud className="h-8 w-8" />,
      title: "محیط ابری، مجازی‌سازی و اتوماسیون",
      description:
        "به‌کارگیری زیرساخت‌های Cloud Native و مدیریت منابع خودکار برای مقیاس‌پذیری، توسعه سریع و کنترل هزینه",
      features: ["VMware", "KVM", "مدیریت ابری", "مقیاس‌پذیری خودکار"],
    },
    {
      icon: <Network className="h-8 w-8" />,
      title: "اینترنت اشیا، سنسورها و اتصالات",
      description:
        "طراحی معماری‌ای قابل‌گسترش برای شبکه‌های IoT با انواع حسگر و پروتکل‌های صنعتی",
      features: ["MQTT", "CoAP", "HTTP", "API استاندارد", "مانیتورینگ لحظه‌ای"],
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "داده‌کاوی و پردازش کلان‌داده‌ها",
      description:
        "توسعه زیرساخت‌های Big Data با قابلیت جمع‌آوری، ذخیره‌سازی و تحلیل داده‌های حجیم",
      features: ["Hadoop", "Spark", "پایگاه داده توزیع‌شده", "یادگیری ماشین"],
    },
    {
      icon: <Container className="h-8 w-8" />,
      title: "معماری مایکروسرویس، CI/CD، امنیت",
      description:
        "پیاده‌سازی معماری Microservices با Docker و Kubernetes، اجرای فرآیندهای CI/CD",
      features: ["Docker", "Kubernetes", "Jenkins", "GitLab", "IAM"],
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "API Gateway و مدیریت احراز هویت",
      description:
        "استقرار API Gateway برای مدیریت ترافیک و احراز هویت توزیع‌شده",
      features: [
        "Rate Limiting",
        "Single Sign-On",
        "اعتبارسنجی",
        "مدیریت ترافیک",
      ],
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "ارتباطات امن",
      description:
        "رمزنگاری لایه انتقال داده، استفاده از VPN و شبکه‌های اختصاصی",
      features: ["TLS/SSL", "VPN", "Wi-Fi اختصاصی", "LTE", "رمزنگاری"],
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "پایش و نگهداری داده‌های صنعتی",
      description:
        "مانیتورینگ لحظه‌ای، جمع‌آوری، ذخیره و تحلیل داده تجهیزات صنعتی",
      features: ["داشبورد تحلیلی", "شناسایی رویداد", "بهینه‌سازی عملکرد"],
    },
    {
      icon: <Server className="h-8 w-8" />,
      title: "مدیریت کانتینرها و خوشه‌بندی",
      description:
        "دپلوی، مدیریت و مقیاس‌پذیری کانتینرها با Docker و Kubernetes",
      features: ["مدیریت بار", "Failover", "منابع دینامیک", "OpenStack"],
    },
  ];

  const technologies = [
    { name: "Cloud Native", category: "ابری" },
    { name: "Kubernetes", category: "کانتینر" },
    { name: "Docker", category: "کانتینر" },
    { name: "MQTT", category: "IoT" },
    { name: "Microservices", category: "معماری" },
    { name: "API Gateway", category: "شبکه" },
    { name: "Big Data", category: "داده" },
    { name: "Machine Learning", category: "هوش مصنوعی" },
    { name: "TLS/SSL", category: "امنیت" },
    { name: "CI/CD", category: "DevOps" },
    { name: "Hadoop", category: "داده" },
    { name: "Spark", category: "داده" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F3]" dir="rtl">
      <PersianHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#37322F] mb-6 text-balance">
            راه‌حل‌ها و فناوری‌ها
          </h1>
          <p className="text-xl text-[#605A57] mb-8 max-w-3xl mx-auto text-pretty">
            مجموعه‌ای جامع از فناوری‌های پیشرفته و راه‌حل‌های نوآورانه برای تحول
            دیجیتال سازمان شما
          </p>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {technologies.slice(0, 6).map((tech, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-sm px-3 py-1"
              >
                {tech.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">
              راه‌حل‌های فناوری
            </h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">
              از زیرساخت ابری تا هوش مصنوعی، تمام ابزارهای مورد نیاز برای
              دیجیتالی شدن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <Card
                key={index}
                className="bg-white border-[rgba(55,50,47,0.12)] hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-[#F7F5F3] rounded-lg shadow-sm text-[#37322F]">
                      {solution.icon}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-[#37322F]">
                    {solution.title}
                  </CardTitle>
                  <CardDescription className="text-[#605A57] text-sm leading-relaxed">
                    {solution.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {solution.features.map((feature, featureIndex) => (
                      <Badge
                        key={featureIndex}
                        variant="outline"
                        className="text-xs"
                      >
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">
              فرآیند پیاده‌سازی
            </h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">
              مراحل استاندارد ما برای پیاده‌سازی راه‌حل‌های فناوری
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "۱",
                title: "تحلیل نیاز",
                desc: "بررسی دقیق نیازها و چالش‌های فعلی",
              },
              {
                step: "۲",
                title: "طراحی معماری",
                desc: "طراحی معماری مناسب و انتخاب فناوری‌ها",
              },
              {
                step: "۳",
                title: "پیاده‌سازی",
                desc: "توسعه و پیاده‌سازی راه‌حل با بهترین شیوه‌ها",
              },
              {
                step: "۴",
                title: "پشتیبانی",
                desc: "نگهداری، بروزرسانی و پشتیبانی مستمر",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#37322F] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[#37322F] mb-2">
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
            آماده شروع پروژه هستید؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            با تیم متخصص ما مشورت کنید و بهترین راه‌حل را برای سازمان خود پیدا
            کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-[#37322F]">
              <Link href={"/contact"}>مشاوره رایگان</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-[#37322F] bg-transparent"
            >
              <Link href={"/portfolio"}>مشاهده نمونه‌کارها</Link>
            </Button>
          </div>
        </div>
      </section>

      <PersianFooter />
    </div>
  );
}
