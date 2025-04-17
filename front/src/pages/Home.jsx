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
    axios.get("http://localhost:8085/products/all")
      .then((res) => {
        const unique = [...new Set(res.data.map((p) => p.category).filter(Boolean))];
        const sorted = unique.sort((a, b) => a.localeCompare(b));
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
          className={`cursor-pointer px-4 py-2 rounded-lg transition-all ${
            selectedCategory === ""
              ? "bg-blue-100 text-blue-600 font-semibold"
              : "hover:bg-gray-100"
          }`}
        >
          🛍️ All Categories
        </li>

        {categories.map((cat, index) => (
          <li
            key={index}
            onClick={() => setSelectedCategory(cat)}
            className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition-all ${
              selectedCategory === cat
                ? "bg-blue-100 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
          >
            <span>{categoryIcons[cat] || categoryIcons.Default}</span>
            <span>{cat}</span>
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
    <div className="border p-4 rounded-2xl shadow-lg w-72 bg-white transition-transform hover:scale-105 hover:shadow-xl relative">
        {/* Heart */}
        <button
            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
            className="absolute  top-2 right-2 focus:outline-none ">
      <span
          className={
              "text-3xl select-none " +
              (isInWishlist
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent cursor-pointer"
                  : "text-gray-300 cursor-pointer")
          }>
        {isInWishlist ? "♥" : "♡"}
      </span>
        </button>

        {/* Image */}
        <div className="relative w-full h-44">
            <img
                src={product.imageUrl || "default_product_image.png"}
                alt={product.name}
                className="w-full h-full object-cover rounded-xl"
            />
        </div>

        {/* Text */}
        <h3 className="font-semibold mt-3 text-gray-800 text-lg">{product.name}</h3>
        <p className="text-xl font-bold text-red-500 mt-1">${product.price}</p>

        {/* View / Buy */}
        <Link to={`/product/${product.id}`}>
            <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg text-lg font-semibold hover:opacity-90">
                Bir kliklə al
            </button>
        </Link>
    </div>
);


const ProductTabsSection = ({ selectedCategory, wishlistIds, toggleWishlist  }) => {
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
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory ? product.category === selectedCategory : true
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
            className={`text-lg font-bold pb-2 transition ${
              activeTab === tab
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
    const dispatch     = useDispatch();
    const currentUser  = useSelector((s) => s.user.currentUser);
    const wishlistItems= useSelector((s) => s.wishlist.items || []);
    const wishlistIds  = new Set(wishlistItems.map((w) => w.product.id));

    useEffect(() => {
        if (currentUser?.id) dispatch(fetchWishlist(currentUser.id));
    }, [currentUser?.id, dispatch]);

    const toggleWishlist = (productId) => {
        if (!currentUser?.id) return;             // user not logged in
        if (wishlistIds.has(productId)) {
            dispatch(removeFromWishlist({ userId: currentUser.id, productId }));
        } else {
            dispatch(addToWishlist({    userId: currentUser.id, productId }));
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
