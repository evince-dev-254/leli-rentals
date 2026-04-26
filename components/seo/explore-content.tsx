"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { seoCategories, seoCities } from "@/lib/seo-pages-data"

type Tab = "renter" | "owner" | "competitor"

const intentLabels: Record<Tab, string> = {
  renter: "Renter Pages",
  owner: "Owner Pages",
  competitor: "Competitor Pages",
}

const intentDescriptions: Record<Tab, string> = {
  renter: "Pages targeting people looking to rent items in specific cities",
  owner: "Pages targeting asset owners looking to earn passive income",
  competitor: "Pages targeting users switching from competitor platforms",
}

const intentColors: Record<Tab, string> = {
  renter: "bg-blue-100 text-blue-700 border-blue-200",
  owner: "bg-green-100 text-green-700 border-green-200",
  competitor: "bg-red-100 text-red-700 border-red-200",
}

const intentBadge: Record<Tab, string> = {
  renter: "bg-blue-600",
  owner: "bg-green-600",
  competitor: "bg-red-600",
}

export function ExploreContent() {
  const [search, setSearch] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("renter")
  const [activeCat, setActiveCat] = useState<string>("all")
  const [showAll, setShowAll] = useState<Record<string, boolean>>({})

  // Build all pages data
  const allPages = useMemo(() => {
    const pages: {
      slug: string
      label: string
      category: string
      categoryId: string
      intent: Tab
    }[] = []

    for (const cat of seoCategories) {
      // Renter pages
      for (const kw of cat.renterKeywords) {
        for (const city of seoCities) {
          pages.push({
            slug: `${kw.slug}-in-${city.slug}`,
            label: `${kw.label} in ${city.name}`,
            category: cat.name,
            categoryId: cat.id,
            intent: "renter",
          })
        }
      }
      // Owner pages
      for (const kw of cat.ownerKeywords) {
        pages.push({
          slug: kw.slug,
          label: kw.label,
          category: cat.name,
          categoryId: cat.id,
          intent: "owner",
        })
      }
      // Competitor pages
      for (const kw of cat.competitorKeywords) {
        pages.push({
          slug: kw.slug,
          label: kw.label,
          category: cat.name,
          categoryId: cat.id,
          intent: "competitor",
        })
      }
    }
    return pages
  }, [])

  // Filter by tab + category + search
  const filtered = useMemo(() => {
    return allPages.filter((p) => {
      const matchIntent = p.intent === activeTab
      const matchCat = activeCat === "all" || p.categoryId === activeCat
      const matchSearch =
        search.trim() === "" ||
        p.label.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase())
      return matchIntent && matchCat && matchSearch
    })
  }, [allPages, activeTab, activeCat, search])

  // Group by category
  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {}
    for (const p of filtered) {
      if (!map[p.category]) map[p.category] = []
      map[p.category].push(p)
    }
    return map
  }, [filtered])

  // Stats
  const totalRenter = allPages.filter((p) => p.intent === "renter").length
  const totalOwner = allPages.filter((p) => p.intent === "owner").length
  const totalCompetitor = allPages.filter((p) => p.intent === "competitor").length

  const SHOW_LIMIT = 50

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-700 text-white pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Explore All Rentals Worldwide</h1>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Browse every rental category across 100 global cities. Find exactly what you need — or list what you own
            and start earning.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {[
              { label: "Renter Pages", count: totalRenter.toLocaleString(), color: "bg-blue-500" },
              { label: "Owner Pages", count: totalOwner.toLocaleString(), color: "bg-green-500" },
              { label: "Competitor Pages", count: totalCompetitor.toLocaleString(), color: "bg-red-500" },
              {
                label: "Total Pages",
                count: (totalRenter + totalOwner + totalCompetitor).toLocaleString(),
                color: "bg-purple-500",
              },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className={`text-3xl font-bold ${s.color} text-white px-6 py-2 rounded-xl mb-1`}>
                  {s.count}
                </div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by keyword, city, or category..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setShowAll({})
              }}
              className="w-full px-5 py-4 rounded-2xl text-slate-900 text-base outline-none shadow-lg pr-12 bg-white border-2 border-white/80 focus:border-blue-400 placeholder:text-slate-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xl"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Intent Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {(["renter", "owner", "competitor"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setShowAll({})
              }}
              className={`flex-1 px-6 py-4 rounded-2xl border-2 text-left transition-all ${activeTab === tab
                ? `${intentColors[tab]} border-current font-semibold`
                : "border-slate-200 text-slate-500 hover:border-slate-300 bg-white"
                }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{intentLabels[tab]}</span>
                <span
                  className={`text-xs text-white px-2 py-0.5 rounded-full ${intentBadge[tab]}`}
                >
                  {tab === "renter"
                    ? totalRenter.toLocaleString()
                    : tab === "owner"
                      ? totalOwner.toLocaleString()
                      : totalCompetitor.toLocaleString()}
                </span>
              </div>
              <p className="text-xs opacity-70">{intentDescriptions[tab]}</p>
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setActiveCat("all"); setShowAll({}) }}
            className={`px-4 py-2 rounded-full text-sm border transition-all ${activeCat === "all"
              ? "bg-slate-900 text-white border-slate-900"
              : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
          >
            All Categories
          </button>
          {seoCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCat(cat.id); setShowAll({}) }}
              className={`px-4 py-2 rounded-full text-sm border transition-all ${activeCat === cat.id
                ? "bg-slate-900 text-white border-slate-900"
                : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-sm text-slate-500 mb-8">
          Showing <strong>{filtered.length.toLocaleString()}</strong>{" "}
          {intentLabels[activeTab].toLowerCase()}
          {search && ` matching "${search}"`}
          {activeCat !== "all" && ` in ${seoCategories.find((c) => c.id === activeCat)?.name}`}
        </p>

        {/* No results */}
        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg mb-2">No pages found</p>
            <p className="text-slate-400 text-sm">Try a different search term or category</p>
            <button
              onClick={() => { setSearch(""); setActiveCat("all") }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Grouped Results */}
        <div className="space-y-10">
          {Object.entries(grouped).map(([catName, pages]) => {
            const isExpanded = showAll[catName]
            const visible = isExpanded ? pages : pages.slice(0, SHOW_LIMIT)
            const hidden = pages.length - SHOW_LIMIT

            return (
              <div key={catName}>
                {/* Category Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold text-slate-900">{catName}</h2>
                    <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1 rounded-full font-medium">
                      {pages.length.toLocaleString()} pages
                    </span>
                  </div>
                  {!isExpanded && hidden > 0 && (
                    <button
                      onClick={() => setShowAll((prev) => ({ ...prev, [catName]: true }))}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Show all {pages.length.toLocaleString()} →
                    </button>
                  )}
                  {isExpanded && (
                    <button
                      onClick={() => setShowAll((prev) => ({ ...prev, [catName]: false }))}
                      className="text-sm text-slate-500 hover:text-slate-700 font-medium"
                    >
                      Show less ↑
                    </button>
                  )}
                </div>

                {/* Page Links Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {visible.map((page) => (
                    <Link
                      key={page.slug}
                      href={`/${page.slug}`}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${intentBadge[page.intent]}`}
                      />
                      <span className="text-sm text-slate-700 group-hover:text-blue-700 transition-colors truncate">
                        {page.label}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Show more button inside grid */}
                {!isExpanded && hidden > 0 && (
                  <button
                    onClick={() => setShowAll((prev) => ({ ...prev, [catName]: true }))}
                    className="mt-4 w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-500 hover:border-blue-300 hover:text-blue-600 transition-all"
                  >
                    + {hidden.toLocaleString()} more {catName} pages — click to show all
                  </button>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Page Types Legend</h3>
          <div className="flex flex-wrap gap-6">
            {(["renter", "owner", "competitor"] as Tab[]).map((tab) => (
              <div key={tab} className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${intentBadge[tab]}`} />
                <span className="text-sm text-slate-600">
                  <strong>{intentLabels[tab]}</strong> — {intentDescriptions[tab]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
