import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Heart, Menu, Search, ShoppingCart, UserRound, X } from "lucide-react";
import { useShop } from "./ShopState";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { cartCount, setCartOpen, wishlist } = useShop();
  const navigate = useNavigate();
  const close = () => setOpen(false);
  function submitSearch(event) {
    event.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    close();
  }
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand brand-image" to="/" onClick={close}>
          <img
            src="/images/verma-enterprises-logo.webp"
            alt="Verma Enterprises — aquatic life"
          />
        </Link>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav className={open ? "main-nav open" : "main-nav"}>
          <NavLink to="/" onClick={close}>
            Home
          </NavLink>
          <NavLink to="/pets" onClick={close}>
            Aquatic pets
          </NavLink>
          <NavLink to="/plants" onClick={close}>
            Plants
          </NavLink>
          <NavLink to="/aquarium-products" onClick={close}>
            Products
          </NavLink>
          <a href="/#why" onClick={close}>
            About us
          </a>
          <a href="/#FAQ">FAQ</a>
          <a href="/#contact" onClick={close}>
            Contact
          </a>
          <NavLink
            className="mobile-wishlist-link"
            to="/wishlist"
            onClick={close}
          >
            Saved favourites ({wishlist.length})
          </NavLink>
        </nav>
        <div className="nav-tools">
          <button
            aria-label="Search products"
            className={searchOpen ? "active" : ""}
            onClick={() => setSearchOpen(!searchOpen)}
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>
          <Link aria-label="Wishlist" to="/wishlist" className="nav-icon-link">
            <Heart size={18} />
            {wishlist.length > 0 && <i>{wishlist.length}</i>}
          </Link>
          {/* <Link
            aria-label="Admin account"
            to="/admin/login"
            className="nav-icon-link"
          >
            <UserRound size={18} />
          </Link> */}
          <button
            aria-label={`Shopping cart, ${cartCount} items`}
            className="cart-trigger"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart size={18} />
            <span>Cart</span>
            <i>{cartCount}</i>
          </button>
        </div>
      </div>
      {searchOpen && (
        <form className="nav-search" onSubmit={submitSearch}>
          <Search size={17} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find fish, plants and aquarium essentials"
            aria-label="Search products"
          />
          <button type="submit">
            Search <Fish size={14} />
          </button>
        </form>
      )}
    </header>
  );
}
