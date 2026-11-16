import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { getProducts } from "../../services/productService";
import { useShop } from "../../components/ShopState";
import ProductCard from "../../components/ProductCard";

export default function WishlistPage() {
  const { wishlist } = useShop();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    getProducts()
      .then((data) => {
        if (active) {
          const products = Array.isArray(data) ? data : data.products || [];
          setItems(
            products.filter((item) => wishlist.includes(item._id || item.id)),
          );
        }
      })
      .catch(() => setItems([]))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [wishlist]);
  return (
    <main className="wishlist-page home-section">
      <div className="section-heading premium-heading">
        <div>
          <span className="eyebrow">A FEW THINGS YOU’VE SAVED</span>
          <h1>
            Your <em>wishlist.</em>
          </h1>
          <p>Keep the little things you love close by.</p>
        </div>
        <Link className="text-link" to="/search">
          Explore the collection
        </Link>
      </div>
      {loading ? (
        <div className="loading-state">
          <span className="spinner" /> Gathering your saved finds…
        </div>
      ) : items.length ? (
        <div className="product-grid">
          {items.map((item, index) => (
            <ProductCard
              key={item._id || item.id}
              product={item}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Heart size={27} />
          <h3>Your wishlist is waiting for a first favourite.</h3>
          <p>Tap the heart on a product to save it here.</p>
          <Link className="text-link" to="/search">
            Browse the collection
          </Link>
        </div>
      )}
    </main>
  );
}
