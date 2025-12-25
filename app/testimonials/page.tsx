import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Quote, Building, Users, Award, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function TestimonialsPage() {
  const featuredTestimonial = {
    name: "دکتر محمد احمدی",
    position: "مدیر فناوری اطلاعات",
    company: "گروه صنعتی پارس",
    industry: "تولیدی",
    rating: 5,
    testimonial:
      "همکاری با این تیم تجربه‌ای فوق‌العاده بود. آن‌ها نه تنها سیستم مانیتورینگ صنعتی پیشرفته‌ای برای ما طراحی کردند، بلکه با درک عمیق از نیازهای صنعت ما، راه‌حلی ارائه دادند که بهره‌وری تولید را ۳۰ درصد افزایش داد. تیم حرفه‌ای، پاسخگو و متعهد.",
    project: "سیستم مانیتورینگ IIoT",
    results: [
      "۳۰% افزایش بهره‌وری",
      "۲۵% کاهش هزینه نگهداری",
      "۹۹.۵% آپتایم سیستم",
    ],
    image: "/client-testimonial-1.jpg",
  };

  const testimonials = [
    {
      name: "مهندس فاطمه رضایی",
      position: "مدیر عامل",
      company: "شرکت حمل‌ونقل آسیا",
      industry: "حمل‌ونقل",
      rating: 5,
      testimonial:
        "سیستم ردیابی ناوگان که برای ما پیاده‌سازی کردند، کاملاً تحول‌آفرین بود. حالا می‌توانیم تمام کامیون‌هایمان را به صورت لحظه‌ای رصد کنیم و مسیرها را بهینه کنیم.",
      project: "سیستم ردیابی GPS",
      results: ["۴۰% بهینه‌سازی مسیر", "۲۰% کاهش مصرف سوخت"],
    },
    {
      name: "دکتر علی محمودی",
      position: "معاون فناوری",
      company: "دانشگاه صنعتی شریف",
      industry: "آموزش",
      rating: 5,
      testimonial:
        "پلتفرم یادگیری که توسعه دادند، تجربه آموزشی دانشجویان ما را کاملاً متحول کرد. رابط کاربری عالی، امکانات پیشرفته و پشتیبانی بی‌نظیر.",
      project: "سیستم مدیریت یادگیری",
      results: ["۱۰۰۰۰+ دانشجو فعال", "۹۵% رضایت کاربران"],
    },
    {
      name: "مهندس حسن کریمی",
      position: "مدیر IT",
      company: "بیمارستان پارسیان",
      industry: "بهداشت",
      rating: 5,
      testimonial:
        "سیستم مانیتورینگ بیمارستان که طراحی کردند، کیفیت مراقبت از بیماران را به طرز چشمگیری بهبود بخشید. سیستم پایدار، امن و کاربرپسند.",
      project: "سیستم مانیتورینگ بیمارستان",
      results: ["۵۰% کاهش زمان پاسخ", "۹۹.۹% آپتایم سیستم"],
    },
    {
      name: "مهندس مریم صادقی",
      position: "مدیر فنی",
      company: "شرکت گاز استان تهران",
      industry: "انرژی",
      rating: 5,
      testimonial:
        "کنتورهای هوشمند گاز که پیاده‌سازی کردند، نه تنها دقت اندازه‌گیری را افزایش داد بلکه امکان مدیریت از راه دور و کاهش تلفات را فراهم کرد.",
      project: "کنتورهای هوشمند گاز",
      results: ["۲۵% کاهش تلفات", "۹۰% کاهش خرابی"],
    },
    {
      name: "دکتر امیر حسینی",
      position: "مدیر عملیات",
      company: "مجتمع پتروشیمی جم",
      industry: "پتروشیمی",
      rating: 5,
      testimonial:
        "سیستم اتوماسیون صنعتی که برای ما توسعه دادند، فرآیندهای تولید را کاملاً هوشمند کرد. کنترل دقیق، گزارش‌گیری جامع و امنیت بالا.",
      project: "سیستم اتوماسیون صنعتی",
      results: ["۳۵% افزایش کارایی", "۵۰% کاهش خطا"],
    },
    {
      name: "مهندس زهرا احمدی",
      position: "مدیر فروش",
      company: "فروشگاه‌های زنجیره‌ای هایپراستار",
      industry: "خرده‌فروشی",
      rating: 5,
      testimonial:
        "سیستم مدیریت فروشگاه و تحلیل مشتری که پیاده‌سازی کردند، فروش ما را به طرز قابل توجهی افزایش داد. داشبورد تحلیلی فوق‌العاده مفیدی دارد.",
      project: "سیستم مدیریت خرده‌فروشی",
      results: ["۵۰% افزایش فروش", "۳۰% بهبود تجربه مشتری"],
    },
  ];

  const clientLogos = [
    { name: "گروه صنعتی پارس", logo: "/client-logo-1.png" },
    { name: "شرکت حمل‌ونقل آسیا", logo: "/client-logo-2.png" },
    { name: "دانشگاه صنعتی شریف", logo: "/client-logo-3.png" },
    { name: "بیمارستان پارسیان", logo: "/client-logo-4.png" },
    { name: "شرکت گاز استان تهران", logo: "/client-logo-5.png" },
    { name: "مجتمع پتروشیمی جم", logo: "/client-logo-6.png" },
    { name: "فروشگاه‌های هایپراستار", logo: "/client-logo-7.png" },
    { name: "شرکت مخابرات ایران", logo: "/client-logo-8.png" },
  ];

  const stats = [
    { number: "۵۰+", label: "مشتری راضی", icon: <Users className="h-6 w-6" /> },
    {
      number: "۸۰+",
      label: "پروژه موفق",
      icon: <CheckCircle className="h-6 w-6" />,
    },
    { number: "۹۵%", label: "رضایت مشتری", icon: <Star className="h-6 w-6" /> },
    { number: "۵", label: "سال تجربه", icon: <Award className="h-6 w-6" /> },
  ];

  const industries = [
    { name: "تولیدی", count: 15, color: "bg-blue-100 text-blue-800" },
    { name: "حمل‌ونقل", count: 12, color: "bg-green-100 text-green-800" },
    { name: "آموزش", count: 8, color: "bg-purple-100 text-purple-800" },
    { name: "بهداشت", count: 6, color: "bg-red-100 text-red-800" },
    { name: "انرژی", count: 10, color: "bg-yellow-100 text-yellow-800" },
    { name: "خرده‌فروشی", count: 9, color: "bg-teal-100 text-teal-800" },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <PersianHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-green-50 to-teal-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 text-balance">
            نظرات مشتریان
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto text-pretty">
            داستان‌های موفقیت مشتریان ما و تجربه همکاری با تیم متخصص ما در
            پروژه‌های مختلف
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2 text-green-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonial */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              نظر ویژه
            </h2>
          </div>

          <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-none shadow-xl">
            <div className="md:flex">
              <div className="md:w-1/3 p-8 flex flex-col justify-center">
                <div className="text-center md:text-right">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto md:mx-0 mb-4 shadow-lg">
                    <Building className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {featuredTestimonial.name}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    {featuredTestimonial.position}
                  </p>
                  <p className="text-blue-600 font-semibold mb-2">
                    {featuredTestimonial.company}
                  </p>
                  <Badge className="bg-blue-100 text-blue-800 mb-4">
                    {featuredTestimonial.industry}
                  </Badge>
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(featuredTestimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 p-8">
                <Quote className="h-12 w-12 text-blue-600 mb-4" />
                <p className="text-lg text-gray-700 leading-relaxed mb-6 italic">
                  "{featuredTestimonial.testimonial}"
                </p>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    پروژه: {featuredTestimonial.project}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {featuredTestimonial.results.map((result, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-green-700"
                      >
                        <CheckCircle className="h-4 w-4" />
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              نظرات سایر مشتریان
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تجربه همکاری مشتریان ما در صنایع مختلف
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow bg-white"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {testimonial.position}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{testimonial.industry}</Badge>
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-blue-600 font-semibold text-sm">
                    {testimonial.company}
                  </p>
                </CardHeader>
                <CardContent>
                  <Quote className="h-6 w-6 text-gray-400 mb-2" />
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">
                    "{testimonial.testimonial}"
                  </p>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                      پروژه: {testimonial.project}
                    </h4>
                    <div className="space-y-1">
                      {testimonial.results.map((result, resultIndex) => (
                        <div
                          key={resultIndex}
                          className="flex items-center gap-2 text-xs text-green-700"
                        >
                          <CheckCircle className="h-3 w-3" />
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Logos */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              مشتریان ما
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              افتخار همکاری با برندهای معتبر و سازمان‌های پیشرو
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
            {clientLogos.map((client, index) => (
              <div
                key={index}
                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={`/.png?height=60&width=120&query=${encodeURIComponent(
                    client.name + " company logo"
                  )}`}
                  alt={client.name}
                  className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Breakdown */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              پراکندگی صنایع
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              تنوع مشتریان ما در صنایع مختلف
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {industries.map((industry, index) => (
              <div key={index} className="text-center">
                <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-2xl font-bold text-gray-900 mb-2">
                    {industry.count}
                  </div>
                  <Badge className={industry.color}>{industry.name}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-teal-700">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            آماده پیوستن به مشتریان راضی ما؟
          </h2>
          <p className="text-xl mb-8 opacity-90">
            با تیم متخصص ما مشورت کنید و تجربه همکاری موفق را آغاز کنید
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-green-600">
              <Link href={"/contact"}>شروع پروژه</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
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
