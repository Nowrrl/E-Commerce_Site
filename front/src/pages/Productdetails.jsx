import React, { useState } from "react";
import { Link } from "react-router-dom";
import iphone16Image from "../img/iphone16image.webp";

// Example thumbnails
import iphone16Thumb1 from "../img/iphone16image.webp";
import iphone16Thumb2 from "../img/iphone16image.webp";
import iphone16Thumb3 from "../img/iphone16image.webp";

// Example “other products” images
import otherProduct1 from "../img/iphone16image.webp";
import otherProduct2 from "../img/iphone16image.webp";
import otherProduct3 from "../img/iphone16image.webp";
import otherProduct4 from "../img/iphone16image.webp";

const ProductDetails = () => {
    // State for quantity and installment
    const [quantity, setQuantity] = useState(1);
    const [installment, setInstallment] = useState("3");

    // Accordion state: which section is open?
    const [openIndex, setOpenIndex] = useState(null);

    // Sample product data
    const productData = {
        brand: "Apple",
        title: "iPhone 16 128GB",
        price: 799.0,
        stockStatus: "In Stock",
        deliveryInfo: "Free Delivery",
        rating: 4.5,
        reviewsCount: 130,
        seller: "Smart Electronics",
        warranty: "2-Year Apple Warranty",
    };

    // Calculate total price (price * quantity)
    const totalPrice = productData.price * quantity;

    // Calculate monthly installment (total / numberOfMonths)
    const monthlyInstallment = totalPrice / parseInt(installment);

    // Accordion data
    const accordionSections = [
        {
            title: "Product Details",
            content: (
                <div className="text-sm text-gray-700 space-y-2">
                    <p>
                        Introducing iPhone 16 – the latest innovation from Apple that redefines what's possible in a smartphone. With a stunning design featuring the revolutionary Dynamic Island, the iPhone 16 delivers a seamless and immersive experience by integrating notifications and live activities into one fluid interface. Powered by the advanced A16 Bionic chip, it offers lightning-fast performance and energy efficiency for smooth multitasking and gaming. Capture life's moments in breathtaking detail with a brand-new 48 MP main camera that produces vivid, high-resolution images and videos. The iPhone 16 also features enhanced durability with an all-glass back and aerospace-grade aluminum edges, along with USB‑C connectivity for universal charging. Safety is paramount with innovative features like Crash Detection, while iOS 17 brings personalized widgets, interactive notifications, and dynamic interfaces that adapt to your lifestyle. Experience the future of mobile technology with iPhone 16.
                    </p>
                </div>
            ),
        },
        {
            title: "Technical Specifications",
            content: (
                <div className="text-sm text-gray-700 grid grid-cols-2 gap-y-2 gap-x-4">
                    <div className="font-medium">Weight</div>
                    <div>171 g</div>

                    <div className="font-medium">Bluetooth Version</div>
                    <div>5.3</div>

                    <div className="font-medium">Depth</div>
                    <div>7.8 mm</div>

                    <div className="font-medium">Screen Size</div>
                    <div>6.1 inch (Super Retina XDR)</div>

                    <div className="font-medium">Panel Type</div>
                    <div>OLED</div>

                    <div className="font-medium">Battery Capacity</div>
                    <div>Li‑Ion, supports fast charging</div>

                    <div className="font-medium">RAM</div>
                    <div>6 GB</div>

                    <div className="font-medium">Rear Camera</div>
                    <div>48 MP Main + Ultra Wide</div>

                    <div className="font-medium">Warranty</div>
                    <div>2-Year Apple Warranty</div>

                    <div className="font-medium">USB Port</div>
                    <div>USB‑C</div>
                </div>
            ),
        },
        {
            title: "Promotions",
            content: (
                <div className="text-sm text-gray-700">
                    Details about current promotions will be available here.
                </div>
            ),
        },
        {
            title: "Shipping & Return Policy",
            content: (
                <div className="text-sm text-gray-700">
                    <p>Free shipping and 14-day returns available.</p>
                    <p>Please contact customer support for more details.</p>
                </div>
            ),
        },
        {
            title: "Payment Options",
            content: (
                <div className="text-sm text-gray-700">
                    <p>
                        Payment options include credit card, bank transfer, cash on delivery, and installment plans.
                    </p>
                    <p>
                        For more details, please proceed to the payment page.
                    </p>
                </div>
            ),
        },
        {
            title: "Product Reviews",
            content: (
                <div className="text-sm text-gray-700">
                    <p>{productData.reviewsCount} customer reviews available.</p>
                    <p>Average Rating: {productData.rating} / 5</p>
                </div>
            ),
        },
    ];

    // Toggle accordion
    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Example “other products” array
    const otherProducts = [
        { id: 1, img: otherProduct1, name: "iPhone 15" },
        { id: 2, img: otherProduct2, name: "iPhone 14" },
        { id: 3, img: otherProduct3, name: "iPhone 13" },
        { id: 4, img: otherProduct4, name: "iPhone 12" },
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
                        <img
                            src={iphone16Thumb1}
                            alt="Thumbnail 1"
                            className="w-16 h-16 border rounded cursor-pointer"
                        />
                        <img
                            src={iphone16Thumb2}
                            alt="Thumbnail 2"
                            className="w-16 h-16 border rounded cursor-pointer"
                        />
                        <img
                            src={iphone16Thumb3}
                            alt="Thumbnail 3"
                            className="w-16 h-16 border rounded cursor-pointer"
                        />
                    </div>

                    <img
                        className="w-full h-auto border border-gray-200 rounded"
                        src={iphone16Image}
                        alt={productData.title}
                    />
                </div>

                {/* Right Column: Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                    {/* Brand + Title */}
                    <div className="mb-2">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">
                            {productData.brand}
                        </p>
                        <h1 className="text-2xl font-semibold">{productData.title}</h1>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center mb-4">
                        <div className="text-yellow-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>
                  {i < Math.floor(productData.rating) ? "★" : "☆"}
                </span>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
              {productData.rating} / 5 ({productData.reviewsCount} reviews)
            </span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <p className="text-3xl font-bold text-black">${productData.price}</p>
                        <p className="text-sm text-green-600 font-semibold">
                            {productData.stockStatus}
                        </p>
                        <p className="text-sm text-gray-500">{productData.deliveryInfo}</p>
                    </div>

                    {/* Seller & Warranty Info */}
                    <div className="mb-4">
                        <p className="text-sm text-gray-700">
                            Seller: <span className="font-medium">{productData.seller}</span>
                        </p>
                        <p className="text-sm text-gray-700">
                            Warranty: <span className="font-medium">{productData.warranty}</span>
                        </p>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-2 mb-4">
                        <label htmlFor="quantity" className="font-medium">
                            Quantity:
                        </label>
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

                    {/* Installment Section */}
                    <div className="flex items-center space-x-2 mb-4">
                        <label htmlFor="installment" className="font-medium">
                            Installments:
                        </label>
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

                    {/* Total Price */}
                    <div className="text-lg font-bold mb-4">
                        Total: ${totalPrice.toFixed(2)}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        {/* Add to Cart with hover effect */}
                        <button
                            className="
                bg-gradient-to-b from-black to-purple-900
                text-white px-6 py-2 rounded transition
                cursor-pointer
                hover:scale-105 hover:brightness-110
              "
                        >
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
              <span className="font-medium text-gray-700">
                {section.title}
              </span>
                            <span className="text-gray-500">
                {openIndex === index ? "-" : "+"}
              </span>
                        </button>
                        {openIndex === index && (
                            <div className="px-4 pb-4">
                                {section.content}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Other Products */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">
                    Other Products Viewed
                </h2>
                <div className="flex space-x-4 overflow-x-auto pb-2">
                    {otherProducts.map((product) => (
                        <div
                            key={product.id}
                            className="min-w-[120px] flex flex-col items-center border border-gray-200 rounded p-2"
                        >
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