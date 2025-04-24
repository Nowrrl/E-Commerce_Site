import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function CategoryProducts() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8085/products/all`)
      .then((res) => {
        const filtered = res.data
          .filter((p) => p.approvedBySales)
          .filter( 
            (p) => p.category?.name.toLowerCase() === categoryName.toLowerCase()
        );
        setProducts(filtered);
      })
      .catch((err) => console.error("Failed to load products:", err));
  }, [categoryName]);

  return (
    <div className="p-6 min-h-screen bg-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Category: <span className="capitalize">{categoryName}</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition duration-200 p-4"
          >
            <img
              src={product.imageUrl || "/products_images/default_product_image.png"}
              alt={product.name}
              className="w-full h-48 object-contain mb-3 rounded"
            />
            <h3 className="text-md font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
