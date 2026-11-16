import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Heart,
  MessageCircle,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { getProduct, getProducts } from "../../services/productService";
import { imageFor, whatsappLink } from "../../components/ProductCard";
import { useShop } from "../../components/ShopState";
import ProductCard from "../../components/ProductCard";
import { formatINR } from "../../utils/currency";
import {
  getProductCategoryLabel,
  normalizeProductCategory,
} from "../../utils/productCategory";

const categoryRoute = {
  fish: "/pets",
  plants: "/plants",
  aquarium: "/aquarium-products",
};
export default function ProductDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, wishlist, toggleWishlist } = useShop();
  useEffect(() => {
    let active = true;
    setLoading(true);
    getProduct(id)
      .then(async (product) => {
        if (!active) return;
        setItem(product);
        setActiveImage(0);
        setQuantity(1);
        const data = await getProducts({ category: product.category }).catch(
          () => [],
        );
        if (active)
          setRelated(
            (Array.isArray(data) ? data : data.products || [])
              .filter((p) => (p._id || p.id) !== (product._id || product.id))
              .slice(0, 4),
          );
      })
      .catch(() => {
        if (active) setError("We couldn’t find this little wonder.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [id]);
  const images = useMemo(
    () =>
      item?.images?.map((image) => image?.url || image).filter(Boolean) || [],
    [item],
  );
  const thumbnailViews = useMemo(() => {
    if (!images.length) return [];
    const cropPositions = ["50% 50%", "26% 48%", "74% 48%", "50% 27%"];
    return Array.from({ length: 4 }, (_, index) => ({
      src: images[index] || images[0],
      position: images.length > 1 ? "50% 50%" : cropPositions[index],
      zoom: images.length === 1 && index > 0 ? 1.32 : 1,
    }));
  }, [images]);
  if (loading)
    return (
      <main className="loading-state detail-loading">
        <span className="spinner" /> Finding your little wonder…
      </main>
    );
  if (error || !item)
    return (
      <main className="empty-state detail-loading">
        <p>{error}</p>
        <Link className="text-link" to="/search">
          Back to exploring <ArrowUpRight size={15} />
        </Link>
      </main>
    );
  const available = item.isAvailable && Number(item.stock) !== 0;
  const maxQuantity = Math.max(1, Number(item.stock) || 1);
  const category = normalizeProductCategory(item.category);
  const route = categoryRoute[category] || "/search";
  const saved = wishlist.includes(item._id || item.id);
  return (
    <main className="detail-page premium-detail">
      <div className="detail-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to={route}>
          {getProductCategoryLabel(item.category)}
        </Link>
        <span>/</span>
        <span>{item.name}</span>
      </div>
      <section className="detail-layout">
        <div className="detail-gallery">
          <div className="detail-image">
            <img
              src={thumbnailViews[activeImage]?.src || imageFor(item)}
              alt={item.name}
              style={{
                objectPosition:
                  thumbnailViews[activeImage]?.position || "50% 50%",
                transform:
                  thumbnailViews[activeImage]?.zoom > 1
                    ? `scale(${thumbnailViews[activeImage].zoom})`
                    : undefined,
              }}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = imageFor({});
              }}
            />
            {/* <span className="detail-image-label">
              VERMA ENTERPRISES · COLLECTED WITH CARE
            </span> */}
            <button
              className={`detail-wishlist ${saved ? "saved" : ""}`}
              onClick={() => toggleWishlist(item)}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart fill={saved ? "currentColor" : "none"} size={18} />
            </button>
          </div>
          {thumbnailViews.length > 0 && (
            <div className="detail-thumbnails">
              {thumbnailViews.map((view, index) => (
                <button
                  key={`${view.src}-${index}`}
                  className={index === activeImage ? "active" : ""}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={view.src}
                    alt=""
                    loading="lazy"
                    style={{
                      objectPosition: view.position,
                      transform: `scale(${view.zoom})`,
                    }}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = imageFor({});
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-copy">
          <span className="eyebrow">
            {item.subcategory ||
              (category === "fish"
                ? "AQUATIC PET"
                : category === "plants"
                  ? "AQUATIC PLANT"
                  : "AQUARIUM ESSENTIAL")}
          </span>
          <h1>{item.name}</h1>
          <div className="detail-pricing">
            <span className="detail-price">{formatINR(item.price)}</span>
            {item.isSamplePrice && (
              <small className="sample-price-detail">
                Sample price · confirm current pricing with our team
              </small>
            )}
          </div>
          <p className="detail-description">{item.description}</p>
          <div className="availability">
            <span
              className={
                available ? "availability-dot" : "availability-dot unavailable"
              }
            />
            {available
              ? `Available${item.stock > 0 ? ` · ${item.stock} in stock` : ""}`
              : "A little break from the shop"}
          </div>
          <div className="detail-purchase-row">
            <label className="detail-quantity-label" htmlFor="product-quantity">
              Quantity
            </label>
            <div className="detail-quantity" aria-label="Select quantity">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1 || !available}
              >
                <Minus size={15} />
              </button>
              <input
                id="product-quantity"
                type="number"
                min="1"
                max={maxQuantity}
                value={quantity}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  if (Number.isFinite(value))
                    setQuantity(
                      Math.min(maxQuantity, Math.max(1, Math.floor(value))),
                    );
                }}
                disabled={!available}
              />
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() =>
                  setQuantity((value) => Math.min(maxQuantity, value + 1))
                }
                disabled={quantity >= maxQuantity || !available}
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
          <div className="detail-actions">
            <button
              className="button button-aqua"
              onClick={() => addToCart(item, quantity)}
              disabled={!available}
            >
              <ShoppingCart size={16} /> Add to cart
            </button>
            <a
              className="button button-outline"
              href={whatsappLink(item)}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={16} /> Enquire on WhatsApp
            </a>
          </div>
          <p className="detail-helper">
            Not sure if it’s the right fit? Tell us a little about your aquarium
            and we’ll help.
          </p>
          <div className="detail-includes">
            <span>
              <Check size={14} /> Thoughtfully selected
            </span>
            <span>
              <Check size={14} /> Friendly care advice
            </span>
          </div>
          <div className="detail-care-note">
            <span className="care-note-icon">✳</span>
            <span>
              <strong>Every aquarium is its own little world.</strong>
              <small>
                We’ll help you choose what works for your setup and the life
                already in it.
              </small>
            </span>
          </div>
          <Link className="text-link detail-back" to={route}>
            <ArrowLeft size={15} /> Keep exploring
          </Link>
        </div>
      </section>
      {related.length > 0 && (
        <section className="related-products">
          <div className="section-heading premium-heading">
            <div>
              <span className="eyebrow">GOOD COMPANY FOR YOUR AQUARIUM</span>
              <h2>
                You may also <em>love.</em>
              </h2>
            </div>
          </div>
          <div className="product-grid">
            {related.map((product, index) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
