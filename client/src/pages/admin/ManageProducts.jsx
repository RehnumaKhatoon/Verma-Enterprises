import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Plus, Search, Trash2 } from "lucide-react";
import { Pencil } from "lucide-react";

import { deleteProduct, getProducts } from "../../services/productService";
import { formatINR } from "../../utils/currency";
import {
  getProductCategoryLabel,
  normalizeProductCategory,
} from "../../utils/productCategory";
export default function ManageProducts() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("all");
  async function refresh() {
    setBusy(true);
    try {
      const d = await getProducts();
      setItems(Array.isArray(d) ? d : d.products || []);
    } catch (e) {
      setError(e.response?.data?.message || "Could not load products.");
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  const filtered = items.filter(
    (p) =>
      p.name.toLowerCase().includes(q.toLowerCase()) &&
      (category === "all" || normalizeProductCategory(p.category) === category),
  );
  async function remove(p) {
    if (!window.confirm(`Remove “${p.name}” from the shop?`)) return;
    try {
      await deleteProduct(p._id);
      setItems(items.filter((x) => x._id !== p._id));
    } catch (e) {
      setError(e.response?.data?.message || "Could not remove product.");
    }
  }
  return (
    <div className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">THE WHOLE AQUARIUM</span>
          <h1>
            Little things, <em>in order.</em>
          </h1>
          <p>Take a look, make a change, or add something new.</p>
        </div>
        <Link className="button button-dark" to="/admin/products/new">
          <Plus size={16} /> Add a product
        </Link>
      </div>
      {error && <div className="form-error">{error}</div>}
      <div className="manage-toolbar">
        <label className="search-field">
          <Search size={16} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Find a product…"
          />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          <option value="fish">Aquatic pets</option>
          <option value="plants">Aquatic plants</option>
          <option value="aquarium">Aquarium products</option>
        </select>
        <span>
          {filtered.length} LITTLE {filtered.length === 1 ? "THING" : "THINGS"}
        </span>
      </div>
      {busy ? (
        <div className="loading-state">
          <span className="spinner" /> Looking through the tank…
        </div>
      ) : filtered.length ? (
        <div className="manage-table-wrap">
          <table className="manage-table">
            <thead>
              <tr>
                <th>PRODUCT</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>STOCK</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <Link
                      className="manage-product"
                      to={`/admin/products/${p._id}/edit`}
                    >
                      <img
                        src={
                          p.images?.[0]?.url ||
                          p.images?.[0] ||
                          "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=100&q=70"
                        }
                        alt=""
                      />
                      <strong>{p.name}</strong>
                    </Link>
                  </td>
                  <td>
                    {getProductCategoryLabel(p.category)}
                  </td>
                  <td>{formatINR(p.price)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span
                      className={
                        p.isAvailable
                          ? "status-pill"
                          : "status-pill unavailable"
                      }
                    >
                      {p.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <Link
                        to={`/admin/products/${p._id}/edit`}
                        aria-label={`Edit ${p.name}`}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => remove(p)}
                        aria-label={`Delete ${p.name}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-empty">
          <p>Nothing here just yet. Try another search, or add a product.</p>
          <Link className="text-link" to="/admin/products/new">
            Add a product <ArrowUpRight size={15} />
          </Link>
        </div>
      )}
    </div>
  );
}
