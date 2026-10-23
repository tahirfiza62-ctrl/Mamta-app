
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Search,
  RefreshCw,
  Plus,
  Pencil,
  Trash2,
  Package,
  Eye,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import "./AdminProducts.css";

/* =========================================================
   ADMIN PRODUCTS API
========================================================= */

const API_URL =
  "https://mamta-app-8.onrender.com/api/admin/products";


const AdminProducts = () => {
  const navigate = useNavigate();


  /* =======================================================
     STATE
  ======================================================= */

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");


  /* =======================================================
     TOKEN
  ======================================================= */

  const getToken = () => {
    return localStorage.getItem(
      "mamta_admin_token"
    );
  };


  /* =======================================================
     FETCH PRODUCTS
     GET /api/admin/products/all
  ======================================================= */

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/admin");
        return;
      }

      const response = await axios.get(
        `${API_URL}/all`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;


      if (
        data &&
        Array.isArray(data.products)
      ) {
        setProducts(data.products);

      } else if (
        Array.isArray(data)
      ) {
        setProducts(data);

      } else {
        setProducts([]);
      }

    } catch (err) {
      console.error(
        "ADMIN PRODUCTS ERROR:",
        err
      );


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem(
          "mamta_admin_token"
        );

        localStorage.removeItem(
          "mamta_admin_user"
        );

        navigate("/admin");

        return;
      }


      setError(
        err.response?.data?.message ||
        "Unable to load products."
      );

    } finally {
      setLoading(false);
    }
  };


  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    let ignore = false;


    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");


        const token = getToken();


        if (!token) {
          navigate("/admin");
          return;
        }


        const response = await axios.get(
          `${API_URL}/all`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


        if (ignore) {
          return;
        }


        const data = response.data;


        if (
          data &&
          Array.isArray(data.products)
        ) {
          setProducts(
            data.products
          );

        } else if (
          Array.isArray(data)
        ) {
          setProducts(data);

        } else {
          setProducts([]);
        }

      } catch (err) {

        if (ignore) {
          return;
        }


        console.error(
          "ADMIN PRODUCTS ERROR:",
          err
        );


        if (
          err.response?.status === 401 ||
          err.response?.status === 403
        ) {

          localStorage.removeItem(
            "mamta_admin_token"
          );

          localStorage.removeItem(
            "mamta_admin_user"
          );

          navigate("/admin");

          return;
        }


        setError(
          err.response?.data?.message ||
          "Unable to load products."
        );

      } finally {

        if (!ignore) {
          setLoading(false);
        }

      }
    };


    loadProducts();


    return () => {
      ignore = true;
    };

  }, [navigate]);


  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {

    const uniqueCategories = [
      ...new Set(
        products
          .map(
            (product) =>
              product.category
          )
          .filter(Boolean)
      ),
    ];


    return [
      "All",
      ...uniqueCategories,
    ];

  }, [products]);


  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {

    const searchValue =
      search
        .toLowerCase()
        .trim();


    return products.filter(
      (product) => {

        const productName =
          product.name
            ?.toLowerCase() || "";


        const productCategory =
          product.category
            ?.toLowerCase() || "";


        const matchesSearch =
          !searchValue ||
          productName.includes(
            searchValue
          ) ||
          productCategory.includes(
            searchValue
          );


        const matchesCategory =
          category === "All" ||
          product.category ===
            category;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );

  }, [
    products,
    search,
    category,
  ]);


  /* =======================================================
     DELETE PRODUCT
     DELETE /api/admin/products/:id
  ======================================================= */

  const handleDelete = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this product?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(id);
      setError("");


      const token =
        getToken();


      if (!token) {
        navigate("/admin");
        return;
      }


      await axios.delete(
        `${API_URL}/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );


      /* REMOVE PRODUCT FROM UI */

      setProducts(
        (prev) =>
          prev.filter(
            (product) =>
              (product._id ||
                product.id) !== id
          )
      );


      alert(
        "Product deleted successfully."
      );


    } catch (err) {

      console.error(
        "DELETE PRODUCT ERROR:",
        err
      );


      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {

        localStorage.removeItem(
          "mamta_admin_token"
        );

        localStorage.removeItem(
          "mamta_admin_user"
        );

        navigate("/admin");

        return;
      }


      alert(
        err.response?.data?.message ||
        "Unable to delete product."
      );


    } finally {

      setDeletingId(null);

    }

  };


  /* =======================================================
     IMAGE
  ======================================================= */

  const getProductImage = (product) => {

    if (product.image) {
      return product.image;
    }


    if (
      Array.isArray(
        product.images
      ) &&
      product.images.length > 0
    ) {
      return product.images[0];
    }


    return "";

  };


  /* =======================================================
     PRICE
  ======================================================= */

  const getPrice = (product) => {

    return (
      product.price ??
      product.new_price ??
      0
    );

  };


  /* =======================================================
     OLD PRICE
  ======================================================= */

  const getOldPrice = (product) => {

    return (
      product.oldPrice ??
      product.old_price ??
      null
    );

  };


  /* =======================================================
     STATUS
  ======================================================= */

  const isActive = (product) => {

    return (
      product.active !== false
    );

  };


  /* =======================================================
     VIEW PRODUCT
  ======================================================= */

  const handleView = (id) => {

    navigate(
      `/admin/products/${id}`
    );

  };


  /* =======================================================
     EDIT PRODUCT
  ======================================================= */

  const handleEdit = (id) => {

    navigate(
      `/admin/products/edit/${id}`
    );

  };


  /* =======================================================
     ADD PRODUCT
  ======================================================= */

  const handleAddProduct = () => {

    navigate(
      "/admin/products/add"
    );

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="admin-products-page">


      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="admin-products-header">

        <div>

          <div className="admin-products-title-row">

            <div className="admin-products-icon">
              <Package size={22} />
            </div>


            <div>

              <h1>
                Products
              </h1>

              <p>
                Manage all products available
                in your MAMTA store.
              </p>

            </div>

          </div>

        </div>


        {/* ADD PRODUCT */}

        <button
          className="admin-add-product-btn"
          onClick={
            handleAddProduct
          }
        >

          <Plus size={18} />

          Add Product

        </button>

      </div>


      {/* =================================================
          TOOLBAR
      ================================================= */}

      <div className="admin-products-toolbar">


        {/* SEARCH */}

        <div className="admin-search-box">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        {/* CATEGORY */}

        <div className="admin-filter-box">

          <Filter size={17} />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
          >

            {categories.map(
              (item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              )
            )}

          </select>

        </div>


        {/* REFRESH */}

        <button
          className="admin-refresh-btn"
          onClick={
            fetchProducts
          }
          disabled={loading}
        >

          <RefreshCw
            size={17}
            className={
              loading
                ? "admin-refresh-spin"
                : ""
            }
          />

          Refresh

        </button>

      </div>


      {/* =================================================
          RESULTS INFO
      ================================================= */}

      <div className="admin-products-results">

        <span>

          Showing{" "}

          <strong>
            {
              filteredProducts.length
            }
          </strong>

          {" "}of{" "}

          <strong>
            {
              products.length
            }
          </strong>

          {" "}products

        </span>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="admin-products-error">
          {error}
        </div>

      )}


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="admin-products-loading">

          <RefreshCw
            size={28}
            className="admin-refresh-spin"
          />

          <p>
            Loading products...
          </p>

        </div>

      ) : filteredProducts.length === 0 ? (


        /* =================================================
           EMPTY
        ================================================= */

        <div className="admin-products-empty">

          <div className="admin-empty-icon">
            <Package size={36} />
          </div>


          <h3>
            No products found
          </h3>


          <p>

            {products.length === 0
              ? "You have not added any products yet."
              : "Try changing your search or category filter."}

          </p>


          {products.length === 0 && (

            <button
              className="admin-add-product-btn"
              onClick={
                handleAddProduct
              }
            >

              <Plus size={18} />

              Add Your First Product

            </button>

          )}

        </div>

      ) : (


        /* =================================================
           PRODUCTS TABLE
        ================================================= */

        <div className="admin-products-table-wrapper">

          <table className="admin-products-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Status
                </th>

                <th>
                  Actions
                </th>

              </tr>

            </thead>


            <tbody>

              {filteredProducts.map(
                (product) => {

                  const id =
                    product._id ||
                    product.id;


                  const image =
                    getProductImage(
                      product
                    );


                  const price =
                    getPrice(
                      product
                    );


                  const oldPrice =
                    getOldPrice(
                      product
                    );


                  const active =
                    isActive(
                      product
                    );


                  return (

                    <tr
                      key={id}
                    >


                      {/* PRODUCT */}

                      <td>

                        <div className="admin-product-cell">


                          {/* IMAGE */}

                          <div className="admin-product-image">

                            {image ? (

                              <img
                                src={image}
                                alt={
                                  product.name
                                }
                              />

                            ) : (

                              <Package
                                size={24}
                              />

                            )}

                          </div>


                          {/* INFO */}

                          <div className="admin-product-info">

                            <strong>
                              {
                                product.name
                              }
                            </strong>

                            <span>
                              ID:{" "}
                              {String(
                                id
                              ).slice(-8)}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* CATEGORY */}

                      <td>

                        <span className="admin-category">

                          {
                            product.category ||
                            "Uncategorized"
                          }

                        </span>

                      </td>


                      {/* PRICE */}

                      <td>

                        <div className="admin-price">

                          <strong>

                            Rs.{" "}

                            {Number(
                              price
                            ).toLocaleString()}

                          </strong>


                          {oldPrice !==
                            null &&
                            oldPrice !==
                              "" && (

                              <del>

                                Rs.{" "}

                                {Number(
                                  oldPrice
                                ).toLocaleString()}

                              </del>

                            )}

                        </div>

                      </td>


                      {/* STOCK */}

                      <td>

                        <span
                          className={`
                            admin-stock
                            ${
                              Number(
                                product.stock
                              ) <= 0
                                ? "out"
                                : Number(
                                    product.stock
                                  ) <= 5
                                ? "low"
                                : ""
                            }
                          `}
                        >

                          {
                            product.stock ??
                            0
                          }

                        </span>

                      </td>


                      {/* STATUS */}

                      <td>

                        <span
                          className={`
                            admin-status
                            ${
                              active
                                ? "active"
                                : "inactive"
                            }
                          `}
                        >

                          <span></span>

                          {active
                            ? "Active"
                            : "Inactive"}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-product-actions">


                          {/* VIEW */}

                          <button
                            className="view"
                            title="View Product"
                            onClick={() =>
                              handleView(
                                id
                              )
                            }
                          >

                            <Eye
                              size={17}
                            />

                          </button>


                          {/* EDIT */}

                          <button
                            className="edit"
                            title="Edit Product"
                            onClick={() =>
                              handleEdit(
                                id
                              )
                            }
                          >

                            <Pencil
                              size={17}
                            />

                          </button>


                          {/* DELETE */}

                          <button
                            className="delete"
                            title="Delete Product"
                            disabled={
                              deletingId ===
                              id
                            }
                            onClick={() =>
                              handleDelete(
                                id
                              )
                            }
                          >

                            {deletingId ===
                            id ? (

                              <RefreshCw
                                size={17}
                                className="admin-refresh-spin"
                              />

                            ) : (

                              <Trash2
                                size={17}
                              />

                            )}

                          </button>

                        </div>

                      </td>

                    </tr>

                  );

                }
              )}

            </tbody>

          </table>

        </div>

      )}

    </section>
  );
};


export default AdminProducts;
