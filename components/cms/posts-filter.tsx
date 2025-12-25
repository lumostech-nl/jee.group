"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface PostsFilterProps {
  currentSearch: string;
  currentStatus: string;
  currentCategory: string;
  currentAuthor: string;
  userRole: string;
}

export function PostsFilter({
  currentSearch,
  currentStatus,
  currentCategory,
  currentAuthor,
  userRole,
}: PostsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(currentSearch);
  const [status, setStatus] = useState(currentStatus || "all");
  const [category, setCategory] = useState(currentCategory || "all");
  const [author, setAuthor] = useState(currentAuthor || "all");

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);

    if (search) params.set("search", search);
    else params.delete("search");

    if (status && status !== "all") params.set("status", status);
    else params.delete("status");

    if (category && category !== "all") params.set("category", category);
    else params.delete("category");

    if (author && author !== "all") params.set("author", author);
    else params.delete("author");

    params.set("page", "1"); // Reset to first page

    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setAuthor("all");
    router.push("/cms/posts");
  };

  const hasActiveFilters =
    search || status !== "all" || category !== "all" || author !== "all";

  return (
    <div className="space-y-4" dir="rtl">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="جستجوی پست‌ها..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          className="pl-10 text-right"
          dir="rtl"
        />
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3" dir="rtl">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            وضعیت:
          </label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40 text-right cursor-pointer" dir="rtl">
              <SelectValue placeholder="انتخاب وضعیت" />
            </SelectTrigger>
            <SelectContent className="cursor-pointer" dir="rtl">
              <SelectItem className="cursor-pointer text-right" value="all">
                همه وضعیت‌ها
              </SelectItem>
              <SelectItem className="text-right" value="DRAFT">
                پیش‌نویس
              </SelectItem>
              <SelectItem className="text-right" value="PUBLISHED">
                منتشر شده
              </SelectItem>
              <SelectItem className="text-right" value="SCHEDULED">
                زمان‌بندی شده
              </SelectItem>
              <SelectItem className="text-right" value="ARCHIVED">
                بایگانی شده
              </SelectItem>
              <SelectItem className="text-right" value="TRASH">
                حذف شده
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
            دسته‌بندی:
          </label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-40 text-right cursor-pointer" dir="rtl">
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem className="text-right cursor-pointer" value="all">
                همه دسته‌بندی‌ها
              </SelectItem>
              <SelectItem className="text-right" value="tutorial">
                آموزش
              </SelectItem>
              <SelectItem className="text-right" value="news">
                اخبار
              </SelectItem>
              <SelectItem className="text-right" value="guide">
                راهنما
              </SelectItem>
              <SelectItem className="text-right" value="review">
                بررسی
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {userRole !== "AUTHOR" && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              نویسنده:
            </label>
            <Select value={author} onValueChange={setAuthor}>
              <SelectTrigger
                className="w-40 text-right cursor-pointer"
                dir="rtl"
              >
                <SelectValue placeholder="انتخاب نویسنده" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                <SelectItem className="text-right" value="all">
                  همه نویسندگان
                </SelectItem>
                {/* This would be populated from API in a real implementation */}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex gap-2">
          <Button onClick={handleSearch} size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            اعمال فیلتر
          </Button>

          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              size="sm"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              پاک کردن
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2" dir="rtl">
          <span className="text-sm text-muted-foreground">فیلترهای فعال:</span>
          {search && (
            <Badge variant="secondary" className="gap-1 flex items-center">
              جستجو: "{search}"
              <X
                className="h-3 w-3 cursor-pointer mr-1"
                onClick={() => {
                  setSearch("");
                  handleSearch();
                }}
              />
            </Badge>
          )}
          {status !== "all" && (
            <Badge variant="secondary" className="gap-1 flex items-center">
              وضعیت: {status}
              <X
                className="h-3 w-3 cursor-pointer mr-1"
                onClick={() => {
                  setStatus("all");
                  handleSearch();
                }}
              />
            </Badge>
          )}
          {category !== "all" && (
            <Badge variant="secondary" className="gap-1 flex items-center">
              دسته‌بندی: {category}
              <X
                className="h-3 w-3 cursor-pointer mr-1"
                onClick={() => {
                  setCategory("all");
                  handleSearch();
                }}
              />
            </Badge>
          )}
          {author !== "all" && userRole !== "AUTHOR" && (
            <Badge variant="secondary" className="gap-1 flex items-center">
              نویسنده: {author}
              <X
                className="h-3 w-3 cursor-pointer mr-1"
                onClick={() => {
                  setAuthor("all");
                  handleSearch();
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
