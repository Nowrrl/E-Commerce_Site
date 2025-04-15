import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { addToBackendCart } from "../api/api";

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

  // State definitions
  const [productData, setProductData] = useState(null);
  const [quantity, setQuantity] = useState("1");
  const [installment, setInstallment] = useState("3");
  // Use an array state so multiple accordion sections can be toggled independently.
  const [openIndexes, setOpenIndexes] = useState([]);
  const [comments, setComments] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, text: "" });

  // Fetch product and comments data on mount / id change
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productResponse, commentsResponse] = await Promise.all([
          axios.get(`http://localhost:8085/products/${id}`),
          axios.get(`http://localhost:8085/comments/product/${id}`)
        ]);
        setProductData(productResponse.data);
        setComments(commentsResponse.data);
        console.log("Comments fetched:", commentsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!productData) {
    return (
      <div className="text-center p-10 text-white">
        Loading product details...
      </div>
    );
  }

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

  const totalPrice = productData.price * quantity;
  const monthlyInstallment = totalPrice / parseInt(installment, 10);

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

  const otherProducts = [
    { id: 1, img: otherProduct1, name: "iPhone 15" },
    { id: 2, img: otherProduct2, name: "iPhone 14" },
    { id: 3, img: otherProduct3, name: "iPhone 13" },
    { id: 4, img: otherProduct4, name: "iPhone 12" },
  ];

  // Handle comment submission
  const handleCommentSubmit = async () => {
    if (newComment.trim() === "") return;
    try {
      const userId = currentUser?.id;
      const productId = productData.id;
      const response = await axios.post("http://localhost:8085/comments/add", null, {
        params: { userId, productId, text: newComment, rating: 5 },
      });
      const savedComment = response.data;
      setComments((prevComments) => [
        ...prevComments,
        { user: { username: currentUser?.username || "Anonymous" }, text: savedComment.text },
      ]);
      setNewComment("");
    } catch (error) {
      console.error("Failed to submit comment:", error);
    }
  };

  // Check if the current user already submitted a review
  const hasReviewed = reviews.some((review) => review.user === currentUser?.username);

  const handleReviewSubmit = () => {
    if (hasReviewed) {
      alert("You have already submitted a review.");
      return;
    }
    const newEntry = {
      rating: newReview.rating,
      user: currentUser?.username || "Anonymous",
      text: newReview.text || "",
    };
    setReviews([...reviews, newEntry]);
    alert("Review submitted!");
    setNewReview({ rating: 5, text: "" });
  };
  const handleQuantityChange = (e) => {
    const val = e.target.value;
    if (/^\d{0,2}$/.test(val)) { // allow only 0-2 digit numbers
      setQuantity(val);
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
        <span className="cursor-pointer hover:underline">&raquo;</span>
        <Link to="/smartphones" className="hover:underline cursor-pointer">Smartphones</Link>
        <span className="cursor-pointer hover:underline">&raquo;</span>
        <span className="cursor-pointer hover:underline">{productData.name}</span>
      </nav>

      {/* Product Details Container */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg">
        {/* Left Column: Thumbnails + Main Image */}
        <div className="flex-shrink-0 w-full md:w-96">
          <div className="flex space-x-2 mb-4">
            <img src={iphone16Thumb1} alt="Thumbnail 1" className="w-16 h-16 border rounded cursor-pointer" />
            <img src={iphone16Thumb2} alt="Thumbnail 2" className="w-16 h-16 border rounded cursor-pointer" />
            <img src={iphone16Thumb3} alt="Thumbnail 3" className="w-16 h-16 border rounded cursor-pointer" />
          </div>
          <img className="w-full h-auto border border-gray-200 rounded" src={iphone16Image} alt={productData.name} />
        </div>

        {/* Right Column: Product Info */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="mb-2">
            <h1 className="text-2xl font-semibold text-white">{productData.name}</h1>
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
          <div className="flex items-center space-x-2 mb-4">
            <label htmlFor="quantity" className="font-medium">Quantity:</label>
            <input
              id="quantity"
              type="number"
                  min="1"
                  max="99"
             
              value={quantity}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              className="w-12 border rounded px-2 py-1 text-center"
            />

          </div>
          <div className="flex items-center space-x-2 mb-4">
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
          <div className="text-lg font-bold mb-4">Total: ${totalPrice.toFixed(2)}</div>
          <div className="flex space-x-4">
            <button
              onClick={handleAddToCart}
              className="bg-gradient-to-b from-black to-purple-900 text-white px-6 py-2 rounded transition cursor-pointer hover:scale-105 hover:brightness-110"
            >
              Add to Cart
            </button>
            <Link
              to="/cart"
              className="bg-gradient-to-b from-black to-purple-900 text-white px-6 py-2 rounded transition cursor-pointer hover:scale-105 hover:brightness-110"
            >
              Go to Shopping Cart
            </Link>
            <button
              onClick={() => console.log("Add to Wishlist clicked")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg transition cursor-pointer hover:scale-105 hover:opacity-90"
            >
              💖 Add to Wishlist
            </button>
          </div>
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
                  className={`h-4 w-4 transform transition-transform duration-200 ${openIndexes.includes(index) ? "rotate-90" : ""}`}
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
            <div className={`px-4 pb-4 overflow-hidden transition-all ease-in-out duration-300 ${openIndexes.includes(index) ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
              {section.content}
            </div>
          </div>
        ))}
      </div>

      {/* Other Products (Static) */}
      <div className="mt-8">
        <h2 className="text-lg text-white font-semibold mb-4">Other Products Viewed</h2>
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {otherProducts.map((product) => (
            <div
              key={product.id}
              className="min-w-[120px] flex flex-col items-center border border-white rounded p-2 transition-transform translate-x-1 translate-y-1 duration-200 hover:scale-105 cursor-pointer"
            >
              <img src={product.img} alt={product.name} className="w-24 h-24 object-cover mb-2" />
              <p className="text-sm text-white">{product.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews & Comments Section */}
      <div className="mt-8 border-t border-gray-300 pt-4 bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-6">Customer Reviews & Comments</h2>

        {/* Reviews Section */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Leave a Review</h3>
          {reviews.some((r) => r.user === currentUser?.username) ? (
            <p className="text-yellow-300 mb-4">✅ You have already submitted a review.</p>
          ) : (
            <div className="flex flex-col space-y-2 mb-6">
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value, 10) })}
                className="border border-gray-300 p-2 rounded w-32 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
              >
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>
                    {star} Stars
                  </option>
                ))}
              </select>
              <textarea
                className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Write your review here..."
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
              />
              <button
                onClick={handleReviewSubmit}
                className="self-start bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition cursor-pointer"
              >
                Submit Review
              </button>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mb-6">
              <h4 className="text-md text-white">
                Average Rating:{" "}
                <span className="text-yellow-400 font-bold">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </span>{" "}
                / 5
              </h4>
              <div className="flex gap-1 mt-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={i < Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) ? "text-yellow-400" : "text-gray-500"}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-green-700">{review.user}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {review.text && <p className="text-gray-800">{review.text}</p>}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-700">Customer Comments</h3>
          <div className="flex flex-col space-y-2 mb-4">
            <textarea
              className="border border-gray-300 p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Write your comment here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={handleCommentSubmit}
              className="self-start bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition cursor-pointer"
            >
              Submit Comment
            </button>
          </div>
          <div className="space-y-4">
            {comments && comments.length > 0 ? (
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-gray-100 p-4 rounded-lg shadow-sm border-l-4 border-purple-500"
                >
                  <p className="font-semibold text-purple-700 mb-1">{comment.user.username}:</p>
                  <p className="text-gray-800">comment: {comment.text}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Productdetails;
