import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowLeft,
  ArrowRight,
  Fish,
  Leaf,
  Search,
  SlidersHorizontal,
  Waves,
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";

const content = {
  fish: {
    label: "AQUATIC PETS & ANIMALS",
    title: (
      <>
        Find Your
        <br />
        <em>Finned Friend.</em>
      </>
    ),
    intro:
      "Bright personalities, gentle swimmers and little lives looking for the right home.",
    icon: Fish,
    image: "/images/aquatic-pets-static-hero.webp",
  },
  plants: {
    label: "AQUATIC & AQUARIUM PLANTS",
    title: (
      <>
        Bring Nature
        <br />
        <em>Underwater.</em>
      </>
    ),
    intro:
      "Aquatic plants to bring texture, colour and a calmer kind of life to your tank.",
    icon: Leaf,
    image:
      "https://images.squarespace-cdn.com/content/v1/5875ac5344024353e512c5c9/1495854339851-M2HSFBV60FHWU2KK6B1W/image-asset.jpeg",
  },
  aquarium: {
    label: "AQUARIUM PRODUCTS & ACCESSORIES",
    title: (
      <>
        Complete Care for
        <br />
        <em>Your Aquarium.</em>
      </>
    ),
    intro:
      "From clear glass tanks to LED lighting, filtration, fish food and finishing touches, find what your aquarium needs to thrive.",
    icon: Waves,
    image: "/images/aquarium-products.webp",
  },
  all: {
    label: "THE VERMA COLLECTION",
    title: (
      <>
        A world of
        <br />
        <em>aquatic wonder.</em>
      </>
    ),
    intro:
      "Discover aquatic pets, living plants and thoughtful essentials in one place.",
    icon: Waves,
    image:
      "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=1700&q=88",
  },
};
const PRODUCTS_PER_PAGE = 8;

export default function FishCatalogue({ category = "fish" }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState("featured");
  const [filter, setFilter] = useState("all");
  const [subcategory, setSubcategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productGridRef = useRef(null);
  const page = content[category] || content.all;
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
  }, [searchParams]);
  useEffect(() => {
    let active = true;
    const params = category === "all" ? {} : { category };
    const loadProducts = () => {
      setLoading(true);
      setError("");
      getProducts(params)
        .then((data) => {
          if (active) setItems(Array.isArray(data) ? data : data.products || []);
        })
        .catch(() => {
          if (active)
            setError(
              "We couldn’t reach the collection just now. Please try again in a moment.",
            );
        })
        .finally(() => active && setLoading(false));
    };
    loadProducts();
    window.addEventListener("focus", loadProducts);
    return () => {
      active = false;
      window.removeEventListener("focus", loadProducts);
    };
  }, [category]);
  const filtered = useMemo(() => {
    let result = items.filter((p) =>
      `${p.name} ${p.description} ${p.category} ${p.subcategory || ""}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );
    if (subcategory !== "all")
      result = result.filter((p) => p.subcategory === subcategory);
    if (filter === "available")
      result = result.filter((p) => p.isAvailable && p.stock !== 0);
    else if (filter === "featured") result = result.filter((p) => p.isFeatured);
    if (sort === "price-low")
      result.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sort === "price-high")
      result.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sort === "newest")
      result.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    else
      result.sort(
        (a, b) => Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured)),
      );
    return result;
  }, [items, search, filter, sort, subcategory]);
  const subcategories = useMemo(
    () =>
      [
        ...new Set(items.map((item) => item.subcategory).filter(Boolean)),
      ].sort(),
    [items],
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filtered.slice(start, start + PRODUCTS_PER_PAGE);
  }, [filtered, currentPage]);
  useEffect(() => {
    setCurrentPage(1);
  }, [category, search, sort, filter, subcategory]);
  useEffect(() => {
    setCurrentPage((pageNumber) => Math.min(pageNumber, pageCount));
  }, [pageCount]);
  function goToPage(pageNumber) {
    const nextPage = Math.min(Math.max(pageNumber, 1), pageCount);
    setCurrentPage(nextPage);
    window.requestAnimationFrame(() => {
      productGridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  function changeSearch(value) {
    setSearch(value);
    const next = new URLSearchParams(searchParams);
    if (value) next.set("q", value);
    else next.delete("q");
    setSearchParams(next, { replace: true });
  }
  return (
    <main className={`catalogue-page premium-catalogue category-page category-page-${category}`}>
      <section
        className={`catalogue-hero category-hero premium-catalogue-hero immersive-catalogue-hero category-hero-${category}`}
      >
        <div className="category-hero-visual" aria-hidden="true">
          <img className="category-hero-backdrop" src={page.image} alt="" fetchPriority="high" />
          <div className="category-hero-rays" />
          <div className="category-hero-bubbles">
            {Array.from({ length: 15 }, (_, index) => (
              <i key={index} style={{ "--bubble-left": `${5 + ((index * 23) % 90)}%`, "--bubble-delay": `${-((index * 1.8) % 16)}s`, "--bubble-duration": `${12 + (index % 5) * 2}s`, "--bubble-size": `${4 + (index % 4) * 2}px` }} />
            ))}
          </div>
        </div>
        <div
          className="catalogue-hero-copy"
        >
          <span className="eyebrow light-eyebrow">{page.label}</span>
          <h1>{page.title}</h1>
          <p>{page.intro}</p>
          <span className="catalogue-count">
            <page.icon size={16} /> CURATED WITH CARE BY VERMA ENTERPRISES
          </span>
        </div>
        <div className="catalogue-side-label">A LITTLE WORLD, WELL LOOKED AFTER</div>
      </section>
      <section className="section catalogue-content premium-catalogue-content">
        <div className="catalogue-tabs">
          <Link className={category === "all" ? "selected" : ""} to="/search">
            Everything
          </Link>
          <Link className={category === "fish" ? "selected" : ""} to="/pets">
            Aquatic pets
          </Link>
          <Link
            className={category === "plants" ? "selected" : ""}
            to="/plants"
          >
            Plants
          </Link>
          <Link
            className={category === "aquarium" ? "selected" : ""}
            to="/aquarium-products"
          >
            Aquarium products
          </Link>
        </div>
        <div className="catalogue-toolbar">
          <div>
            <span className="eyebrow">
              {search ? `SEARCHING FOR “${search}”` : "THE COLLECTION"}
            </span>
            <h2>
              {category === "all"
                ? "Find your next favourite."
                : page.label
                    .toLowerCase()
                    .replace(/\b\w/g, (c) => c.toUpperCase())}
            </h2>
            <p>Beautiful things for a healthier, happier underwater home.</p>
          </div>
          <div className="catalogue-controls">
            <label className="search-field">
              <Search size={16} />
              <input
                value={search}
                onChange={(e) => changeSearch(e.target.value)}
                placeholder="Search the collection…"
                aria-label="Search products"
              />
            </label>
            {subcategories.length > 0 && (
              <label className="filter-field">
                <select
                  value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                  aria-label="Filter by product type"
                >
                  <option value="all">All types</option>
                  {subcategories.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="filter-field">
              <SlidersHorizontal size={15} />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter products"
              >
                <option value="all">All products</option>
                <option value="available">Available</option>
                <option value="featured">Featured</option>
              </select>
            </label>
            <label className="filter-field">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>
        {loading ? (
          <div className="loading-state">
            <span className="spinner" /> Finding the good ones…
          </div>
        ) : error ? (
          <div className="empty-state">
            <page.icon size={28} />
            <h3>The water is a little quiet.</h3>
            <p>{error}</p>
          </div>
        ) : filtered.length ? (
          <>
            <div className="results-meta">
              Showing {(currentPage - 1) * PRODUCTS_PER_PAGE + 1}–
              {Math.min(currentPage * PRODUCTS_PER_PAGE, filtered.length)} of {filtered.length} products{" "}
              <span>
                ORDERED WITH CARE <ArrowUpRight size={13} />
              </span>
            </div>
            <div className="product-grid" ref={productGridRef}>
              {paginatedProducts.map((p, i) => (
                <ProductCard product={p} index={i} key={p._id || p.id} />
              ))}
            </div>
            {pageCount > 1 && (
              <nav className="catalogue-pagination" aria-label="Product pages">
                <button
                  type="button"
                  className="pagination-previous"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft size={16} /> Previous
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                    <button
                      type="button"
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      aria-label={`Go to page ${pageNumber}`}
                      aria-current={currentPage === pageNumber ? "page" : undefined}
                      className={currentPage === pageNumber ? "active" : ""}
                    >
                      {pageNumber}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="pagination-next"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === pageCount}
                >
                  Next <ArrowRight size={16} />
                </button>
              </nav>
            )}
          </>
        ) : (
          <div className="empty-state">
            <page.icon size={28} />
            <h3>
              {search
                ? "No matching finds just yet."
                : "This part of the collection is growing."}
            </h3>
            <p>
              {search
                ? "Try another search or clear the filter to see all products."
                : "Our newest additions will appear here as soon as they are added by our team."}
            </p>
            {search && (
              <button className="text-link" onClick={() => changeSearch("")}>
                Clear search <ArrowUpRight size={15} />
              </button>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
