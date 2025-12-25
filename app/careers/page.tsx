import { PersianHeader } from "@/components/persian-header"
import { PersianFooter } from "@/components/persian-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Clock,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Zap,
  Globe,
  Code,
  Database,
  Shield,
  Cpu,
  Lightbulb,
  Award,
} from "lucide-react"

export default function CareersPage() {
  const jobOpenings = [
    {
      title: "توسعه‌دهنده Backend",
      department: "توسعه نرم‌افزار",
      location: "تهران",
      type: "تمام وقت",
      experience: "۳-۵ سال",
      technologies: ["Node.js", "Python", "Java", "PostgreSQL", "Redis"],
      description: "جستجوی توسعه‌دهنده با تجربه برای کار روی پروژه‌های مقیاس بزرگ و سیستم‌های توزیع‌شده",
      requirements: [
        "تسلط به Node.js یا Python",
        "تجربه کار با پایگاه داده‌های رابطه‌ای و NoSQL",
        "آشنایی با معماری مایکروسرویس",
        "تجربه کار با Docker و Kubernetes",
      ],
      benefits: ["بیمه تکمیلی", "محیط یادگیری", "پروژه‌های بین‌المللی", "رشد شغلی"],
      urgent: true,
    },
    {
      title: "توسعه‌دهنده Frontend",
      department: "توسعه نرم‌افزار",
      location: "تهران",
      type: "تمام وقت",
      experience: "۲-۴ سال",
      technologies: ["React", "Vue.js", "TypeScript", "Tailwind CSS"],
      description: "توسعه‌دهنده Frontend برای ساخت رابط‌های کاربری مدرن و واکنش‌گرا",
      requirements: [
        "تسلط به React یا Vue.js",
        "تجربه کار با TypeScript",
        "آشنایی با ابزارهای Build مدرن",
        "درک اصول UX/UI",
      ],
      benefits: ["محیط خلاق", "تکنولوژی‌های جدید", "تیم جوان", "انعطاف‌پذیری"],
      urgent: false,
    },
    {
      title: "مهندس DevOps",
      department: "زیرساخت",
      location: "تهران",
      type: "تمام وقت",
      experience: "۴-۶ سال",
      technologies: ["Docker", "Kubernetes", "Jenkins", "AWS", "Linux"],
      description: "مهندس DevOps برای مدیریت زیرساخت ابری و اتوماسیون فرآیندهای CI/CD",
      requirements: [
        "تجربه کار با Kubernetes",
        "تسلط به Docker و containerization",
        "آشنایی با cloud platforms",
        "تجربه کار با monitoring tools",
      ],
      benefits: ["پروژه‌های چالش‌برانگیز", "فناوری‌های پیشرفته", "آموزش تخصصی"],
      urgent: true,
    },
    {
      title: "کارشناس اینترنت اشیا",
      department: "IoT",
      location: "تهران",
      type: "تمام وقت",
      experience: "۳-۵ سال",
      technologies: ["MQTT", "LoRaWAN", "Arduino", "Raspberry Pi", "C++"],
      description: "کارشناس IoT برای طراحی و پیاده‌سازی سیستم‌های اینترنت اشیا",
      requirements: [
        "تجربه کار با سنسورها و میکروکنترلرها",
        "آشنایی با پروتکل‌های IoT",
        "تسلط به برنامه‌نویسی embedded",
        "تجربه کار با پلتفرم‌های ابری IoT",
      ],
      benefits: ["پروژه‌های نوآورانه", "تحقیق و توسعه", "همکاری بین‌المللی"],
      urgent: false,
    },
    {
      title: "متخصص داده‌کاوی",
      department: "هوش مصنوعی",
      location: "تهران",
      type: "تمام وقت",
      experience: "۳-۵ سال",
      technologies: ["Python", "TensorFlow", "Pandas", "Spark", "SQL"],
      description: "متخصص داده‌کاوی برای تحلیل داده‌های حجیم و توسعه مدل‌های یادگیری ماشین",
      requirements: [
        "تسلط به Python و کتابخانه‌های ML",
        "تجربه کار با Big Data",
        "آشنایی با الگوریتم‌های یادگیری ماشین",
        "تجربه کار با SQL و NoSQL",
      ],
      benefits: ["پروژه‌های تحقیقاتی", "داده‌های واقعی", "تیم متخصص"],
      urgent: false,
    },
    {
      title: "کارشناس امنیت اطلاعات",
      department: "امنیت",
      location: "تهران",
      type: "تمام وقت",
      experience: "۴-۷ سال",
      technologies: ["Cybersecurity", "Penetration Testing", "SIEM", "Firewall"],
      description: "کارشناس امنیت برای حفاظت از زیرساخت‌ها و سیستم‌های حساس",
      requirements: [
        "تجربه در حوزه امنیت سایبری",
        "آشنایی با ابزارهای penetration testing",
        "تسلط به security frameworks",
        "گواهینامه‌های امنیتی معتبر",
      ],
      benefits: ["پروژه‌های حیاتی", "آموزش‌های تخصصی", "محیط امن"],
      urgent: true,
    },
  ]

  const benefits = [
    {
      icon: <Heart className="h-8 w-8" />,
      title: "محیط کاری نوآور و یادگیرنده",
      description: "فضای کاری خلاق با تمرکز بر یادگیری مستمر و رشد فردی",
      color: "bg-red-50 border-red-200",
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "همکاری در پروژه‌های بین‌المللی",
      description: "فرصت کار روی بزرگ‌ترین پروژه‌های فناوری کشور و منطقه",
      color: "bg-blue-50 border-blue-200",
    },
    {
      icon: <GraduationCap className="h-8 w-8" />,
      title: "آموزش تخصصی و رشد شغلی",
      description: "برنامه‌های آموزشی منظم و مسیر رشد شغلی مشخص",
      color: "bg-green-50 border-green-200",
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "حمایت از تحقیق و توسعه",
      description: "پشتیبانی از ایده‌های نوآورانه و پروژه‌های تحقیقاتی",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "تیم متخصص و حرفه‌ای",
      description: "همکاری با بهترین متخصصان صنعت فناوری",
      color: "bg-purple-50 border-purple-200",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "فناوری‌های پیشرفته",
      description: "کار با جدیدترین فناوری‌ها و ابزارهای روز دنیا",
      color: "bg-orange-50 border-orange-200",
    },
  ]

  const departments = [
    { name: "توسعه نرم‌افزار", positions: 8, icon: <Code className="h-6 w-6" /> },
    { name: "زیرساخت و DevOps", positions: 4, icon: <Database className="h-6 w-6" /> },
    { name: "اینترنت اشیا", positions: 3, icon: <Cpu className="h-6 w-6" /> },
    { name: "هوش مصنوعی", positions: 5, icon: <Lightbulb className="h-6 w-6" /> },
    { name: "امنیت اطلاعات", positions: 2, icon: <Shield className="h-6 w-6" /> },
    { name: "مدیریت پروژه", positions: 3, icon: <Briefcase className="h-6 w-6" /> },
  ]

  const companyStats = [
    { number: "۵۰+", label: "همکار متخصص" },
    { number: "۸۰+", label: "پروژه موفق" },
    { number: "۵", label: "سال تجربه" },
    { number: "۸", label: "صنعت مختلف" },
  ]

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <PersianHeader />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-[#F7F5F3]">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-[#37322F] mb-6 text-balance">فرصت‌های شغلی</h1>
          <p className="text-xl text-[#605A57] mb-8 max-w-3xl mx-auto text-pretty">
            به تیم متخصص ما بپیوندید و در پروژه‌های نوآورانه فناوری مشارکت کنید
          </p>

          {/* Company Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {companyStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-[#37322F]">{stat.number}</div>
                <div className="text-sm text-[#605A57]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 px-4 bg-[#F7F5F3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">موقعیت‌های شغلی باز</h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">
              فرصت‌های شغلی متنوع در حوزه‌های مختلف فناوری اطلاعات
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {jobOpenings.map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow relative">
                {job.urgent && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-100 text-red-800">فوری</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 mb-2">{job.title}</CardTitle>
                      <CardDescription className="text-gray-600">{job.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {job.department}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {job.type}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {job.experience}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">فناوری‌ها:</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">الزامات:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {job.requirements.slice(0, 3).map((req, reqIndex) => (
                          <li key={reqIndex} className="flex items-center gap-2">
                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-sm">مزایا:</h4>
                      <div className="flex flex-wrap gap-1">
                        {job.benefits.map((benefit, benefitIndex) => (
                          <Badge key={benefitIndex} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button className="w-full mt-4">ارسال رزومه</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">چرا با ما کار کنید؟</h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">مزایا و امکانات ویژه برای همکاران ما</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className={`${benefit.color} hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">{benefit.icon}</div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">{benefit.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 px-4 bg-[#F7F5F3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">بخش‌های مختلف</h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">تیم‌های تخصصی ما در حوزه‌های مختلف</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center border"
              >
                <div className="flex justify-center mb-4 text-purple-600">{dept.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{dept.name}</h3>
                <p className="text-sm text-gray-600">{dept.positions} موقعیت شغلی</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">فرآیند استخدام</h2>
            <p className="text-lg text-[#605A57] max-w-2xl mx-auto">مراحل ساده و شفاف برای پیوستن به تیم ما</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "۱", title: "ارسال رزومه", desc: "ارسال رزومه و نامه انگیزه" },
              { step: "۲", title: "بررسی اولیه", desc: "بررسی مدارک و تطبیق با موقعیت" },
              { step: "۳", title: "مصاحبه فنی", desc: "مصاحبه تخصصی و ارزیابی مهارت‌ها" },
              { step: "۴", title: "پیوستن به تیم", desc: "شروع همکاری و دوره آشنایی" },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#37322F] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[#37322F] mb-2">{item.title}</h3>
                <p className="text-[#605A57] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 bg-[#F7F5F3]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-4">ارسال رزومه</h2>
            <p className="text-lg text-[#605A57]">رزومه خود را برای ما ارسال کنید یا با ما تماس بگیرید</p>
          </div>

          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">نام و نام خانوادگی</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  placeholder="نام کامل خود را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">ایمیل</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  placeholder="ایمیل خود را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">شماره تماس</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  placeholder="شماره تماس خود را وارد کنید"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#37322F] mb-2">موقعیت مورد نظر</label>
                <select className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]">
                  <option>انتخاب کنید</option>
                  <option>توسعه‌دهنده Backend</option>
                  <option>توسعه‌دهنده Frontend</option>
                  <option>مهندس DevOps</option>
                  <option>کارشناس IoT</option>
                  <option>متخصص داده‌کاوی</option>
                  <option>کارشناس امنیت</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#37322F] mb-2">پیام (اختیاری)</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E0DEDB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37322F]"
                  placeholder="درباره خود و انگیزه‌تان برای همکاری بنویسید"
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#37322F] mb-2">آپلود رزومه</label>
                <div className="border-2 border-dashed border-[#E0DEDB] rounded-lg p-6 text-center hover:border-[#37322F] transition-colors">
                  <Award className="h-12 w-12 text-[#605A57] mx-auto mb-2" />
                  <p className="text-[#605A57]">فایل رزومه خود را اینجا بکشید یا کلیک کنید</p>
                  <p className="text-xs text-[#605A57] mt-1">PDF, DOC, DOCX - حداکثر ۵ مگابایت</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg">
              ارسال رزومه
            </Button>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-[#F7F5F3]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#37322F] mb-6">آماده شروع ماجراجویی جدید؟</h2>
          <p className="text-xl text-[#605A57] mb-8">با پیوستن به تیم ما، بخشی از آینده فناوری ایران باشید</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#37322F] text-white hover:bg-[#37322F]/90">
              مشاهده موقعیت‌ها
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-[#37322F] border-[#37322F] hover:bg-[#37322F]/5"
            >
              تماس با ما
            </Button>
          </div>
        </div>
      </section>

      <PersianFooter />
    </div>
  )
}
