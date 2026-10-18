import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import "./Accessories.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const Accessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 
useEffect(() => {
  let cancelled = false;

  const fetchAccessories = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      const allProducts = Array.isArray(data)
        ? data
        : data.products || [];

      const accessoriesOnly = allProducts.filter((product) => {
        const category = String(product.category || "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

        return category === "accessories";
      });

      if (!cancelled) {
        setProducts(accessoriesOnly);
      }
    } catch (error) {
      console.error("Accessories fetch error:", error);

      if (!cancelled) {
        setProducts([]);
      }
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  };

  fetchAccessories();

  return () => {
    cancelled = true;
  };
}, []);

  return (
    <main className="accessories-page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="accessories-hero">
        <div className="accessories-hero-content">

          <span className="accessories-eyebrow">
            MAMTA ACCESSORIES
          </span>

          <h1>
            Little Things,
            <span>Extra Comfort</span>
          </h1>

          <p>
            Discover thoughtful accessories designed to add
            softness, comfort and a little luxury to your everyday
            routine.
          </p>

        </div>
      </section>

      {/* =================================================
          PRODUCTS
      ================================================= */}

      <section className="accessories-products">

        <div className="accessories-container">

          

          {loading ? (
            <div className="accessories-message">
              <p>Loading accessories...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="accessories-message">
              <h3>No accessories available yet</h3>

              <p>
                Add a product from the admin panel with the
                category <strong>Accessories</strong>.
              </p>
            </div>
          ) : (
            <div className="accessories-product-grid">

              {products.map((product) => (

                <Link
                  key={product._id || product.id}
                  to={`/product/${product._id || product.id}`}
                  className="accessory-product-card"
                >

                  <div className="accessory-product-image">

                    <img
                      src={
                        product.image ||
                        product.images?.[0] ||
                        "https://via.placeholder.com/500x600?text=MAMTA"
                      }
                      alt={product.name}
                    />

                    <span className="accessory-product-arrow">
                      <ArrowUpRight
                        size={19}
                        strokeWidth={1.6}
                      />
                    </span>

                  </div>

                  <div className="accessory-product-info">

                    <h3>{product.name}</h3>

                    <p>
                      {product.description ||
                        "Thoughtfully designed for comfort and everyday use."}
                    </p>

                    <div className="accessory-product-bottom">

                      <span className="accessory-product-price">
                        Rs. {Number(product.price || 0).toLocaleString()}
                      </span>

                      <span className="accessory-product-link">
                        View Product
                      </span>

                    </div>

                  </div>

                </Link>

              ))}

            </div>
          )}

        </div>

      </section>

    </main>
  );
};

export default Accessories;