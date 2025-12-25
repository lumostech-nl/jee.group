"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PersianHeader } from "@/components/persian-header";
import { PersianFooter } from "@/components/persian-footer";
import { emitAppEvent, AppEvents } from "@/lib/app-events";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Save,
  Shield,
  Bell,
  Trash2,
  Upload,
  Camera,
} from "lucide-react";

interface UserProfile {
  name: string;
  email: string;
  image?: string;
  role: string;
  createdAt: string;
}

export default function SettingsPage() {
  const { data: session, status, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Profile picture states
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [ticketNotifications, setTicketNotifications] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      redirect("/auth/signin");
    }

    fetchProfile();
  }, [session, status]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/profile");
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setName(data.name || "");
        setEmail(data.email || "");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "لطفاً فقط فایل تصویر انتخاب کنید" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: "error",
        text: "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      });
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload image
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploadingImage(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/user/profile/image", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setProfile((prev) => (prev ? { ...prev, image: data.image } : null));
        await update(); // Update the session

        // Emit event to update other components (like header)
        emitAppEvent(AppEvents.USER_PROFILE_UPDATED, {
          user: { ...session?.user, image: data.image },
        });

        setMessage({
          type: "success",
          text: "عکس پروفایل با موفقیت به‌روزرسانی شد",
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "خطا در آپلود عکس",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در اتصال به سرور" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        await update(); // Update the session

        // Emit event to update other components (like header)
        emitAppEvent(AppEvents.USER_PROFILE_UPDATED, {
          user: { ...session?.user, name },
        });

        setMessage({
          type: "success",
          text: "اطلاعات پروفایل با موفقیت به‌روزرسانی شد",
        });
      } else {
        const error = await response.json();
        setMessage({
          type: "error",
          text: error.message || "خطا در به‌روزرسانی پروفایل",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در اتصال به سرور" });
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSettings = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/user/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          emailNotifications,
          orderNotifications,
          ticketNotifications,
        }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "تنظیمات اعلان‌ها ذخیره شد" });
      } else {
        setMessage({ type: "error", text: "خطا در ذخیره تنظیمات اعلان‌ها" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "خطا در اتصال به سرور" });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="w-full min-h-screen bg-[#F7F5F3]" dir="rtl">
        <PersianHeader />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-pulse text-[#37322F]">در حال بارگذاری...</div>
        </div>
        <PersianFooter />
      </div>
    );
  }

  return (
    <div
      className="w-full min-h-screen bg-[#F7F5F3] overflow-x-hidden flex flex-col justify-start items-center"
      dir="rtl"
    >
      <PersianHeader />

      <div className="relative flex flex-col justify-start items-center w-full">
        <div className="w-full max-w-none px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] relative flex flex-col justify-start items-start min-h-screen">
          {/* Left vertical line */}
          <div className="w-[1px] h-full absolute right-4 sm:right-6 md:right-8 lg:right-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>
          {/* Right vertical line */}
          <div className="w-[1px] h-full absolute left-4 sm:left-6 md:left-8 lg:left-0 top-0 bg-[rgba(55,50,47,0.12)] shadow-[1px_0px_0px_white] z-0"></div>

          <div className="self-stretch pt-[9px] overflow-hidden border-b border-[rgba(55,50,47,0.06)] flex flex-col justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[66px] relative z-10">
            {/* Settings Header */}
            <div className="pt-16 sm:pt-20 md:pt-24 lg:pt-[80px] pb-8 sm:pb-12 md:pb-16 flex flex-col justify-start items-center px-2 sm:px-4 md:px-8 lg:px-0 w-full">
              <div className="w-full max-w-[937px] lg:w-[937px] flex flex-col justify-center items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                <div className="self-stretch rounded-[3px] flex flex-col justify-center items-center gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                  <div className="w-full max-w-[748.71px] lg:w-[748.71px] text-center flex justify-center flex-col text-[#37322F] text-[22px] xs:text-[28px] sm:text-[36px] md:text-[52px] lg:text-[60px] font-bold leading-[1.1] sm:leading-[1.15] md:leading-[1.2] lg:leading-24 font-serif px-2 sm:px-4 md:px-0">
                    تنظیمات حساب کاربری
                  </div>
                  <div className="w-full max-w-[506.08px] lg:w-[506.08px] text-center flex justify-center flex-col text-[rgba(55,50,47,0.80)] sm:text-lg md:text-xl leading-[1.4] sm:leading-[1.45] md:leading-[1.5] lg:leading-7 font-sans px-2 sm:px-4 md:px-0 lg:text-lg font-medium text-sm">
                    اطلاعات شخصی، عکس پروفایل و تنظیمات اعلان‌های خود را مدیریت
                    کنید
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="w-full py-8 sm:py-12 md:py-16">
            <div className="max-w-[1060px] mx-auto px-4">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg text-right ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-white border border-[rgba(55,50,47,0.08)] mb-8">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-[rgba(55,50,47,0.05)] text-right"
                  >
                    اطلاعات شخصی
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-[rgba(55,50,47,0.05)] text-right"
                  >
                    اعلان‌ها
                  </TabsTrigger>
                </TabsList>

                {/* Profile Settings */}
                <TabsContent value="profile">
                  <Card className="border border-[rgba(55,50,47,0.08)]">
                    <CardHeader>
                      <CardTitle className="text-right">اطلاعات شخصی</CardTitle>
                      <CardDescription className="text-right">
                        نام و عکس پروفایل خود را به‌روزرسانی کنید
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handleProfileUpdate}
                        className="space-y-6"
                      >
                        <div className="flex items-center gap-6 flex-row-reverse">
                          <div className="text-right flex-1">
                            <h3 className="font-medium text-[#37322F] text-right">
                              {profile?.name}
                            </h3>
                            <p className="text-sm text-[#828387] text-right">
                              {profile?.email}
                            </p>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                document
                                  .getElementById("profile-image")
                                  ?.click()
                              }
                              className="mt-2 text-right"
                              disabled={uploadingImage}
                            >
                              <Upload className="h-4 w-4 ml-2" />
                              {uploadingImage ? "در حال آپلود..." : "تغییر عکس"}
                            </Button>
                          </div>
                          <div className="relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#37322F] bg-gray-100">
                              {imagePreview ? (
                                <img
                                  src={imagePreview}
                                  alt="Profile preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : profile?.image ? (
                                <img
                                  src={profile.image}
                                  alt="Profile"
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-full h-full bg-[#37322F] flex items-center justify-center">
                                  <User className="h-10 w-10 text-white" />
                                </div>
                              )}
                            </div>
                            <label
                              htmlFor="profile-image"
                              className="absolute -bottom-2 -left-2 w-8 h-8 bg-[#37322F] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#37322F]/90 transition-colors"
                            >
                              <Camera className="h-4 w-4 text-white" />
                              <input
                                id="profile-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label
                              htmlFor="name"
                              className="text-right block text-sm font-medium text-[#37322F]"
                            >
                              نام کامل
                            </label>
                            <Input
                              id="name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="text-right"
                              placeholder="نام خود را وارد کنید"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-right block text-sm font-medium text-[#37322F]">
                              ایمیل
                            </label>
                            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700 text-right">
                                {profile?.email}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 text-right">
                              ایمیل شما قابل تغییر نیست
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-[#828387] mb-2">
                            عضو از:{" "}
                            {profile?.createdAt
                              ? new Date(profile.createdAt).toLocaleDateString(
                                  "fa-IR"
                                )
                              : ""}
                          </p>
                          <p className="text-sm text-[#828387]">
                            نقش: {profile?.role === "ADMIN" ? "مدیر" : "کاربر"}
                          </p>
                        </div>

                        <div className="flex justify-end">
                          <Button
                            type="submit"
                            disabled={saving}
                            className="bg-[#37322F] hover:bg-[#37322F]/90"
                          >
                            <Save className="h-4 w-4 ml-2" />
                            {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Notification Settings */}
                <TabsContent value="notifications">
                  <Card className="border border-[rgba(55,50,47,0.08)]">
                    <CardHeader>
                      <CardTitle className="text-right">
                        تنظیمات اعلان‌ها
                      </CardTitle>
                      <CardDescription className="text-right">
                        نحوه دریافت اعلان‌ها را مدیریت کنید
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between flex-row-reverse">
                          <div className="text-right flex-1">
                            <label className="text-sm font-medium text-[#37322F] text-right block">
                              اعلان‌های ایمیلی
                            </label>
                            <p className="text-xs text-[#828387] text-right">
                              دریافت اعلان‌ها از طریق ایمیل
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) =>
                              setEmailNotifications(e.target.checked)
                            }
                            className="w-4 h-4 text-[#37322F] bg-gray-100 border-gray-300 rounded focus:ring-[#37322F] ml-4"
                          />
                        </div>

                        <div className="flex items-center justify-between flex-row-reverse">
                          <div className="text-right flex-1">
                            <label className="text-sm font-medium text-[#37322F] text-right block">
                              اعلان‌های سفارش
                            </label>
                            <p className="text-xs text-[#828387] text-right">
                              اطلاع از وضعیت سفارش‌ها
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={orderNotifications}
                            onChange={(e) =>
                              setOrderNotifications(e.target.checked)
                            }
                            className="w-4 h-4 text-[#37322F] bg-gray-100 border-gray-300 rounded focus:ring-[#37322F] ml-4"
                          />
                        </div>

                        <div className="flex items-center justify-between flex-row-reverse">
                          <div className="text-right flex-1">
                            <label className="text-sm font-medium text-[#37322F] text-right block">
                              اعلان‌های تیکت
                            </label>
                            <p className="text-xs text-[#828387] text-right">
                              اطلاع از به‌روزرسانی تیکت‌های پشتیبانی
                            </p>
                          </div>
                          <input
                            type="checkbox"
                            checked={ticketNotifications}
                            onChange={(e) =>
                              setTicketNotifications(e.target.checked)
                            }
                            className="w-4 h-4 text-[#37322F] bg-gray-100 border-gray-300 rounded focus:ring-[#37322F] ml-4"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={handleNotificationSettings}
                          disabled={saving}
                          className="bg-[#37322F] hover:bg-[#37322F]/90"
                        >
                          <Bell className="h-4 w-4 ml-2" />
                          {saving ? "در حال ذخیره..." : "ذخیره تنظیمات"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <PersianFooter />
    </div>
  );
}
