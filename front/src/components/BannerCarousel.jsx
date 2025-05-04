import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";


const banners = [
  {
    id: 1,
    title: "Be ready for shopping with Smart!",
    subtitle: "New Products",
    price: "$766.66",
    img: "/products_images/iphone15pro_1.jpg",
    productId: 1,
  },
  {
    id: 2,
    title: "Be ready for shopping with Smart!",
    subtitle: "New Products",
    price: "$466.66",
    img: "/products_images/samsung_2.jpg",
    productId: 2,
  },
  {
    id: 3,
    title: "Be ready for shopping with Smart!",
    subtitle: "New Products",
    price: "$1066.66",
    img: "/products_images/macbook16_4.jpeg",
    productId: 4,
  },
];

const BannerCarousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
    appendDots: dots => (
      <div>
        <ul className="flex justify-center mt-6 space-x-4">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className="w-4 h-4 bg-gray-300 rounded-full transition-all duration-300"></div>
    ),
  };

  const navigate = useNavigate();

  const handleClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div
            key={banner.id}
            onClick={() => handleClick(banner.productId)}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-white via-gray-50 to-gray-100 p-10 rounded-2xl shadow-xl transition-transform transform hover:scale-[1.01] duration-700 animate-fadeIn"
          >
            <div className="text-center mb-6">
              <h2 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">{banner.title}</h2>
              <p className="text-xl text-gray-500 mt-3 font-medium">{banner.subtitle}</p>
              <div className="text-5xl font-extrabold text-blue-600 mt-5 -tracking-wide">
                {banner.price} <span className="text-lg text-gray-400 font-normal">monthly</span>
              </div>
            </div>

            <div className="w-full flex justify-center mt-4">
              <div className="relative w-[500px] h-[450px] overflow-hidden flex items-center justify-center group">
                <img
                  src={banner.img}
                  alt={banner.subtitle}
                  className="object-contain w-full h-full p-4 transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Moving Shine */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="w-1/3 h-full bg-gradient-to-r from-white/40 via-white/10 to-white/40 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                </div>
              </div>
            </div>

          </div>
        ))}
      </Slider>

      {/* Extra styling for active dot */}
      <style>
        {`
          .slick-dots li.slick-active div {
            background-color: #3b82f6; /* Tailwind blue-500 */
            transform: scale(1.4);
          }
          .slick-dots li div {
            transition: all 0.4s ease;
          }
        `}
      </style>
    </div>
  );
};

export default BannerCarousel;
