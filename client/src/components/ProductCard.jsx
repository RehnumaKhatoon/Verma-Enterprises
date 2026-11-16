import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, MessageCircle, ShoppingCart } from "lucide-react";
import { useShop } from "./ShopState";
import { formatINR } from "../utils/currency";
import { normalizeProductCategory } from "../utils/productCategory";
const fallbackImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="900" height="700" viewBox="0 0 900 700"><defs><linearGradient id="water" x2="0" y2="1"><stop stop-color="#09283b"/><stop offset="1" stop-color="#146276"/></linearGradient></defs><rect width="900" height="700" fill="url(#water)"/><circle cx="690" cy="170" r="9" fill="none" stroke="#9cece2" stroke-width="4"/><circle cx="730" cy="125" r="5" fill="none" stroke="#9cece2" stroke-width="3"/><path d="M85 610Q170 530 245 610T405 610T570 610T735 610T900 610V700H0Z" fill="#194d4b"/><path d="M410 350q130-125 270 0-140 125-270 0Zm-4 0-95-70 15 70-15 70Z" fill="#8de0d5"/><circle cx="620" cy="338" r="9" fill="#062634"/><text x="450" y="660" text-anchor="middle" fill="#d9f4ed" font-family="sans-serif" font-size="24" letter-spacing="5">VERMA AQUATICS</text></svg>')}`;

export const imageFor = (item) =>
  item?.images?.[0]?.url || item?.images?.[0] || item?.image || fallbackImage;
export const whatsappLink = (item) => {
  const num = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
  const priceLabel = item.isSamplePrice
    ? `sample price ${formatINR(item.price)}`
    : formatINR(item.price);
  const text = `Hi Verma Enterprises! I'm interested in ${item.name} (${priceLabel}). Could you tell me more?`;
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
};

export default function ProductCard({ product, index = 0 }) {
  const { addToCart, wishlist, toggleWishlist } = useShop();
  const id = product._id || product.id;
  const category = normalizeProductCategory(product.category);
  const isPet = category === "fish";
  const isPlant = category === "plants";
  const saved = wishlist.includes(id);
  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: (index % 4) * 0.07, duration: 0.5 }}
    >
      <div className="card-media">
        <Link to={`/product/${id}`} className="card-image">
          <img
            src={imageFor(product)}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallbackImage;
            }}
          />
          <span className="card-tag">
            {isPet
              ? "AQUATIC PETS"
              : isPlant
                ? "AQUATIC PLANTS"
                : "AQUARIUM ESSENTIALS"}
          </span>
          <span className="card-arrow">
            <ArrowUpRight size={17} />
          </span>
          {(!product.isAvailable || Number(product.stock) === 0) && (
            <span className="sold-out">Currently unavailable</span>
          )}
        </Link>
        <button
          className={`wishlist-button ${saved ? "saved" : ""}`}
          onClick={() => toggleWishlist(product)}
          aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="card-info">
        <div>
          <span className="card-category">
            {product.categoryLabel ||
              (isPet
                ? "FRESHWATER FISH"
                : isPlant
                  ? "LIVE AQUATIC PLANTS"
                  : "AQUARIUM GOODS")}
          </span>
          <h3>
            <Link to={`/product/${id}`}>{product.name}</Link>
          </h3>
        </div>
        <span className="card-price">{formatINR(product.price)}</span>
      </div>
      {/* {product.isSamplePrice && (
        <span className="sample-price-label">Sample price · editable</span>
      )} */}
      <p className="card-desc">{product.description}</p>
      <div
        className={`card-stock ${product.isAvailable && Number(product.stock) > 0 ? "in-stock" : "out-stock"}`}
      >
        <i />
        {product.isAvailable && Number(product.stock) > 0
          ? "Available"
          : "Currently unavailable"}
      </div>
      <div className="card-actions">
        <button
          className="add-cart-button"
          onClick={() => addToCart(product)}
          disabled={!product.isAvailable || Number(product.stock) === 0}
        >
          <ShoppingCart size={14} /> Add to cart
        </button>
        <a
          className="whatsapp-link"
          href={whatsappLink(product)}
          target="_blank"
          rel="noreferrer"
        >
          <MessageCircle size={15} /> Enquire <ArrowUpRight size={13} />
        </a>
        <Link className="view-details-link" to={`/product/${id}`}>
          View details <ArrowUpRight size={13} />
        </Link>
      </div>
    </motion.article>
  );
}
