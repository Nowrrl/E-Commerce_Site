import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import iphone16Image from "../img/iphone16image.webp";
import iphone16Thumb1 from "../img/iphone16image.webp";
import iphone16Thumb2 from "../img/iphone16image.webp";
import iphone16Thumb3 from "../img/iphone16image.webp";
import otherProduct1 from "../img/iphone16image.webp";
import otherProduct2 from "../img/iphone16image.webp";
import otherProduct3 from "../img/iphone16image.webp";
import otherProduct4 from "../img/iphone16image.webp";

const ProductDetails = () => {
    // Always call hooks at the top
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [installment, setInstallment] = useState("3");
    const [openIndex, setOpenIndex] = useState(null);

    // Dummy products data
    const products = {
        "1": {
            brand: "Apple",
            title: "iPhone 16 128GB",
            price: 799.0,
            stockStatus: "In Stock",
            deliveryInfo: "Free Delivery",
            rating: 4.5,
            reviewsCount: 130,
            seller: "Smart Electronics",
            warranty: "2-Year Apple Warranty",
            image: iphone16Image,
        },
        "2": {
            brand: "Beko",
            title: "Beko TV & Vacuum Cleaner Combo",
            price: 1115.0,
            stockStatus: "In Stock",
            deliveryInfo: "Free Delivery",
            rating: 4.0,
            reviewsCount: 85,
            seller: "Home Appliances",
            warranty: "1-Year Warranty",
            image: iphone16Image, // Replace with appropriate image
        },
        "3": {
            brand: "Disney",
            title: "Funko-POP Donald Duck",
            price: 39.0,
            stockStatus: "Limited Stock",
            deliveryInfo: "Delivery in 3 days",
            rating: 4.2,
            reviewsCount: 60,
            seller: "Funko Store",
            warranty: "No Warranty",
            image: otherProduct1, // Replace with appropriate image
        },
        "4": {
            brand: "Star Wars",
            title: "Funko-POP Stormtrooper",
            price: 39.0,
            stockStatus: "Limited Stock",
            deliveryInfo: "Delivery in 3 days",
            rating: 4.0,
            reviewsCount: 50,
            seller: "Funko Store",
            warranty: "No Warranty",
            image: otherProduct2, // Replace with appropriate image
        },
    };

    const productData = products[productId];

    // Conditional return if product is not found
    if (!productData) {
        return (
            <div className="max-w-screen-xl mx-auto p-4">
                <p>Product not found.</p>
                <Link to="/" className="text-blue-500 hover:underline">
                    Return Home
                </Link>
            </div>
        );
    }

    // Calculate total price and monthly installment
    const totalPrice = productData.price * quantity;
    const monthlyInstallment = totalPrice / parseInt(installment);

    // Accordion toggle
    const toggleAccordion = (index) =>
        setOpenIndex(openIndex === index ? null : index);

    const accordionSections = [
        {
            title: "Product Details",
            content: (
                <div className="text-sm text-gray-700 space-y-2">
                    <p>
                        Introducing {productData.title} – the latest innovation from {productData.brand} that redefines what's possible in a smartphone...
                    </p>
                </div>
            ),
        },
        {
            title: "Technical Specifications",
            content: (
                <div className="text-sm text-gray-700 grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="font-medium">Warranty</div>
                    <div>{productData.warranty}</div>
                    <div className="font-medium">Delivery Info</div>
                    <div>{productData.deliveryInfo}</div>
                    <div className="font-medium">Stock Status</div>
                    <div>{productData.stockStatus}</div>
                </div>
            ),
        },
    ];

    const otherProducts = [
        { id: "1", img: otherProduct1, name: "iPhone 15" },
        { id: "2", img: otherProduct2, name: "iPhone 14" },
        { id: "3", img: otherProduct3, name: "iPhone 13" },
        { id: "4", img: otherProduct4, name: "iPhone 12" },
    ];

    return (
        <div className="max-w-screen-xl mx-auto p-4">
            {/* Breadcrumbs */}
            <nav className="mb-4 text-sm text-gray-600 flex items-center space-x-2">
                <Link to="/" className="hover:underline cursor-pointer">
                    Home
                </Link>
                <span>&raquo;</span>
                <Link to="/smartphones" className="hover:underline cursor-pointer">
                    Smartphones
                </Link>
                <span>&raquo;</span>
                <span>{productData.title}</span>
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
                    <img
                        className="w-full h-auto border border-gray-200 rounded"
                        src={productData.image}
                        alt={productData.title}
                    />
                </div>

                {/* Right Column: Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="mb-2">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">{productData.brand}</p>
                        <h1 className="text-2xl font-semibold">{productData.title}</h1>
                    </div>
                    <div className="flex items-center mb-4">
                        <div className="text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{i < Math.floor(productData.rating) ? "★" : "☆"}</span>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
              {productData.rating} / 5 ({productData.reviewsCount} reviews)
            </span>
                    </div>
                    <div className="mb-4">
                        <p className="text-3xl font-bold text-black">${productData.price}</p>
                        <p className="text-sm text-green-600 font-semibold">{productData.stockStatus}</p>
                        <p className="text-sm text-gray-500">{productData.deliveryInfo}</p>
                    </div>
                    <div className="mb-4">
                        <p className="text-sm text-gray-700">
                            Seller: <span className="font-medium">{productData.seller}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            Warranty: <span className="font-medium">{productData.warranty}</span>
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
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                            className="w-16 border rounded px-2 py-1 cursor-pointer"
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
                        <span className="font-bold text-gray-600">
              ${monthlyInstallment.toFixed(2)} / month
            </span>
                    </div>
                    <div className="text-lg font-bold mb-4">
                        Total: ${totalPrice.toFixed(2)}
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-gradient-to-b from-black to-purple-900 text-white px-6 py-2 rounded transition cursor-pointer hover:scale-105 hover:brightness-110">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Accordion Sections */}
            <div className="mt-8 border-t border-gray-300 pt-4">
                {accordionSections.map((section, index) => (
                    <div key={index} className="border-b border-gray-200 mb-2">
                        <button
                            className="cursor-pointer w-full text-left py-3 px-2 flex items-center justify-between focus:outline-none"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span className="font-medium text-gray-700">{section.title}</span>
                            <span className="text-gray-500">{openIndex === index ? "-" : "+"}</span>
                        </button>
                        {openIndex === index && (
                            <div className="px-4 pb-4">{section.content}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Other Products */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Other Products Viewed</h2>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {otherProducts.map((product) => (
                        <div key={product.id} className="min-w-[120px] flex flex-col items-center border border-gray-200 rounded p-2">
                            <img
                                src={product.img}
                                alt={product.name}
                                className="w-24 h-24 object-cover mb-2 cursor-pointer"
                            />
                            <p className="text-sm text-gray-700">{product.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
