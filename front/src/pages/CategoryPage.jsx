import React from 'react';
import { useParams, Link } from 'react-router-dom';

const CategoryPage = ({ productData }) => {
  const { category } = useParams();

  const filteredProducts = productData?.filter(
    product => product.category.toLowerCase() === category.toLowerCase()
  );

  if (!filteredProducts?.length) {
    return (
      <div className="p-8 text-center text-gray-600">
        <h2>No products found in "{category}"</h2>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 capitalize">{category}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="border p-4 rounded shadow hover:shadow-md"
          >
            <img
              src={product.image[0]}
              alt={product.name}
              className="w-full h-40 object-cover mb-2 rounded"
            />
            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-purple-600 font-semibold">${product.price}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
