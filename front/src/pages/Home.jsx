import React, { useState } from "react";
import BannerCarousel from "../components/BannerCarousel";

const categories = [
  { name: "Smartfon və aksesuarlar", icon: "📱" },
  { name: "Böyük Məişət texnikası", icon: "🛒" },
  { name: "Kiçik Məişət Texnikası", icon: "☕" },
  { name: "TV, Audio, Foto texnika", icon: "📺", active: true },
  { name: "Smart saat və Qulaqlıqlar", icon: "⌚" },
  { name: "Kompüter və Ofis avadanlıqları", icon: "💻" },
  { name: "Mebel və Tekstil", icon: "🛋" },
  { name: "İkinci əl məhsullar", icon: "🔄" },
  { name: "Oyun konsolları və aksesuarları", icon: "🎮" },
  { name: "Şəxsi qulluq və Gözəllik", icon: "💄" },
  { name: "Ev və mətbəx əşyaları", icon: "🏠" },
];

const products = [
  {
    name: "Apple iPhone 16 Pro Max 256GB Black Titanium",
    price: 3349,
    oldPrice: 3699,
    offer: "AirPods 2 HƏDİYYƏ!",
    image: "iphone_16_pro_max.png",
  },
];

const newProducts = [
  {
    category: "Yeni Məhsullar",
    items: [
      {
        name: "Puzzle Assassin's Creed Valhalla",
        price: 39,
        oldPrice: 49,
        image: "puzzle_ac_valhalla.png",
      },
      {
        name: "Beko B50 C 890 A TV & Vacuum Cleaner",
        price: 1115,
        oldPrice: 1200,
        image: "beko_tv_vacuum.png",
      },
      {
        name: "Funko-POP Disney: Donald Duck",
        price: 39,
        oldPrice: 59,
        image: "funko_donald_duck.png",
      },
      {
        name: "Funko-POP Star Wars: Stormtrooper",
        price: 39,
        oldPrice: 59,
        image: "funko_stormtrooper.png",
      },
    ],
  },
];

const Sidebar = () => (
    <aside className="w-80  bg-white p-4 shadow-md rounded-lg">
      <ul className="space-y-2 m-5">
        {categories.map((cat, index) => (
          <li
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all 
              ${
                cat.active
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "hover:bg-gray-200"
              }`}
          >
            <span className="text-lg">{cat.icon}</span>
            <span className="text-sm">{cat.name}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
  

const Banner = () => (
  <div className="flex-1 bg-gray-200 p-8 text-center">
    <h2 className="text-2xl font-bold">Smart alış-verişə hazır ol!</h2>
    <p className="text-xl">GEEPAS MƏHSULLARI</p>
    <div className="text-4xl font-bold my-4">0 AZN <span className="text-lg">aylıq</span></div>
    <img src="geepas_banner.png" alt="Geepas Products" className="mx-auto" />
  </div>
);

const ProductCard = ({ product }) => (
  <div className="border p-4 rounded-lg shadow-md w-72">
    <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
    <h3 className="font-semibold mt-2">{product.name}</h3>
    <p className="text-lg font-bold text-red-500">{product.price} AZN</p>
    <p className="text-gray-500 line-through">{product.oldPrice} AZN</p>
    <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">Bir kliklə al</button>
  </div>
);

const NewProductsSection = () => {
  const [activeTab, setActiveTab] = useState("Yeni Məhsullar");
  return (
    <div className="mt-8 p-10">
      <div className="flex space-x-6 border-b pb-2">
        {["Yeni Məhsullar", "Ən çox satılan", "Outlet", "Kampaniyalar"].map((tab) => (
          <button
            key={tab}
            className={`text-lg font-bold ${activeTab === tab ? "text-black" : "text-gray-400"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-6 mt-4">
        {newProducts.find((section) => section.category === activeTab)?.items.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <BannerCarousel />
        
        {/* <div className="flex gap-6 mt-4">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div> */}
      </div>
    </div>
    <NewProductsSection />
    </>
  );
};

export default Home;
