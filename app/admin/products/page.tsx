"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Package, Eye, EyeOff } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";
import { toast } from "@/hooks/use-toast";
import { ProductDialog, type Product, type Category } from "@/components/admin";

export default function AdminProductsPage() {
  const { data: session, status } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "ADMIN") {
      redirect("/");
    }

    fetchProducts();
  }, [session, status]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products?limit=100"),
        fetch("/api/categories"),
      ]);

      if (productsRes.ok) {
        const data = await productsRes.json();
        setProducts(data.products || []);
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "خطا",
        description: "خطا در بارگذاری اطلاعات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: "محصول با موفقیت حذف شد",
        });
        fetchProducts();
      } else {
        throw new Error("خطا در حذف محصول");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "خطا",
        description: "خطا در حذف محصول",
        variant: "destructive",
      });
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDialogSuccess = () => {
    fetchProducts();
  };

  const handleCategoriesUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  if (status === "loading" || loading) {
    return (
      <AdminLayout>
        <div className="w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#37322F]">
              مدیریت محصولات
            </h1>
            <p className="text-[#605A57] mt-1">
              مدیریت و ویرایش محصولات و سرویس‌ها
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingProduct(null);
              setIsDialogOpen(true);
            }}
            className="bg-[#37322F] hover:bg-[#37322F]/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            افزودن محصول
          </Button>

          <ProductDialog
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
            onSuccess={handleDialogSuccess}
            editingProduct={editingProduct}
            categories={categories}
            onCategoriesUpdate={handleCategoriesUpdate}
          />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              {product.image && (
                <div className="h-48 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant={product.isActive ? "default" : "secondary"}>
                      {product.isActive ? (
                        <>
                          <Eye className="w-3 h-3 mr-1" />
                          فعال
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 mr-1" />
                          غیرفعال
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {product.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{product.category}</Badge>
                    <span className="text-sm text-[#605A57]">
                      {new Date(product.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      ویرایش
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="flex-1"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-[#605A57] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#37322F] mb-2">
              محصولی یافت نشد
            </h3>
            <p className="text-[#605A57] mb-4">اولین محصول خود را اضافه کنید</p>
            <Button
              onClick={() => {
                setEditingProduct(null);
                setIsDialogOpen(true);
              }}
              className="bg-[#37322F] hover:bg-[#37322F]/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              افزودن محصول
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
