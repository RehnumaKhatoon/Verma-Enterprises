import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Fish, Package, Plus, Waves } from "lucide-react";
import { getProducts } from "../../services/productService";
import { formatINR } from "../../utils/currency";
import {
  getProductCategoryLabel,
  normalizeProductCategory,
} from "../../utils/productCategory";
export default function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const refresh = () =>
      getProducts()
        .then((data) => {
          if (!active) return;
          setItems(Array.isArray(data) ? data : data.products || []);
          setError("");
        })
        .catch((err) => {
          if (active)
            setError(err.response?.data?.message || "Could not load products.");
        });
    refresh();
    window.addEventListener("focus", refresh);
    return () => {
      active = false;
      window.removeEventListener("focus", refresh);
    };
  }, []);
  const pet = items.filter((p) => normalizeProductCategory(p.category) === "fish").length,
    plants = items.filter((p) => normalizeProductCategory(p.category) === "plants").length,
    gear = items.filter((p) => normalizeProductCategory(p.category) === "aquarium").length,
    stock = items.reduce((n, p) => n + (Number(p.stock) || 0), 0);
  return (
    <div className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">A SMALL WORLD, WELL RUN</span>
          <h1>Good morning.</h1>
          <p>Here’s a little look at how your shop is doing.</p>
        </div>
        <Link className="button button-dark" to="/admin/products/new">
          <Plus size={16} /> Add something lovely
        </Link>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="stats-grid">
        {[
          {
            title: "All the little things",
            value: items.length,
            icon: Package,
            tone: "aqua",
          },
          { title: "Aquatic Pets", value: pet, icon: Fish, tone: "coral" },
          {
            title: "Aquatic plants",
            value: plants,
            icon: Waves,
            tone: "green",
          },
          { title: "Tank essentials", value: gear, icon: Waves, tone: "gold" },
          {
            title: "Ready for a new home",
            value: stock,
            icon: Package,
            tone: "green",
          },
        ].map((x) => (
          <article className="stat-card" key={x.title}>
            <span className={`stat-icon ${x.tone}`}>
              <x.icon size={19} />
            </span>
            <span className="stat-label">{x.title}</span>
            <strong>{x.value}</strong>
            <span className="stat-foot">IN YOUR VERMA ENTERPRISES SHOP</span>
          </article>
        ))}
      </div>
      <section className="admin-recent">
        <div className="admin-section-head">
          <div>
            <span className="eyebrow">FRESH FROM THE TANK</span>
            <h2>Recently added</h2>
          </div>
          <Link className="text-link" to="/admin/products">
            Manage all <ArrowUpRight size={15} />
          </Link>
        </div>
        {items.length ? (
          <div className="admin-product-list">
            {items.slice(0, 5).map((p) => (
              <Link
                to={`/admin/products/${p._id}/edit`}
                className="admin-product-row"
                key={p._id}
              >
                <img
                  src={
                    p.images?.[0]?.url ||
                    p.images?.[0] ||
                    "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=120&q=75"
                  }
                  alt=""
                />
                <span>
                  <strong>{p.name}</strong>
                  <small>
                    {getProductCategoryLabel(p.category).toUpperCase()}
                  </small>
                </span>
                <span className="admin-row-price">{formatINR(p.price)}</span>
                <span
                  className={
                    p.isAvailable ? "status-pill" : "status-pill unavailable"
                  }
                >
                  {p.isAvailable ? "Available" : "Unavailable"}
                </span>
                <ArrowUpRight size={15} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            <Package size={25} />
            <p>No products yet. Add the first little wonder to your shop.</p>
            <Link className="text-link" to="/admin/products/new">
              Add a product <ArrowUpRight size={15} />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
