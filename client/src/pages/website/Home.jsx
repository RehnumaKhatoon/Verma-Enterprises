import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Droplets,
  Fish,
  Heart,
  Leaf,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { getProducts } from "../../services/productService";
import { submitEnquiry } from "../../services/enquiryService";
import { normalizeProductCategory } from "../../utils/productCategory";

const questions = [
  [
    "What types of aquatic pets do you offer?",
    "Our collection includes freshwater fish such as Betta Fish, Goldfish, Guppy Fish, Angelfish, Mollies, Neon Tetras, Discus and Oscars, along with Cherry Shrimp and Mystery Snails. Check the Aquatic Pets & Animals collection for current listings and availability.",
  ],
  [
    "How do I choose the right fish for my aquarium?",
    "Consider your aquarium’s size, water conditions, the fish’s adult size and temperament, and whether it can live comfortably with your current inhabitants. If you share your setup and the fish you already keep, our team can help you compare suitable options.",
  ],
  [
    "Are your aquarium plants suitable for beginners?",
    "Several plants in our collection, including Java Moss, Anubias Nana and Java Fern, are often chosen for beginner aquariums. The best fit depends on your tank’s lighting, water conditions and setup.",
  ],
  [
    "How do I take care of aquatic plants?",
    "Give plants suitable lighting, stable water conditions and nutrients appropriate for your setup. Attach rhizome plants such as Anubias and Java Fern to rock or driftwood rather than burying the rhizome, and trim leaves as needed.",
  ],
  [
    "What aquarium products and accessories do you sell?",
    "The collection includes aquarium tanks, sand and gravel, driftwood, artificial plants, fish food, water conditioner, internal filters, LED lights and air pumps. Browse Aquarium Products & Accessories to see current listings.",
  ],
  [
    "How often should I clean my aquarium?",
    "Cleaning needs depend on the tank’s size, stocking, filtration and water test results. Check water quality regularly, remove uneaten food and visible waste, and make partial water changes as needed while preserving the beneficial bacteria in the filter.",
  ],
  [
    "What type of fish food should I buy?",
    "Choose food made for your fish species and its feeding habits. Check the product label for suitable fish and feeding directions, and offer only what your fish can eat promptly to help keep the water clean.",
  ],
  [
    "Do you provide aquarium medicines and water treatments?",
    "Our catalogue includes water-treatment products such as aquarium water conditioner. For medicines or a specific treatment, contact us with the product or fish-care question so we can check current listings and help you find relevant information.",
  ],
  [
    "How can I check product availability and prices?",
    "Current availability and prices are shown on product cards and product detail pages. Prices are displayed in Indian Rupees; items marked as sample prices are editable examples and should be confirmed with Verma Enterprises.",
  ],
  [
    "How can I contact Verma Enterprises for assistance?",
    "Use the Contact Us button to reach the enquiry form, or choose Chat on WhatsApp to message our team. Include your question and, if relevant, details about your aquarium setup or the product you are considering.",
  ],
];
const gallery = [
  [
    "A planted world",
    "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=1000&q=85",
  ],
  [
    "A flash of colour",
    "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "A quiet reef",
    "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=900&q=85",
  ],
  [
    "Life in miniature",
    "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=900&q=85",
  ],
];
const testimonials = [
  [
    "“The team helped me choose fish that actually suit my tank. Six months later, everything is thriving.”",
    "Riya S.",
    "A planted community tank",
  ],
  [
    "“Beautiful plants, thoughtful advice, and the kind of service that makes a hobby feel even better.”",
    "Arjun M.",
    "Keeper for three years",
  ],
  [
    "“My first aquarium felt easy because they were there for every small question.”",
    "Leena K.",
    "First-time fishkeeper",
  ],
];

function FishShape({ className = "" }) {
  return (
    <span className={`swimming-fish ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 70">
        <defs>
          <linearGradient id="fishGlow" x1="0" x2="1">
            <stop stopColor="#f6a86e" />
            <stop offset=".48" stopColor="#f5e09a" />
            <stop offset="1" stopColor="#56d7ce" />
          </linearGradient>
        </defs>
        <path
          d="M20 35C36 9 78 10 97 35 78 60 36 61 20 35Z"
          fill="url(#fishGlow)"
        />
        <path d="M23 35 2 13 5 35 2 57Z" fill="#ef9575" />
        <path
          d="M50 16 62 2 70 17M50 54 62 68 70 53"
          fill="#8ee2d5"
          opacity=".75"
        />
        <circle cx="84" cy="30" r="2.7" fill="#102c37" />
        <path
          d="M73 37q9 8 17 2"
          fill="none"
          stroke="#fff2c5"
          strokeWidth="2"
          opacity=".7"
        />
      </svg>
    </span>
  );
}

function AquaticPlantArt({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 180 320" aria-hidden="true">
      <path
        d="M90 320C82 235 88 150 65 45M94 320C108 225 123 145 133 70M87 320C72 240 48 184 31 116"
        fill="none"
        stroke="#61cbb4"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M67 102C27 93 15 67 21 42c30 4 51 22 46 60ZM75 154c-39-4-59-28-60-55 32 0 57 18 60 55ZM84 214c-39 4-64-14-72-40 31-8 59 4 72 40ZM108 126c37-19 43-47 32-71-28 12-45 36-32 71ZM119 190c39-13 51-38 44-64-31 8-53 29-44 64ZM91 263c-35 0-55-20-58-46 31-4 57 11 58 46Z"
        fill="#49b89c"
        fillOpacity=".7"
        stroke="#8be0bd"
        strokeWidth="2"
      />
      <path
        d="M65 100c-17-21-29-37-41-53M74 151c-22-14-39-29-55-46M84 211c-24-8-44-18-65-35M108 124c15-22 25-41 32-63M119 188c20-14 34-29 44-51M91 261c-21-12-37-25-54-42"
        fill="none"
        stroke="#a8ebc9"
        strokeWidth="2"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}

function WhatsAppCta({ children, className = "" }) {
  const number = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(
    /\D/g,
    "",
  );
  const message = encodeURIComponent(
    "Hello Verma Enterprises, I would love some help creating my aquarium.",
  );
  return (
    <a
      className={className}
      href={`https://wa.me/${number}?text=${message}`}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(0);
  const [enquiry, setEnquiry] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [enquiryBusy, setEnquiryBusy] = useState(false);
  const [enquiryMessage, setEnquiryMessage] = useState("");
  async function sendEnquiry(event) {
    event.preventDefault();
    setEnquiryBusy(true);
    setEnquiryMessage("");
    try {
      const result = await submitEnquiry(enquiry);
      setEnquiryMessage(result.message);
      setEnquiry({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setEnquiryMessage(
        error.response?.data?.message ||
          "Your message could not be sent. Please try again or contact us on WhatsApp.",
      );
    } finally {
      setEnquiryBusy(false);
    }
  }
  useEffect(() => {
    let active = true;
    getProducts()
      .then((data) => {
        if (active) setItems(Array.isArray(data) ? data : data.products || []);
      })
      .catch(() => {
        if (active)
          setError(
            "Our collection could not load just now. Please try again soon.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const featured = useMemo(
    () => items.filter((item) => item.isFeatured).slice(0, 4),
    [items],
  );
  const bestSellers = useMemo(
    () => [...items].filter((item) => item.isAvailable).slice(0, 4),
    [items],
  );
  const arrivals = useMemo(
    () =>
      [...items]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 4),
    [items],
  );
  const categories = [
    {
      title: "Aquatic Pets & Animals",
      subtitle: "Personalities for your underwater world",
      href: "/pets",
      image: gallery[1][1],
      icon: Fish,
      count: "FISH · SHRIMP · SNAILS",
      category: "fish",
    },
    {
      title: "Aquatic & Aquarium Plants",
      subtitle: "A little more life in every leaf",
      href: "/plants",
      image: "/images/aquatic-plants.webp",
      icon: Leaf,
      count: "LIVE PLANTS · AQUASCAPING",
      category: "plants",
    },
    {
      title: "Aquarium Products & Accessories",
      href: "/aquarium-products",
      image: "/images/aquarium-products.webp",
      icon: Waves,
      count: "TANKS · FILTERS · LIGHTING · CARE",
      category: "aquarium",
      subtitle: "Beautiful tanks, filters, lighting and essentials",
    },
  ];
  return (
    <main className="verma-home">
      <section className="immersive-hero">
        <div className="hero-scene" />
        <div className="hero-vignette" />
        <div className="hero-light-rays" />
        <div className="hero-particles" aria-hidden="true">
          {Array.from({ length: 18 }, (_, i) => (
            <i
              key={i}
              style={{
                "--bubble-left": `${2 + i * 5.35}%`,
                "--bubble-delay": `${-i * 0.92}s`,
                "--bubble-duration": `${10 + (i % 6) * 2}s`,
              }}
            />
          ))}
        </div>
        <FishShape className="fish-one" />
        <FishShape className="fish-two" />
        <FishShape className="fish-three" />
        <FishShape className="fish-four" />
        <div className="hero-content-premium">
          <motion.span
            className="hero-kicker"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span /> VERMA ENTERPRISES <i /> AQUATIC LIFE, THOUGHTFULLY CURATED
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
          >
            Explore the Beautiful
            <br />
            World of <em>Aquatic Life</em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.65 }}
          >
            Discover exotic aquatic pets, beautiful aquarium plants and premium
            aquarium essentials — everything you need to create your dream
            underwater world.
          </motion.p>
          <motion.div
            className="hero-actions-premium"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
          >
            <Link className="button button-aqua" to="/pets">
              Explore collection <ArrowRight size={16} />
            </Link>
            <Link className="button button-glass" to="/aquarium-products">
              Shop products <ArrowUpRight size={16} />
            </Link>
          </motion.div>
          <div className="hero-signature">
            <span className="signature-line" />
            <span>THOUGHTFULLY CURATED FOR YOUR LITTLE WORLD</span>
          </div>
        </div>
        <a className="hero-scroll" href="#collections">
          <span>SCROLL TO DISCOVER</span>
          <ArrowDown size={14} />
        </a>
        {/* <div className="hero-side-note">A DEEPER KIND OF WONDER <i>·</i> EST. 2014</div> */}
        <div className="hero-bottom-fade" />
      </section>
      <section className="home-section live-selection">
        <div className="section-heading premium-heading">
          <div>
            <span className="eyebrow">A FEW UNDERWATER FAVOURITES</span>
            <h2>
              Made for <em>the moment.</em>
            </h2>
          </div>
          <Link className="text-link" to="/search">
            Explore the collection <ArrowUpRight size={15} />
          </Link>
        </div>
        {loading ? (
          <div className="product-grid home-product-grid">
            {[0, 1, 2, 3].map((i) => (
              <div className="product-skeleton" key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="collection-message">{error}</div>
        ) : featured.length ? (
          <div className="product-grid home-product-grid">
            {featured.map((item, index) => (
              <ProductCard key={item._id} product={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="collection-message">
            Featured pieces are being selected.{" "}
            <Link to="/search">
              Browse everything <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </section>

      {/* <section className="ocean-intro">
        <span>
          <i /> ROOTED IN CARE, INSPIRED BY WATER
        </span>
        <p>
          A world beneath the surface,
          <br />
          <em>made a little more yours.</em>
        </p>
        <span className="ocean-intro-mark">
          <Waves size={17} />
        </span>
      </section> */}

      <section className="home-section collections-section" id="collections">
        <div className="section-heading premium-heading">
          <div>
            <span className="eyebrow">A LIVING WORLD BELOW THE SURFACE</span>
            <h2>
              Explore Our <em>Aquatic World.</em>
            </h2>
          </div>
          <p>
            Meet colourful aquatic life, discover lush plants and find
            thoughtful essentials for the world you’re creating.
          </p>
        </div>
        <div className="explore-aquatic-scene" aria-hidden="true">
          <motion.div
            className="explore-light-rays"
            animate={{ opacity: [0.18, 0.34, 0.2], x: ["-2%", "2%", "-2%"] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="explore-bubbles">
            {Array.from({ length: 16 }, (_, i) => (
              <i
                key={i}
                style={{
                  "--bubble-left": `${4 + ((i * 19) % 92)}%`,
                  "--bubble-delay": `${-((i * 1.7) % 14)}s`,
                  "--bubble-duration": `${12 + (i % 5) * 2}s`,
                  "--bubble-size": `${4 + (i % 4) * 2}px`,
                }}
              />
            ))}
          </div>
          <AquaticPlantArt className="explore-plant explore-plant-left" />
          <AquaticPlantArt className="explore-plant explore-plant-right" />
          <motion.img
            className="explore-betta"
            src="/images/betta-swim.webp"
            alt=""
            draggable="false"
            animate={{
              x: ["-4vw", "70vw", "-4vw"],
              y: [0, -10, 5],
              scaleX: [1, 1, -1],
            }}
            transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div className="category-showcase explore-category-showcase">
          {categories.map((category, i) => (
            <motion.article
              className={`category-tile category-tile-${i + 1} category-tile-${category.category}`}
              key={category.href}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <Link to={category.href}>
                <img
                  src={category.image}
                  alt={`${category.title} underwater scene`}
                  loading="lazy"
                />
                <span className="category-overlay" />
                <span className="category-content">
                  <span className="category-icon">
                    <category.icon size={18} />
                  </span>
                  <small>{category.count}</small>
                  <strong>{category.title}</strong>
                  <span>{category.subtitle}</span>
                  <i>
                    <ArrowUpRight size={16} />
                  </i>
                </span>
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      {categories.map((category, categoryIndex) => {
        const seenProducts = new Set();
        const categoryItems = items
          .filter((item) => {
            const id = item._id || item.id;
            const hasImage = Boolean(
              item.images?.[0]?.url || item.images?.[0] || item.image,
            );
            if (
              normalizeProductCategory(item.category) !== category.category ||
              !item.isAvailable ||
              Number(item.stock) <= 0 ||
              !hasImage ||
              !id ||
              seenProducts.has(id)
            ) {
              return false;
            }
            seenProducts.add(id);
            return true;
          })
          .sort(
            (a, b) =>
              new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
          )
          .slice(0, 8);
        return (
          <section
            className={`home-section home-category-section home-category-${category.category}`}
            key={category.category}
          >
            <div className="section-heading premium-heading">
              <div>
                <span className="eyebrow">
                  8 THOUGHTFUL FINDS · {category.count}
                </span>
                <h2>{category.title}</h2>
                <p>{category.subtitle}</p>
              </div>
            </div>
            {loading ? (
              <div className="product-grid home-product-grid home-category-grid">
                {Array.from({ length: 8 }, (_, i) => (
                  <div className="product-skeleton" key={i} />
                ))}
              </div>
            ) : categoryItems.length ? (
              <div className="product-grid home-product-grid home-category-grid">
                {categoryItems.map((item, index) => (
                  <ProductCard
                    key={item._id || item.id}
                    product={item}
                    index={index + categoryIndex}
                  />
                ))}
              </div>
            ) : (
              <div className="collection-message">
                This collection is being prepared.{" "}
              </div>
            )}
            <div className="home-explore-all-wrap">
              <Link className="home-explore-all" to={category.href}>
                Explore All Products <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </section>
        );
      })}

      {/* <section className="home-image-break">
        <img
          src={gallery[0][1]}
          alt="Sunlight through a lush planted aquarium"
          loading="lazy"
        />
        <div className="image-break-overlay" />
        <div className="image-break-copy">
          <span className="eyebrow">DESIGNED TO FEEL LIKE A DEEP BREATH</span>
          <h2>
            A slower rhythm.
            <br />
            <em>A brighter world.</em>
          </h2>
          <Link className="button button-aqua" to="/plants">
            Discover aquatic plants <ArrowRight size={15} />
          </Link>
        </div>
        <span className="image-break-caption">
          AQUASCAPING · A STUDY IN STILLNESS
        </span>
      </section> */}

      {/* <section className="home-section product-edit-section">
          <div className="section-heading premium-heading">
            <div>
              <span className="eyebrow">THE VERMA EDIT</span>
              <h2>
                Best-loved <em>essentials.</em>
              </h2>
            </div>
            <Link className="text-link" to="/aquarium-products">
              Shop aquarium products <ArrowUpRight size={15} />
            </Link>
          </div>
          {bestSellers.length ? (
            <div className="product-grid">
              {bestSellers.map((item, index) => (
                <ProductCard key={item._id} product={item} index={index} />
              ))}
            </div>
          ) : (
            <div className="collection-message">
              Our best-loved essentials will appear here as they’re added to the
              collection.
            </div>
          )}
        </section> */}

      {/* <section className="plant-feature">
        <div className="plant-feature-image">
          <img
            src={gallery[0][1]}
            alt="A flourishing aquatic planted tank"
            loading="lazy"
          />
          <span>01 / THE LIVING COLLECTION</span>
        </div>
        <div className="plant-feature-copy">
          <span className="eyebrow">GROW A LITTLE SOMETHING</span>
          <h2>
            More green.
            <br />
            <em>More alive.</em>
          </h2>
          <p>
            Give your aquarium a sense of place with aquatic plants chosen for
            their colour, character and quiet ability to make a habitat feel
            whole.
          </p>
          <div className="plant-benefits">
            <span>
              <Check size={14} /> Thoughtful plant picks
            </span>
            <span>
              <Check size={14} /> Advice for every setup
            </span>
          </div>
          <Link className="button button-deep" to="/plants">
            Explore aquatic plants <ArrowRight size={15} />
          </Link>
        </div>
      </section> */}

      {/* <section className="home-section arrivals-section">
        <div className="section-heading premium-heading">
          <div>
            <span className="eyebrow">JUST ARRIVED IN OUR WATERS</span>
            <h2>
              Fresh from <em>the tank.</em>
            </h2>
          </div>
          <Link className="text-link" to="/search">
            See all new arrivals <ArrowUpRight size={15} />
          </Link>
        </div>
        {arrivals.length ? (
          <div className="product-grid">
            {arrivals.map((item, index) => (
              <ProductCard key={item._id} product={item} index={index} />
            ))}
          </div>
        ) : (
          <div className="collection-message">
            New arrivals will show up here as soon as they are added in the
            shop.
          </div>
        )}
      </section> */}

      {/* <section className="gallery-section">
        <div className="gallery-head">
          <div>
            <span className="eyebrow light-eyebrow">
              A WINDOW INTO OUR WATERS
            </span>
            <h2>
              Little scenes.
              <br />
              <em>Endless wonder.</em>
            </h2>
          </div>
          <p>
            Every aquarium holds a different kind of calm. Here are a few worlds
            we love.
          </p>
        </div>
        <div className="aquarium-gallery">
          {gallery.map(([name, image], i) => (
            <figure
              className={`gallery-frame gallery-frame-${i + 1}`}
              key={name}
            >
              <img src={image} alt={name} loading="lazy" />
              <figcaption>
                <span>0{i + 1}</span>
                {name}
              </figcaption>
            </figure>
          ))}
        </div>
        <span className="gallery-footnote">
          AQUARIUM GALLERY <i /> A MOMENT BELOW THE SURFACE
        </span>
      </section> */}

      <section className="home-section why-section" id="why">
        <div className="section-heading premium-heading">
          <div>
            <span className="eyebrow">A GOOD HOME STARTS WITH GOOD CARE</span>
            <h2>
              Why Verma <em>Enterprises?</em>
            </h2>
          </div>
          <p>
            We believe the joy of keeping an aquarium begins with care,
            knowledge and a little wonder.
          </p>
        </div>
        <div className="why-grid">
          {[
            {
              icon: Heart,
              title: "Care before anything",
              text: "We help match aquatic life to a home where it can truly thrive.",
            },
            {
              icon: ShieldCheck,
              title: "Knowledge you can trust",
              text: "Real guidance from people who understand the little details.",
            },
            {
              icon: Droplets,
              title: "A healthier habitat",
              text: "Thoughtful essentials for clear water and balanced ecosystems.",
            },
            {
              icon: Leaf,
              title: "Nature in every detail",
              text: "Aquatic plants and considered choices to bring your tank to life.",
            },
          ].map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span>
                <item.icon size={20} />
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>
      <section className="faq-section" id="faq">
        <div className="faq-bubbles" aria-hidden="true">
          {Array.from({ length: 12 }, (_, index) => (
            <i
              key={index}
              style={{
                "--faq-bubble-left": `${6 + ((index * 19) % 90)}%`,
                "--faq-bubble-duration": `${16 + (index % 4) * 3}s`,
                "--faq-bubble-delay": `${-index * 1.7}s`,
                "--faq-bubble-size": `${5 + (index % 4) * 3}px`,
              }}
            />
          ))}
        </div>
        <div className="faq-shell">
          <header className="faq-heading">
            <span className="eyebrow">VERMA ENTERPRISES · AQUARIUM CARE</span>
            <h2>Frequently Asked Questions</h2>
            <p>
              Everything you need to know about aquatic pets, aquarium plants
              and aquarium essentials.
            </p>
          </header>
          <div className="faq-list">
            {questions.map(([question, answer], i) => {
              const isOpen = openFaq === i;
              const answerId = `faq-answer-${i + 1}`;
              return (
                <article
                  className={isOpen ? "faq-item open" : "faq-item"}
                  key={question}
                >
                  <button
                    id={`faq-question-${i + 1}`}
                    aria-controls={answerId}
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <strong>{question}</strong>
                    <span className="faq-toggle-icon" aria-hidden="true">
                      {isOpen ? <Minus size={19} /> : <Plus size={19} />}
                    </span>
                  </button>
                  <div
                    className="faq-answer"
                    id={answerId}
                    role="region"
                    aria-labelledby={`faq-question-${i + 1}`}
                    aria-hidden={!isOpen}
                  >
                    <div className="faq-answer-inner">
                      <p>{answer}</p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="faq-help">
            <div>
              <h3>Still have questions?</h3>
              <p>
                Tell us what you need help with and our team will point you in
                the right direction.
              </p>
            </div>
            <div className="faq-help-actions">
              <a className="button button-aqua" href="#contact">
                Contact Us <ArrowRight size={16} />
              </a>
              <WhatsAppCta className="button faq-whatsapp-button">
                <MessageCircle size={16} /> Chat on WhatsApp
              </WhatsAppCta>
            </div>
          </div>
        </div>
      </section>

      <section className="care-journal" id="care">
        <div className="care-journal-card">
          <div className="care-journal-photo">
            <img
              src={gallery[2][1]}
              alt="Vibrant coral reef aquarium with colorful fish"
              loading="lazy"
            />
            <span className="care-photo-caption">A HEALTHIER WORLD, BELOW THE SURFACE</span>
          </div>
          <div className="care-journal-copy">
            <span className="eyebrow">THE AQUARIUM CARE JOURNAL</span>
            <h2>
              Good water is a
              <br />
              <em>love language.</em>
            </h2>
            <p>
              Small, steady habits make the biggest difference. Start with a few
              simple guides to water quality, feeding, lighting and choosing
              compatible tankmates.
            </p>
            <div className="care-links">
              <a href="#faq">
                <span className="care-link-icon"><Droplets size={18} /></span>
                <span>Water quality basics</span>
                <ArrowUpRight size={16} />
              </a>
              <a href="#faq">
                <span className="care-link-icon"><Fish size={18} /></span>
                <span>Starting your first aquarium</span>
                <ArrowUpRight size={16} />
              </a>
              <a href="#faq">
                <span className="care-link-icon"><Leaf size={18} /></span>
                <span>A guide to aquatic plants</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
        <div className="care-journal-waves" aria-hidden="true">
          <svg viewBox="0 0 1440 110" preserveAspectRatio="none">
            <path d="M0 57c180 42 279-31 470-9s281 51 471 19 324-34 499 1v42H0Z" fill="currentColor" opacity=".08" />
            <path d="M0 79c196-31 336 9 510 6 201-4 320-46 514-32 163 12 269 43 416 12v45H0Z" fill="currentColor" opacity=".11" />
          </svg>
        </div>
      </section>

      {/* <section className="testimonial-section">
        <div className="testimonial-heading">
          <span className="eyebrow">
            KIND WORDS FROM OUR AQUARIUM COMMUNITY
          </span>
          <h2>
            Good things <em>grow together.</em>
          </h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map(([quote, name, caption]) => (
            <article key={name}>
              <span className="testimonial-stars">★★★★★</span>
              <blockquote>{quote}</blockquote>
              <div>
                <span className="testimonial-avatar">{name[0]}</span>
                <span>
                  <strong>{name}</strong>
                  <small>{caption}</small>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section> */}

      <section className="contact-ocean" id="contact">
        <div className="contact-ocean-background" />
        <div className="contact-ocean-copy">
          <span className="eyebrow light-eyebrow">
            LET’S MAKE YOUR AQUARIUM FEEL LIKE YOURS
          </span>
          <h2>
            Tell us what
            <br />
            you’re <em>dreaming of.</em>
          </h2>
          <p>
            A new tank, a curious fish or a question about care — our team would
            love to help you find your way.
          </p>
          <WhatsAppCta className="button button-aqua">
            <MessageCircle size={16} /> Chat with us on WhatsApp
          </WhatsAppCta>
          {/* <a
            className="contact-email"
            href="mailto:hello@vermaenterprises.example"
          >
            Or send us an email <ArrowUpRight size={14} />
          </a> */}
        </div>
        <form className="enquiry-form" onSubmit={sendEnquiry}>
          <div className="enquiry-form-heading">
            <span className="eyebrow">SEND A NOTE TO OUR TEAM</span>
            <span className="enquiry-form-mark">
              <Waves size={17} />
            </span>
          </div>
          <div className="enquiry-fields">
            <label>
              Your name
              <input
                required
                minLength="2"
                maxLength="100"
                value={enquiry.name}
                onChange={(e) =>
                  setEnquiry({ ...enquiry, name: e.target.value })
                }
                placeholder="Name"
              />
            </label>
            <label>
              Email address
              <input
                required
                type="email"
                maxLength="254"
                value={enquiry.email}
                onChange={(e) =>
                  setEnquiry({ ...enquiry, email: e.target.value })
                }
                placeholder="you@example.com"
              />
            </label>
            <label>
              Phone (optional)
              <input
                type="tel"
                maxLength="40"
                value={enquiry.phone}
                onChange={(e) =>
                  setEnquiry({ ...enquiry, phone: e.target.value })
                }
                placeholder="A number we can reach you on"
              />
            </label>
            <label>
              What’s on your mind?
              <textarea
                required
                minLength="10"
                maxLength="2000"
                rows="3"
                value={enquiry.message}
                onChange={(e) =>
                  setEnquiry({ ...enquiry, message: e.target.value })
                }
                placeholder="Tell us about your tank, your plans, or anything you’d like to ask…"
              />
            </label>
          </div>
          {enquiryMessage && (
            <p className="enquiry-feedback" role="status">
              {enquiryMessage}
            </p>
          )}
          <button
            className="button button-aqua enquiry-submit"
            disabled={enquiryBusy}
          >
            {enquiryBusy ? "Sending your note…" : "Send your enquiry"}{" "}
            <ArrowRight size={15} />
          </button>
        </form>
        <div className="contact-mark">
          <Sparkles size={23} />
          <span>
            WE’RE HERE
            <br />
            TO HELP
          </span>
        </div>
      </section>
    </main>
  );
}
