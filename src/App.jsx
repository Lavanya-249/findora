import { useState, useEffect, useCallback } from "react";
import ProductCard from "./components/ProductCard";
import SearchBar from "./components/SearchBar";
import Filters from "./components/Filters";
import "./styles.css";

const PRODUCTS_PER_PAGE = 8;

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch("https://fakestoreapi.com/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        // Add extra products
        const extraProducts = data.map((p) => ({
          ...p,
          id: p.id + 100,
          title: p.title + " (New Edition)",
          price: p.price + 15,
          rating: {
            ...p.rating,
            rate: Math.min(5, p.rating.rate + 0.3),
          },
        }));

        setProducts([...data, ...extraProducts]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    const matchMin = minPrice === "" || p.price >= minPrice;
    const matchMax = maxPrice === "" || p.price <= maxPrice;
    const matchRating = p.rating.rate >= minRating;
    return matchSearch && matchCat && matchMin && matchMax && matchRating;
  });

  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handleFilterChange = useCallback((setter) => (val) => {
    setter(val);
    setCurrentPage(1);
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    search || category !== "all" || minPrice || maxPrice || minRating > 0;

  return (
    <div className="app">
      <header className="header">
        <h1>✨ FINDORA</h1>
        {!loading && (
          <p>{filtered.length} of {products.length} products</p>
        )}
      </header>

      <div className="layout">
        <aside className="sidebar">
          {hasActiveFilters && (
            <button className="clear-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}

          <SearchBar
            value={search}
            onChange={handleFilterChange(setSearch)}
          />

          <Filters
            categories={categories}
            category={category}
            onCategoryChange={handleFilterChange(setCategory)}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onMinPriceChange={handleFilterChange(setMinPrice)}
            onMaxPriceChange={handleFilterChange(setMaxPrice)}
            minRating={minRating}
            onRatingChange={handleFilterChange(setMinRating)}
          />
        </aside>

        <main className="main">
          {loading ? (
            <h2>Loading...</h2>
          ) : error ? (
            <h2>{error}</h2>
          ) : paginated.length === 0 ? (
            <h2>No products found</h2>
          ) : (
            <>
              <div className="product-grid">
                {paginated.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Prev
                  </button>

                  <span>Page {currentPage} of {totalPages}</span>

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}