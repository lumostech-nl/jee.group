"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  image: string;
  category: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingProduct: Product | null;
  categories: Category[];
  onCategoriesUpdate: (categories: Category[]) => void;
}

export function ProductDialog({
  isOpen,
  onClose,
  onSuccess,
  editingProduct,
  categories,
  onCategoriesUpdate,
}: ProductDialogProps) {
  const [uploading, setUploading] = useState(false);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({
    name: editingProduct?.name || "",
    description: editingProduct?.description || "",
    image: editingProduct?.image || "",
    category: editingProduct?.category || "",
    isActive: editingProduct?.isActive ?? true,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      category: "",
      isActive: true,
    });
  };

  // Update form data when editingProduct changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        image: editingProduct.image || "",
        category: editingProduct.category,
        isActive: editingProduct.isActive,
      });
    } else {
      resetForm();
    }
  }, [editingProduct]);

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cms/media/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          return data.url;
        }
      }
      throw new Error("Upload failed");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "خطا",
        description: "خطا در آپلود تصویر",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setFormData((prev) => ({ ...prev, image: imageUrl }));
      }
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setCreatingCategory(true);
      const response = await fetch("/api/cms/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newCategoryName.trim(),
          isActive: true,
        }),
      });

      if (response.ok) {
        const newCategory = await response.json();
        const updatedCategories = [...categories, newCategory];
        onCategoriesUpdate(updatedCategories);
        setFormData((prev) => ({ ...prev, category: newCategory.name }));
        setShowCategoryInput(false);
        setNewCategoryName("");
        toast({
          title: "موفق",
          description: "دسته‌بندی با موفقیت اضافه شد",
        });
      } else {
        throw new Error("خطا در ایجاد دسته‌بندی");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      toast({
        title: "خطا",
        description: "خطا در ایجاد دسته‌بندی",
        variant: "destructive",
      });
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "موفق",
          description: editingProduct
            ? "محصول با موفقیت ویرایش شد"
            : "محصول با موفقیت اضافه شد",
        });
        onSuccess();
        handleClose();
      } else {
        const error = await response.json();
        throw new Error(error.error || "خطا در ذخیره محصول");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "خطا",
        description:
          error instanceof Error ? error.message : "خطا در ذخیره محصول",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setShowCategoryInput(false);
    setNewCategoryName("");
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingProduct ? "ویرایش محصول" : "افزودن محصول جدید"}
          </DialogTitle>
          <DialogDescription>
            {editingProduct
              ? "اطلاعات محصول را ویرایش کنید"
              : "اطلاعات محصول جدید را وارد کنید"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div className="space-y-2">
            <Label htmlFor="name">نام محصول *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="نام محصول را وارد کنید"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 break-words overflow-wrap break-word whitespace-pre-wrap">
            <Label htmlFor="description">توضیحات *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="توضیحات محصول را وارد کنید"
              rows={4}
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">دسته‌بندی *</Label>

            {!showCategoryInput ? (
              <div className="space-y-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCategoryInput(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  افزودن دسته‌بندی جدید
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="نام دسته‌بندی جدید"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={creatingCategory}
                />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    size="sm"
                    className="flex-1"
                  >
                    {creatingCategory ? "در حال ایجاد..." : "ایجاد"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCategoryInput(false);
                      setNewCategoryName("");
                    }}
                    size="sm"
                    className="flex-1"
                  >
                    انصراف
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="image">تصویر کاور</Label>

            {formData.image && (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="Product preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, image: "" }))
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="flex-1"
              />
              {uploading && (
                <div className="text-sm text-[#605A57]">در حال آپلود...</div>
              )}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded"
            />
            <Label htmlFor="isActive">محصول فعال است</Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              انصراف
            </Button>
            <Button
              type="submit"
              className="bg-[#37322F] hover:bg-[#37322F]/90"
              disabled={uploading}
            >
              {editingProduct ? "ویرایش" : "افزودن"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
