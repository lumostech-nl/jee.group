"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FileText,
  Folder,
  Tag,
  Calendar,
  User,
  ArrowRight,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface SearchResult {
  id: string;
  type: "post" | "category" | "tag";
  title: string;
  excerpt: string;
  slug: string;
  url: string;
  publishedAt?: string;
  author?: string;
  categories?: string[];
  tags?: string[];
  postCount?: number;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
  page: number;
  totalPages: number;
  type: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState(initialType);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const performSearch = async (
    searchQuery: string,
    searchType: string,
    page = 1
  ) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotal(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(
          searchQuery
        )}&type=${searchType}&page=${page}&limit=20`
      );
      const data: SearchResponse = await response.json();

      setResults(data.results);
      setTotal(data.total);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);

      // Update URL without triggering navigation
      const params = new URLSearchParams();
      params.set("q", searchQuery);
      params.set("type", searchType);
      params.set("page", page.toString());
      window.history.replaceState({}, "", `/search?${params.toString()}`);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery, initialType);
    }
  }, [initialQuery, initialType]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query, type);
  };

  const handleTypeChange = (newType: string) => {
    setType(newType);
    performSearch(query, newType);
  };

  const handlePageChange = (page: number) => {
    performSearch(query, type, page);
  };

  const getResultIcon = (resultType: string) => {
    switch (resultType) {
      case "post":
        return <FileText className="h-4 w-4" />;
      case "category":
        return <Folder className="h-4 w-4" />;
      case "tag":
        return <Tag className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  const getResultBadgeColor = (resultType: string) => {
    switch (resultType) {
      case "post":
        return "default";
      case "category":
        return "secondary";
      case "tag":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Search</h1>
          <p className="text-lg text-muted-foreground">
            Find articles, categories, and tags on our blog
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for articles, topics, or keywords..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </div>
        </form>

        {/* Search Tabs */}
        <Tabs value={type} onValueChange={handleTypeChange} className="mb-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <p className="text-muted-foreground">
              {loading
                ? "Searching..."
                : `Found ${total} result${
                    total !== 1 ? "s" : ""
                  } for "${query}"`}
            </p>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="space-y-4 mb-8">
            {results.map((result) => (
              <Card key={result.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getResultBadgeColor(result.type)}>
                          {result.type}
                        </Badge>
                        <Link
                          href={result.url}
                          className="text-lg font-semibold hover:text-primary transition-colors"
                        >
                          {result.title}
                        </Link>
                      </div>

                      <p className="text-muted-foreground line-clamp-2">
                        {result.excerpt}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {result.type === "post" && (
                          <>
                            {result.author && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                {result.author}
                              </div>
                            )}
                            {result.publishedAt && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {formatDistanceToNow(
                                  new Date(result.publishedAt),
                                  { addSuffix: true }
                                )}
                              </div>
                            )}
                            {result.categories &&
                              result.categories.length > 0 && (
                                <div className="flex gap-1">
                                  {result.categories
                                    .slice(0, 2)
                                    .map((category) => (
                                      <Badge
                                        key={category}
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {category}
                                      </Badge>
                                    ))}
                                </div>
                              )}
                          </>
                        )}

                        {result.postCount !== undefined && (
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {result.postCount} post
                            {result.postCount !== 1 ? "s" : ""}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={result.url}>
                            {result.type === "post" ? "Read More" : "View"}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {query && !loading && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or browse our popular categories.
            </p>
            <Button variant="outline" asChild>
              <Link href="/blog">Browse All Posts</Link>
            </Button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {currentPage > 1 && (
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
            )}

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                const isActive = pageNumber === currentPage;

                return (
                  <Button
                    key={pageNumber}
                    variant={isActive ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            {currentPage < totalPages && (
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            )}
          </div>
        )}

        {/* Search Tips */}
        {!query && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
              <CardDescription>Get the most out of your search</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Use specific keywords for better results</li>
                <li>• Try searching for categories or tags</li>
                <li>• Search within post content, titles, and excerpts</li>
                <li>• Use quotes for exact phrase matching</li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Search</h1>
              <p className="text-lg text-muted-foreground">
                Find articles, categories, and tags on our blog
              </p>
            </div>
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-8"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
