import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ShopContext = createContext(null);
const load = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
};

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load("verma_cart"));
  const [wishlist, setWishlist] = useState(() => load("verma_wishlist"));
  const [cartOpen, setCartOpen] = useState(false);
  useEffect(
    () => localStorage.setItem("verma_cart", JSON.stringify(cart)),
    [cart],
  );
  useEffect(
    () => localStorage.setItem("verma_wishlist", JSON.stringify(wishlist)),
    [wishlist],
  );
  const value = useMemo(
    () => ({
      cart,
      wishlist,
      cartOpen,
      setCartOpen,
      cartCount: cart.reduce((sum, item) => sum + item.quantity, 0),
      addToCart(product, quantity = 1) {
        const id = product._id || product.id;
        const count = Math.max(1, Math.floor(Number(quantity) || 1));
        setCart((current) => {
          const existing = current.find((item) => item.id === id);
          return existing
            ? current.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity + count }
                  : item,
              )
            : [
                ...current,
                {
                  id,
                  name: product.name,
                  price: Number(product.price),
                  isSamplePrice: Boolean(product.isSamplePrice),
                  image:
                    product.images?.[0]?.url ||
                    product.images?.[0] ||
                    product.image ||
                    "",
                  quantity: count,
                },
              ];
        });
        setCartOpen(true);
      },
      removeFromCart(id) {
        setCart((current) => current.filter((item) => item.id !== id));
      },
      toggleWishlist(product) {
        const id = product._id || product.id;
        setWishlist((current) =>
          current.includes(id)
            ? current.filter((value) => value !== id)
            : [...current, id],
        );
      },
    }),
    [cart, wishlist, cartOpen],
  );
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used inside ShopProvider");
  return value;
}
