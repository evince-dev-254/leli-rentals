"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ArrowRight, Grid3X3, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categories } from "@/lib/categories-data"

export function CategoriesPageContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="gradient-mesh min-h-screen">
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Browse Categories</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Discover thousands of items across all our rental categories
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              className="pl-14 h-14 text-lg glass-card bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 px-4 pb-20">
        <div className="container mx-auto">
          {/* View Toggle */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredCategories.length}</span> categories found
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`} className="group">
                  <div
                    className={`glass-card rounded-2xl overflow-hidden bg-gradient-to-br ${category.color} hover:shadow-xl transition-all duration-300`}
                  >
                    {/* Image */}
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={category.image || "/placeholder.svg"}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
                          {category.count.toLocaleString()}+ items
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-10 h-10 rounded-lg bg-background/80 flex items-center justify-center">
                          <category.icon className="h-5 w-5 text-primary" />
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredCategories.map((category) => (
                <Link key={category.id} href={`/categories/${category.id}`} className="group block">
                  <div
                    className={`glass-card rounded-2xl p-5 bg-gradient-to-r ${category.color} hover:shadow-lg transition-all duration-300`}
                  >
                    <div className="flex items-center gap-6">
                      {/* Icon */}
                      <div className="w-16 h-16 rounded-xl bg-background/80 flex items-center justify-center shrink-0">
                        <category.icon className="h-8 w-8 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold mb-1">{category.name}</h3>
                        <p className="text-muted-foreground line-clamp-1">{category.description}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {category.subcategories.slice(0, 4).map((sub) => (
                            <Badge key={sub.name} variant="secondary" className="text-xs">
                              {sub.name}
                            </Badge>
                          ))}
                          {category.subcategories.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{category.subcategories.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-2xl font-bold text-primary">{category.count.toLocaleString()}+</p>
                        <p className="text-sm text-muted-foreground">items</p>
                      </div>

                      {/* Arrow */}
                      <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
