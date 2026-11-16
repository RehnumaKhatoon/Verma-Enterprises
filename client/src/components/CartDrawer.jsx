import React from "react";
import { ArrowRight, ShoppingBag, Trash2, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "./ShopState";
import { imageFor } from "./ProductCard";
import { formatINR } from "../utils/currency";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart } = useShop();
  if (!cartOpen) return null;
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const includesSamplePrices = cart.some((item) => item.isSamplePrice);
  return (
    <div className="cart-scrim" onClick={() => setCartOpen(false)}>
      <aside
        className="cart-drawer"
        onClick={(event) => event.stopPropagation()}
        aria-label="Shopping cart"
      >
        <header>
          <span>
            <span className="eyebrow">YOUR LITTLE FINDS</span>
            <h2>
              Your cart{" "}
              <small>
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </small>
            </h2>
          </span>
          <button aria-label="Close cart" onClick={() => setCartOpen(false)}>
            <X size={19} />
          </button>
        </header>
        {cart.length ? (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <article key={item.id} className="cart-item">
                  <img src={item.image || imageFor({})} alt="" />
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      Qty {item.quantity} · {formatINR(item.price)}
                      {item.isSamplePrice ? " · sample price" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <span>
                {includesSamplePrices
                  ? "Estimated total · includes sample prices"
                  : "Estimated total"}
              </span>
              <strong>{formatINR(total)}</strong>
              <small>
                Checkout is arranged with our team after your enquiry.
              </small>
              <a
                className="button button-aqua"
                href={`https://wa.me/${(import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Verma Enterprises, I'd like to ask about my cart: ${cart.map((item) => `${item.quantity} × ${item.name}${item.isSamplePrice ? " (sample price)" : ""}`).join(", ")}. Estimated total ${formatINR(total)}${includesSamplePrices ? " (includes sample prices; please confirm pricing)" : ""}.`)}`}
                target="_blank"
                rel="noreferrer"
              >
                Enquire about cart <ArrowRight size={15} />
              </a>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <ShoppingBag size={28} />
            <h3>Nothing swimming in here yet.</h3>
            <p>
              Explore the collection and find something for your little world.
            </p>
            <Link
              className="text-link"
              to="/pets"
              onClick={() => setCartOpen(false)}
            >
              Explore aquatic pets <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
