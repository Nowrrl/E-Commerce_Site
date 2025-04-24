import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BannerCarousel from "../components/BannerCarousel";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../redux/wishlistSLice";

import puzzleImage from "../img/puzzle.jpeg";
import vacuumCleanerImage from "../img/vacuumcleaner.jpeg";
import disneyImage from "../img/disney.jpeg";
import stormImage from "../img/stormtrooper.jpeg";

// Define categories (if needed)
// Icon mapping based on category name
const categoryIcons = {
  Smartphone: "📱",
  Laptop: "💻",
  Tablet: "📲",
  Headphones: "🎧",
  Mouse: "🖱️",
  Keyboard: "⌨️",
  Storage: "💾",
  Smartwatch: "⌚",
  Monitor: "🖥️",
  Speaker: "🔊",
  Default: "🛒"
};

const getCategoryIcon = (name) => {
  if (!name || typeof name !== "string") return categoryIcons.Default;

  const cleanedName = name.trim().toLowerCase();

  // Lowercased emoji map
  const iconMap = Object.fromEntries(
    Object.entries(categoryIcons).map(([k, v]) => [k.toLowerCase(), v])
  );

  // Exact match
  if (iconMap[cleanedName]) return iconMap[cleanedName];

  // Fuzzy match: find closest key that starts with the same letters
  const match = Object.keys(iconMap).find((key) =>
    cleanedName.startsWith(key.slice(0, 5)) // match first few letters
  );

  return iconMap[match] || iconMap.default || "🛒";
};

// Define newProducts array with unique IDs
const newProducts = [
  {
    category: "Yeni Məhsullar",
    items: [
      {
        id: "1",
        name: "Puzzle Assassin's Creed Valhalla",
        price: 39,
        oldPrice: 49,
        image: puzzleImage,
      },
      {
        id: "2",
        name: "Beko B50 C 890 A TV & Vacuum Cleaner",
        price: 1115,
        oldPrice: 1200,
        image: vacuumCleanerImage,
      },
      {
        id: "3",
        name: "Funko-POP Disney: Donald Duck",
        price: 39,
        oldPrice: 59,
        image: disneyImage,
      },
      {
        id: "4",
        name: "Funko-POP Star Wars: Stormtrooper",
        price: 39,
        oldPrice: 59,
        image: stormImage,
      },
    ],
  },
];

const AllProducts = [
  {
    // placeholder
  },
];

const Sidebar = ({ selectedCategory, setSelectedCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8085/admin/categories")
      .then((res) => {
        const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
        setCategories(sorted);
      })
      .catch((err) => console.error("Failed to load categories", err));
  }, []);


  return (
    <aside className="w-80 bg-white p-6 shadow-lg rounded-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        🔍 Find by Category
      </h2>
      <ul className="space-y-2">
        <li
          onClick={() => setSelectedCategory("")}
          className={`cursor-pointer px-4 py-2 rounded-lg transition-all ${selectedCategory === ""
            ? "bg-blue-100 text-blue-600 font-semibold"
            : "hover:bg-gray-100"
            }`}
        >
          🛍️ All Categories
        </li>

        {categories.map((cat) => (
          <li
            key={cat.id || cat.name}
            onClick={() => setSelectedCategory(cat.name)}
            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all ${selectedCategory === cat.name
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-gray-100"
              }`}
          >
            <span>{getCategoryIcon(cat.name)}</span>
            <span>{cat.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};


const Banner = () => (
  <div className="flex-1 bg-gray-200 p-8 text-center">
    <h2 className="text-2xl font-bold">Smart alış-verişə hazır ol!</h2>
    <p className="text-xl">GEEPAS MƏHSULLARI</p>
    <div className="text-4xl font-bold my-4">
      111 AZN <span className="text-lg">aylıq</span>
    </div>
    <img src="geepas_banner.png" alt="Geepas Products" className="mx-auto" />
  </div>
);

const ProductCard = ({ product, isInWishlist, toggleWishlist }) => (
  <div className="relative p-4 bg-white rounded-2xl shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]">
    {/* Heart Icon */}
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleWishlist(product.id);
      }}
      className="absolute top-3 right-3 text-gray-300 hover:scale-110 transition-transform"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isInWishlist ? "url(#grad)" : "none"}
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-7 h-7"
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.8 6.8a5.5 5.5 0 00-7.7 0L12 8.9l-2.1-2.1a5.5 5.5 0 00-7.7 7.7l9.8 9.8 9.8-9.8a5.5 5.5 0 000-7.7z"
        />
      </svg>
    </button>

    {/* Product Image */}
    <Link to={`/product/${product.id}`}>
      <div className="w-full h-44 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
        <img
          src={product.imageUrl || "/products_images/default_product_image.png"}
          alt={product.name}
          className="object-contain w-full h-full p-2"
        />
      </div>
    </Link>

    {/* Product Info */}
    <div className="mt-3">
      <h3 className="font-medium text-gray-800 text-md truncate">{product.name}</h3>
      <p className="text-red-500 font-bold text-lg">${product.price}</p>
    </div>

    {/* CTA Button */}
    <Link to={`/product/${product.id}`}>
      <button className="mt-3 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2 rounded-xl hover:brightness-110 transition">
        Bir kliklə al
      </button>
    </Link>
  </div>
);



const ProductTabsSection = ({ selectedCategory, wishlistIds, toggleWishlist }) => {
  const [activeTab, setActiveTab] = useState("All Products");
  const [backendProducts, setBackendProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const tabs = [
    "All Products",
    "New",
    "Used",
    "Most Purchase",
    "Sales",
  ];

  useEffect(() => {
    axios
      .get("http://localhost:8085/products/all")
      .then((res) => setBackendProducts(res.data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const filtered = backendProducts
    .filter(p => p.approvedBySales) // only show approved products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category.name === selectedCategory : true
    );

  const sorted = filtered.sort((a, b) => {
    if (sortBy === "priceAsc") return a.price - b.price;
    if (sortBy === "priceDesc") return b.price - a.price;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="mt-8 p-10 bg-gray-100 rounded-xl">
      {/* Tab Buttons */}
      <div className="flex space-x-6 border-b pb-3 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`text-lg font-bold pb-2 transition ${activeTab === tab
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Only show backend products for All Products tab */}
      {activeTab === "All Products" ? (
        <>
          <div className="flex mt-4 space-x-4">
            <input
              type="text"
              placeholder="Search Products..."
              className="p-2 border rounded-lg"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="p-2 border rounded-lg"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="priceAsc">Price Low to High</option>
              <option value="priceDesc">Price High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-4 gap-6 mt-6">
            {sorted.length > 0 ? (
              sorted.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isInWishlist={wishlistIds.has(product.id)}
                  toggleWishlist={toggleWishlist}
                />
              ))
            ) : (
              <div className="col-span-4 flex flex-col items-center justify-center py-10 bg-white rounded-lg shadow-md border border-gray-200">
                <div className="text-5xl mb-3">📭</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-1">
                  No Products Found
                </h3>
                <p className="text-sm text-gray-500">
                  Try another category or keyword.
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center py-10">
          🔧 Placeholder for <b>{activeTab}</b> — connect to backend filtering logic if needed.
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  // ---- wishlist wiring ----
  const dispatch = useDispatch();
  const currentUser = useSelector((s) => s.user.currentUser);
  const wishlistItems = useSelector((s) => s.wishlist.items || []);
  const wishlistIds = new Set(wishlistItems.map((w) => w.product.id));

  useEffect(() => {
    if (currentUser?.id) dispatch(fetchWishlist(currentUser.id));
  }, [currentUser?.id, dispatch]);

  const toggleWishlist = (productId) => {
    if (!currentUser?.id) return;             // user not logged in
    if (wishlistIds.has(productId)) {
      dispatch(removeFromWishlist({ userId: currentUser.id, productId }));
    } else {
      dispatch(addToWishlist({ userId: currentUser.id, productId }));
    }
  };

  return (
    <div className="border-t-1 border-white p-10 bg-gradient-to-b from-black to-purple-900">
      {/* Example: Button to go to Cart near top */}
      <div className="mb-6">
        <Link
          to="/wishlist"
          className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Wishlist
        </Link>
      </div>

      <div className="flex">
        <Sidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        <div className="flex-1 p-8">
          {/* If you have a BannerCarousel, use it. Otherwise the sample Banner */}
          <BannerCarousel />
        </div>
      </div>
      <ProductTabsSection
        selectedCategory={selectedCategory}
        wishlistIds={wishlistIds}
        toggleWishlist={toggleWishlist}
      />
    </div>
  );
};

export default Home;