import { Link } from "react-router-dom";
import React from "react";
import { Instagram, Facebook, ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <Link className="brand" to="/">
            <img
              className="footer-logo"
              src="/images/verma-enterprises-logo.webp"
              alt="Verma Enterprises — aquatic life"
            />
          </Link>
          <p>
            Thoughtful fishkeeping starts with a little wonder — and a lot of
            care.
          </p>
          <div className="socials">
            <a href="https://instagram.com" aria-label="Instagram">
              <Instagram size={17} />
            </a>
            <a href="https://facebook.com" aria-label="Facebook">
              <Facebook size={17} />
            </a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/pets">Aquatic pets</Link>
          <Link to="/plants">Aquatic plants</Link>
          <Link to="/aquarium-products">Shop aquarium</Link>
          <Link to="/wishlist">Saved favourites</Link>
          <a href="/#care">Care journal</a>
        </div>
        <div className="footer-col">
          <h4>Here to help</h4>
          <a href="mailto:hello@vermaenterprises.example">
            Get in touch <ArrowUpRight size={13} />
          </a>
          <a href="/#faq">FAQ</a>
          <Link to="/admin/login">Admin sign in</Link>
        </div>
        <div className="footer-note">
          <span className="eyebrow">A SMALL NOTE FROM US</span>
          <p>
            Every tank is its own little world. We’re here to help you make it a
            thriving one.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Verma Enterprises. Made for curious
          keepers.
        </span>
        <span>
          Keep it clear. Keep it kind. Keep swimming.{" "}
          <span className="footer-fish">✳</span>
        </span>
      </div>
    </footer>
  );
}
