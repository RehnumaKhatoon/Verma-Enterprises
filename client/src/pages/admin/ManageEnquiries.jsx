import React, { useEffect, useState } from "react";
import { ArrowUpRight, Mail, MessageCircle, Trash2 } from "lucide-react";
import {
  deleteEnquiry,
  getEnquiries,
  updateEnquiry,
} from "../../services/enquiryService";

export default function ManageEnquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    getEnquiries()
      .then(setItems)
      .catch((e) =>
        setError(e.response?.data?.message || "Could not load enquiries."),
      )
      .finally(() => setLoading(false));
  }, []);
  async function status(id, value) {
    try {
      const updated = await updateEnquiry(id, value);
      setItems((current) =>
        current.map((item) => (item._id === id ? updated : item)),
      );
    } catch (e) {
      setError(e.response?.data?.message || "Could not update enquiry.");
    }
  }
  async function remove(item) {
    if (!window.confirm(`Remove the enquiry from ${item.name}?`)) return;
    try {
      await deleteEnquiry(item._id);
      setItems((current) => current.filter((value) => value._id !== item._id));
    } catch (e) {
      setError(e.response?.data?.message || "Could not remove enquiry.");
    }
  }
  return (
    <div className="admin-page">
      <div className="admin-heading">
        <div>
          <span className="eyebrow">A NOTE FROM THE COMMUNITY</span>
          <h1>
            Customer <em>enquiries.</em>
          </h1>
          <p>
            Every question is a chance to help someone find their little world.
          </p>
        </div>
        <span className="enquiry-count-badge">
          <Mail size={15} />{" "}
          {items.filter((item) => item.status === "new").length} NEW
        </span>
      </div>
      {error && <div className="form-error">{error}</div>}
      {loading ? (
        <div className="loading-state">
          <span className="spinner" /> Gathering messages…
        </div>
      ) : items.length ? (
        <div className="enquiry-admin-list">
          {items.map((item) => (
            <article className="enquiry-admin-card" key={item._id}>
              <div className="enquiry-admin-top">
                <span className="enquiry-admin-avatar">
                  {item.name?.[0]?.toUpperCase() || "V"}
                </span>
                <div className="enquiry-admin-person">
                  <strong>{item.name}</strong>
                  <span>
                    {item.email}
                    {item.phone ? ` · ${item.phone}` : ""}
                  </span>
                </div>
                <time>{new Date(item.createdAt).toLocaleDateString()}</time>
                <button
                  className="enquiry-delete"
                  onClick={() => remove(item)}
                  aria-label="Delete enquiry"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <p>{item.message}</p>
              <div className="enquiry-admin-actions">
                <a
                  href={`mailto:${item.email}?subject=${encodeURIComponent("Your Verma Enterprises enquiry")}`}
                >
                  <Mail size={14} /> Reply by email <ArrowUpRight size={12} />
                </a>
                {item.phone && (
                  <a
                    href={`https://wa.me/${item.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hello ${item.name}, thanks for contacting Verma Enterprises.`)}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={14} /> WhatsApp
                  </a>
                )}
                <label>
                  Status
                  <select
                    value={item.status}
                    onChange={(event) => status(item._id, event.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                </label>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <Mail size={25} />
          <p>No enquiries yet. New customer notes will appear here.</p>
        </div>
      )}
    </div>
  );
}
