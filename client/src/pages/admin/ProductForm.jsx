import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ImagePlus, Plus, Trash2 } from "lucide-react";
import {
  createProduct,
  getProduct,
  updateProduct,
  uploadImage,
} from "../../services/productService";

const emptyProduct = {
  name: "",
  category: "fish",
  subcategory: "",
  price: "",
  isSamplePrice: true,
  description: "",
  images: [],
  stock: 0,
  isAvailable: true,
  isFeatured: false,
};

export default function ProductForm({ edit = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(emptyProduct);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(edit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!edit || !id) return;
    let active = true;
    getProduct(id)
      .then((data) => {
        if (active) setProduct({ ...emptyProduct, ...data });
      })
      .catch((err) => {
        if (active)
          setError(err.response?.data?.message || "Could not load this product.");
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [edit, id]);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setProduct((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function addImage(url, publicId) {
    const cleanUrl = url.trim();
    if (!cleanUrl) return;
    setProduct((current) => ({
      ...current,
      images: [...current.images, { url: cleanUrl, ...(publicId ? { publicId } : {}) }].slice(0, 5),
    }));
    setImageUrl("");
  }

  async function handleImageUpload(event) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    setError("");
    setUploading(true);
    try {
      const remaining = Math.max(0, 5 - product.images.length);
      for (const file of files.slice(0, remaining)) {
        const uploaded = await uploadImage(file);
        addImage(uploaded.url, uploaded.publicId);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not upload the selected image.");
    } finally {
      setUploading(false);
    }
  }

  function removeImage(index) {
    setProduct((current) => ({
      ...current,
      images: current.images.filter((_, imageIndex) => imageIndex !== index),
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
    };
    try {
      if (edit) await updateProduct(id, payload);
      else await createProduct(payload);
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save this product.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="admin-page loading-state">
        <span className="spinner" /> Loading product details…
      </div>
    );

  return (
    <div className="admin-page form-page">
      <div className="admin-heading">
        <div>
          <Link className="text-link" to="/admin/products">
            <ArrowLeft size={15} /> Back to products
          </Link>
          <h1>{edit ? "Edit product" : "Add a product"}</h1>
          <p>Keep the details and availability for your collection up to date.</p>
        </div>
      </div>
      {error && <div className="form-error">{error}</div>}
      <form className="product-form" onSubmit={submit}>
        <div className="form-main">
          <section className="form-panel">
            <h2>Product details</h2>
            <p>Add the name and information customers will see.</p>
            <label>
              Product name
              <input name="name" value={product.name} onChange={updateField} required minLength={2} maxLength={100} />
            </label>
            <div className="form-two">
              <label>
                Category
                <select name="category" value={product.category} onChange={updateField} required>
                  <option value="fish">Aquatic pets &amp; animals</option>
                  <option value="plants">Aquatic &amp; aquarium plants</option>
                  <option value="aquarium">Aquarium products &amp; accessories</option>
                </select>
              </label>
              <label>
                Product type
                <input name="subcategory" value={product.subcategory || ""} onChange={updateField} maxLength={60} />
              </label>
            </div>
            <label>
              Description
              <textarea name="description" value={product.description} onChange={updateField} required minLength={10} maxLength={2000} rows={6} />
            </label>
          </section>

          <section className="form-panel">
            <h2>Product images</h2>
            <p>Upload images or add public image URLs. Add up to five images.</p>
            <div className="image-upload-grid">
              {product.images.map((image, index) => (
                <div className="upload-thumb" key={`${image.url}-${index}`}>
                  <img src={image.url} alt={`${product.name || "Product"} ${index + 1}`} />
                  <button type="button" onClick={() => removeImage(index)} aria-label="Remove image">
                    <Trash2 size={14} />
                  </button>
                  {index === 0 && <span>MAIN IMAGE</span>}
                </div>
              ))}
              {product.images.length < 5 && (
                <label className="upload-box">
                  <ImagePlus size={19} />
                  <strong>{uploading ? "Uploading…" : "Upload image"}</strong>
                  <small>JPG, PNG OR WEBP</small>
                  <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <label className="url-add">
              Public image URL
              <input type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} placeholder="https://example.com/image.jpg" />
            </label>
            <button className="url-add" type="button" onClick={() => addImage(imageUrl)} disabled={!imageUrl.trim() || product.images.length >= 5}>
              <Plus size={14} /> Add image URL
            </button>
          </section>
        </div>

        <aside className="form-sidebar">
          <section className="form-panel">
            <h2>Price and stock</h2>
            <p>Prices are numeric and shown to customers in Indian Rupees.</p>
            <label>
              Price (₹ INR)
              <input name="price" type="number" min="0" step="0.01" value={product.price} onChange={updateField} required />
            </label>
            <label className="toggle-row">
              <span><strong>Sample price</strong><small>Mark this as an editable sample price.</small></span>
              <input name="isSamplePrice" type="checkbox" checked={Boolean(product.isSamplePrice)} onChange={updateField} />
            </label>
            <label>
              Stock quantity
              <input name="stock" type="number" min="0" step="1" value={product.stock} onChange={updateField} required />
            </label>
          </section>
          <section className="form-panel">
            <h2>Store status</h2>
            <label className="toggle-row">
              <span><strong>Available</strong><small>Show this product as available to customers.</small></span>
              <input name="isAvailable" type="checkbox" checked={Boolean(product.isAvailable)} onChange={updateField} />
            </label>
            <label className="toggle-row">
              <span><strong>Featured</strong><small>Highlight this product in featured collections.</small></span>
              <input name="isFeatured" type="checkbox" checked={Boolean(product.isFeatured)} onChange={updateField} />
            </label>
          </section>
          <button className="button button-dark" type="submit" disabled={saving || uploading || product.images.length === 0}>
            {saving ? "Saving…" : edit ? "Save product" : "Add product"}
          </button>
          {product.images.length === 0 && <small>Add at least one product image before saving.</small>}
        </aside>
      </form>
    </div>
  );
}
