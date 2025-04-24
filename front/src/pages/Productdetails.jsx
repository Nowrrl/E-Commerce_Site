import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { addToCart } from "../redux/cartSlice";
import { addToBackendCart } from "../api/api";

import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSlice";

// Example images imports...
import iphone16Image from "../img/iphone16image.webp";
import iphone16Thumb1 from "../img/iphone16image.webp";
import iphone16Thumb2 from "../img/iphone16image.webp";
import iphone16Thumb3 from "../img/iphone16image.webp";
import otherProduct1 from "../img/iphone16image.webp";
import otherProduct2 from "../img/iphone16image.webp";
import otherProduct3 from "../img/iphone16image.webp";
import otherProduct4 from "../img/iphone16image.webp";


const Productdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);
  const buildImgSrc = (raw) => {
    // fallback placeholder in case the product has no image
    if (!raw) return "/products_images/default_product_image.png";
    // ^ put that file in front/public/products_images if you don't have one yet

    // raw already contains "http://…" → leave it
    if (raw.startsWith("http")) return raw;

    // otherwise it's a relative path like "/products_images/iphone15.jpg"
    // We want the React dev‑server to serve it, so return it untouched
    return raw;
  };

  const wishlistItems = useSelector((state) => state.wishlist.items || []);


  // State definitions
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [installment, setInstallment] = useState("3");
  // Use an array state so multiple accordion sections can be toggled independently.
  const [openIndexes, setOpenIndexes] = useState([]);
  const [comments, setComments] = useState(null);
  const [otherProducts, setOtherProducts] = useState([]);
  const cartItems = useSelector((state) => state.cart.items);
  const cartQuantityForThisProduct =
    cartItems.find((item) => item.product.id === parseInt(id))?.quantity || 0;
  const availableStock = productData ? productData.quantity - cartQuantityForThisProduct : 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productRes = await axios.get(`http://localhost:8085/products/${id}`);
        if (!productRes.data.approvedBySales) {
          // Redirect user away if not approved
          navigate("/");
          return;
        }
        const approvedCommentsRes = await axios.get(`http://localhost:8085/comments/product/${id}`);

        const approvedComments = approvedCommentsRes.data;
        setComments(approvedComments);
        setProductData(productRes.data);

        // Optional: update local storage for viewed products
        const viewed = JSON.parse(localStorage.getItem("viewedProducts")) || [];
        const exists = viewed.find((p) => p.id === productRes.data.id);
        if (!exists) {
          const updated = [productRes.data, ...viewed].slice(0, 20);
          localStorage.setItem("viewedProducts", JSON.stringify(updated));
        }

        /* ── 2. fetch all products, pick 4 others from the same category ── */
        const allRes = await axios.get("http://localhost:8085/products/all");
        const similar = allRes.data
          .filter(p => p.category?.name === productRes.data.category?.name && p.id !== productRes.data.id)
          .slice(0, 4);                     // keep only four

        setOtherProducts(similar);
      } catch (err) {
        console.error("Error fetching product‑details data:", err);
      }
    };

    fetchData();
  }, [id]);


  useEffect(() => {
    if (currentUser?.id) {
      dispatch(fetchWishlist(currentUser.id));
    }
  }, [currentUser?.id, dispatch]);

  if (!productData) {
    return (
      <div className="text-center p-10 text-white">
        Loading product details...
      </div>
    );
  }


  const isInWishlist = wishlistItems.some(
    (w) => w.product.id === productData?.id
  );

  // Handle "Add to Cart" and then navigate to the cart page
  const handleAddToCart = async () => {
    dispatch(addToCart({ product: productData, quantity }));
    try {
      const response = await addToBackendCart(
        currentUser?.username || currentUser?.email,
        productData.name,
        quantity
      );
      console.log("Added to backend cart:", response);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const toggleWishlist = async () => {
    if (!currentUser?.id || !productData?.id) return;

    if (isInWishlist) {
      await dispatch(
        removeFromWishlist({
          userId: currentUser.id,
          productId: productData.id,
        })
      ).unwrap();
    } else {
      await dispatch(
        addToWishlist({
          userId: currentUser.id,
          productId: productData.id,
        })
      ).unwrap();
    }
  };



  const totalPrice = productData.price * quantity;
  const monthlyInstallment = totalPrice / Math.max(parseInt(installment, 10), 1);



  // Define accordion sections
  const accordionSections = [
    {
      title: "Product Details",
      content: (
        <div className="text-sm text-gray-300 space-y-2">
          <p>{productData.description || "No description available."}</p>
        </div>
      ),
    },
    {
      title: "Technical Specifications",
      content: (
        <div className="text-sm text-gray-300 grid grid-cols-2 gap-y-2 gap-x-4">
          <div className="font-medium">Model</div>
          <div>{productData.model}</div>
          <div className="font-medium">Serial Number</div>
          <div>{productData.serialNumber}</div>
          <div className="font-medium">Quantity Available</div>
          <div>{productData.quantity}</div>
          <div className="font-medium">Warranty</div>
          <div>{productData.warrantyStatus}</div>
          <div className="font-medium">Distributor Info</div>
          <div>{productData.distributorInfo}</div>
        </div>
      ),
    },
    {
      title: "Promotions",
      content: (
        <div className="text-sm text-gray-300">
          <p>Details about current promotions will be available here.</p>
        </div>
      ),
    },
    {
      title: "Shipping & Return Policy",
      content: (
        <div className="text-sm text-gray-300">
          <p>Free shipping and 14-day returns available.</p>
          <p>Please contact customer support for more details.</p>
        </div>
      ),
    },
    {
      title: "Payment Options",
      content: (
        <div className="text-sm text-gray-300">
          <p>
            Payment options include credit card, bank transfer, cash on delivery,
            and installment plans.
          </p>
          <p>For more details, please proceed to the payment page.</p>
        </div>
      ),
    },
    {
      title: "Product Reviews",
      content: (
        <div className="text-sm text-gray-300">
          <p>No reviews yet. (Or show your own logic here.)</p>
        </div>
      ),
    },
  ];

  // Toggle an accordion section independently
  const toggleAccordion = (index) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      if (val < 1) setQuantity(1);
      else if (val > availableStock) setQuantity(availableStock); // 👈 limit to remaining stock
      else setQuantity(val);
    }
  };


  const handleQuantityBlur = () => {
    const num = parseInt(quantity, 10);
    if (!num || num < 1) {
      setQuantity("1");
    } else if (num > 99) {
      setQuantity("99");
    } else {
      setQuantity(String(num));
    }
  };

  return (
    <div className="border-t-1 border-white max-w-screen-xl mx-auto p-4 bg-gradient-to-b from-black to-purple-900">
      {/* Breadcrumbs */}
      <nav className="mb-4 text-sm text-white flex items-center space-x-2">
        <Link to="/" className="hover:underline cursor-pointer">Home</Link>
        <span className="cursor-pointer">&raquo;</span>
        <Link
          to={`/category/${productData.category?.name?.toLowerCase() || "unknown"}`}
          className="hover:underline cursor-pointer"
        >
          {productData.category?.name || "Category"}
        </Link>
        <span className="cursor-pointer">&raquo;</span>
        <span>{productData.name}</span>
      </nav>



      {/* Main card */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg">
        {/* left thumbnails */}
        <div className="flex-shrink-0 w-full md:w-96">
          <div className="flex space-x-2 mb-4">
            <img src={buildImgSrc(productData.imageUrl)} alt="Thumbnail 1" className="w-16 h-16 border rounded" />
            <img src={buildImgSrc(productData.imageUrl)} alt="Thumbnail 2" className="w-16 h-16 border rounded" />
            <img src={buildImgSrc(productData.imageUrl)} alt="Thumbnail 3" className="w-16 h-16 border rounded" />
          </div>
          <img
            src={buildImgSrc(productData.imageUrl)}
            alt={productData.name}
            className="w-full h-auto border border-gray-200 rounded"
            onError={(e) => {
              e.target.src = "/products_images/default_product_image.png"; // fallback image
            }}
          />

        </div>

        {/* right info */}
        <div className="flex-1 flex flex-col justify-between">
          {/* title + wishlist */}
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {productData.name}
            </h1>
            <button onClick={toggleWishlist} className="focus:outline-none">
              <span
                className={
                  "text-5xl leading-none transition-transform hover:scale-110 " +
                  (isInWishlist
                    ? "bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                    : "text-gray-300 cursor-pointer")
                }>
                {isInWishlist ? "♥" : "♡"}
              </span>
            </button>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold text-black">${productData.price}</p>
          </div>
          <div className="mb-4">
            <p className="text-sm text-gray-700">
              Distributor: <span className="font-medium">{productData.distributorInfo || "Unknown"}</span>
            </p>
            <p className="text-sm text-gray-700">
              Warranty: <span className="font-medium">{productData.warrantyStatus}</span>
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 mb-4">
            <div className="flex items-center gap-2 mb-2 sm:mb-0">
              <label htmlFor="quantity" className="text-sm font-medium">Quantity:</label>
              <input
                type="number"
                id="quantity"
                min="1"
                max="99"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 px-2 py-1 border rounded-md"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="installment" className="font-medium">Installments:</label>
              <select
                id="installment"
                value={installment}
                onChange={(e) => setInstallment(e.target.value)}
                className="border rounded px-2 py-1 cursor-pointer"
              >
                <option value="1">1 Month</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>
              <span className="font-bold text-gray-600">${monthlyInstallment.toFixed(2)} / month</span>
            </div>
          </div>

          <div className="text-lg font-bold mb-4">Total: ${totalPrice.toFixed(2)}</div>
          {productData.quantity > 0 ? (
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={quantity > availableStock}

                className={`px-6 py-2 rounded font-semibold transition cursor-pointer ${quantity > availableStock
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-b from-black to-purple-900 text-white hover:scale-105 hover:brightness-110"
                  }`}

              >
                Add to Cart
              </button>
              {quantity > availableStock && (
                <p className="text-sm text-red-600 mt-2">
                  ⚠️ Only {availableStock} left you can add. You already have {cartQuantityForThisProduct} in your cart.
                </p>
              )}
            </div>




          ) : (
            <div className="text-red-600 font-semibold mt-4">🚫 Out of Stock</div>
          )}


        </div>
      </div>

      {/* Accordion Sections */}
      <div className="mt-8 border-t border-gray-300 pt-2">
        {accordionSections.map((section, index) => (
          <div key={index} className="border-b border-gray-200 mb-2">
            <button
              className="cursor-pointer w-full text-left py-2 px-2 flex items-center justify-between focus:outline-none"
              onClick={() => toggleAccordion(index)}
            >
              <span className="font-medium text-white">{section.title}</span>
              <span className="text-white">
                <svg
                  className={'h-4 w-4 transform transition-transform duration-200 ${openIndexes.includes(index) ? "rotate-90" : ""}'}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </button>
            <div className={'px-4 pb-4 overflow-hidden transition-all ease-in-out duration-300 ${openIndexes.includes(index) ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}'}>
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Other Products Viewed */}
      <div className="mt-12">
        <h2 className="text-xl font-bold text-white mb-4">🧾 Other Products You Might Like</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {otherProducts.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative pt-[100%] overflow-hidden rounded-t-2xl bg-gray-100">
                <img
                  src={buildImgSrc(product.image_url || product.imageUrl)}
                  alt={product.name}
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <p className="text-gray-900 font-semibold text-sm truncate">{product.name}</p>
                <p className="text-purple-700 font-bold text-base">${product.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>





      {/* Reviews & Comments Section */}
      <div className="mt-16 bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 text-center border-b pb-4">🗣️ Customer Feedback</h2>



        {comments && comments.length > 0 ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {comments.map((comment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gray-100 p-5 rounded-xl border-l-4 border-purple-500 shadow relative"
              >
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-purple-700">{comment.user.username}</p>
                  <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                </div>

                <>
                  {comment.rating && (
                    <div className="flex gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < comment.rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-gray-800 text-sm leading-relaxed">{comment.text}</p>
                </>




              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>



  );
};

export default Productdetails;
