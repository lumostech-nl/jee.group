"use client";

import { PersianHeader } from "../../components/persian-header";
import { PersianFooter } from "../../components/persian-footer";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingCart,
  Search,
  Calendar,
  Tag,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
import { Star, DollarSign, Wrench } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ProductsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<
    ProductsResponse["pagination"] | null
  >(null);
  const [ordering, setOrdering] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        ...(search && { search }),
      });

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error("Failed to fetch products");

      const data: ProductsResponse = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleOrder = (product: Product) => {
    if (!session) {
      toast({
        title: "ورود مورد نیاز",
        description: "برای ثبت سفارش باید وارد حساب کاربری خود شوید",
        variant: "destructive",
      });
      router.push("/auth/signin");
      return;
    }

    setSelectedProduct(product);
    setShowOrderModal(true);
  };

  const confirmOrder = async () => {
    if (!selectedProduct) return;

    try {
      setOrdering(true);
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              productId: selectedProduct.id,
              quantity: 1,
            },
          ],
          shippingAddress: "آدرس از پروفایل کاربر",
        }),
      });

      if (response.ok) {
        setOrderConfirmed(true);
        toast({
          title: "سفارش ثبت شد",
          description: "سفارش شما با موفقیت ثبت شد. تیم ما در حال بررسی است.",
          duration: 5000,
        });
      } else {
        console.log("Response status:", response.status);
        const errorData = await response.json();
        console.log("Error data:", errorData);

        if (response.status === 409) {
          // Duplicate order error
          console.log("Showing duplicate order toast");
          toast({
            title: "سفارش تکراری",
            description:
              errorData.message ||
              "شما قبلاً سفارش فعالی برای این سرویس دارید.",
            variant: "destructive",
            duration: 7000,
          });
        } else {
          throw new Error(errorData.message || "خطا در ثبت سفارش");
        }
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "خطا",
        description: "خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setOrdering(false);
    }
  };

  const closeOrderModal = () => {
    setShowOrderModal(false);
    setSelectedProduct(null);
    setOrderConfirmed(false);
  };

  return (
    <div className="w-full min-h-screen relative bg-[#F7F5F3] overflow-x-hidden flex flex-col">
      <PersianHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 sm:py-20 md:py-24 lg:py-32">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-16">
              <h1 className="text-[#37322F] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                سرویس ها
              </h1>
              <p className="text-[#605A57] text-lg sm:text-xl leading-relaxed max-w-[800px] mx-auto">
                مجموعه کاملی از راهکارهای نوآورانه و سرویس های با کیفیت برای
                پاسخگویی به نیازهای متنوع مشتریان
              </p>
            </div>

            {/* Search */}
            <div className="max-w-[600px] mx-auto">
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="جستجوی سرویس ها..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pr-10 text-right h-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse"
                  >
                    <div className="h-56 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-5 bg-gray-200 rounded mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="flex gap-2 mb-4">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-12"></div>
                      </div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                  {products.map((product) => (
                    <Card
                      key={product.id}
                      className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-0 shadow-lg flex flex-col h-full"
                    >
                      {product.image ? (
                        <div className="h-56 relative overflow-hidden -mt-6 -mx-6">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                        </div>
                      ) : (
                        <div className="h-56 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center -mt-6 -mx-6">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                              <Tag className="w-8 h-8 text-blue-500" />
                            </div>
                            <p className="text-sm text-gray-600">بدون تصویر</p>
                          </div>
                        </div>
                      )}

                      <CardContent className="p-6 flex flex-col flex-1">
                        <div className="flex flex-col flex-1">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
                              {product.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-end mb-4">
                            <Badge
                              variant="outline"
                              className="bg-[#37322F] text-white border-[#37322F]"
                            >
                              <Tag className="w-3 h-3 mr-1" />
                              {product.category}
                            </Badge>
                          </div>

                          <Button
                            onClick={() => handleOrder(product)}
                            disabled={!product.isActive || ordering}
                            className="w-full bg-[#37322F] hover:bg-[#37322F]/90 text-white font-medium py-2.5 transition-all duration-200 mt-auto"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {ordering ? "در حال ثبت..." : "ثبت سفارش"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="border-[#37322F] text-[#37322F] hover:bg-[#37322F] hover:text-white"
                    >
                      قبلی
                    </Button>

                    <span className="px-4 text-[#605A57]">
                      صفحه {pagination.page} از {pagination.pages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.pages}
                      className="border-[#37322F] text-[#37322F] hover:bg-[#37322F] hover:text-white"
                    >
                      بعدی
                    </Button>
                  </div>
                )}
              </>
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  سرویسی یافت نشد
                </h3>
                <p className="text-gray-600 mb-6">
                  متأسفانه هیچ سرویسی با این معیارها پیدا نشد
                </p>
                <Button
                  onClick={() => setSearch("")}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  مشاهده همه سرویس‌ها
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-[#37322F] text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-4">
                چرا سرویس های ما؟
              </h2>
              <p className="text-[#605A57] text-lg leading-relaxed max-w-[600px] mx-auto">
                کیفیت بالا، قیمت مناسب و پشتیبانی فنی مستمر از ویژگی‌های بارز
                سرویس های ما است
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-2">
                  کیفیت برتر
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  استفاده از بهترین مواد اولیه و فناوری‌های روز
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <DollarSign className="w-8 h-8" />
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-2">
                  قیمت‌گذاری شفاف
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  قیمت‌گذاری منصفانه و شفاف برای تمام سرویس‌ها
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-[#37322F] rounded-full flex items-center justify-center text-white mx-auto mb-4">
                  <Wrench className="w-8 h-8" />
                </div>
                <h3 className="text-[#37322F] text-lg font-semibold mb-2">
                  پشتیبانی فنی
                </h3>
                <p className="text-[#605A57] text-sm leading-relaxed">
                  خدمات پس از فروش و پشتیبانی ۲۴ ساعته
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 border-t border-[rgba(55,50,47,0.12)] bg-[#37322F] text-white">
          <div className="max-w-[1060px] mx-auto px-4 sm:px-6 md:px-8 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold leading-tight mb-6">
              آماده استفاده از سرویس‌ها هستید؟
            </h2>
            <p className="text-lg leading-relaxed mb-8 opacity-90 max-w-[600px] mx-auto">
              با تیم فروش ما در تماس باشید و از مشاوره رایگان برای انتخاب بهترین
              سرویس بهره‌مند شوید
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-3 bg-white text-[#37322F] rounded-full font-medium hover:bg-gray-100 transition-colors">
                تماس با فروش
              </button>
              <button className="px-8 py-3 border border-white text-white rounded-full font-medium hover:bg-white hover:text-[#37322F] transition-colors">
                مشاهده کاتالوگ
              </button>
            </div>
          </div>
        </section>
      </main>

      <PersianFooter />

      {/* Order Confirmation Modal */}
      <Dialog open={showOrderModal} onOpenChange={closeOrderModal}>
        <DialogContent className="max-w-md">
          {!orderConfirmed ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-center">تأیید سفارش</DialogTitle>
                <DialogDescription className="text-right">
                  آیا از ثبت سفارش برای "{selectedProduct?.name}" اطمینان دارید؟
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    سرویس انتخاب شده:
                  </h4>
                  <p className="text-gray-700">{selectedProduct?.name}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedProduct?.description}
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    نحوه پردازش:
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• تیم ما سفارش شما را بررسی خواهد کرد</li>
                    <li>• در صورت تأیید، با شما تماس خواهیم گرفت</li>
                    <li>
                      • می‌توانید وضعیت سفارش را در داشبورد خود پیگیری کنید
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={closeOrderModal}
                    variant="outline"
                    className="flex-1"
                  >
                    انصراف
                  </Button>
                  <Button
                    onClick={confirmOrder}
                    disabled={ordering}
                    className="flex-1 bg-[#37322F] hover:bg-[#37322F]/90"
                  >
                    {ordering ? "در حال ثبت..." : "تأیید سفارش"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <DialogTitle className="text-center text-green-600">
                  سفارش ثبت شد!
                </DialogTitle>
                <DialogDescription className="text-center">
                  سفارش شما با موفقیت ثبت شد و تیم ما در حال بررسی آن است.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">
                    مراحل بعدی:
                  </h4>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>• تیم ما سفارش شما را بررسی خواهد کرد</li>
                    <li>• در صورت تأیید، با شما تماس خواهیم گرفت</li>
                    <li>
                      • می‌توانید وضعیت سفارش را در داشبورد خود پیگیری کنید
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={closeOrderModal}
                    variant="outline"
                    className="flex-1"
                  >
                    بستن
                  </Button>
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="flex-1 bg-[#37322F] hover:bg-[#37322F]/90"
                  >
                    مشاهده داشبورد
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
