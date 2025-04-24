import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { clearCart, removeFromCart } from "../redux/cartSlice";
import { removeFromBackendCart, clearBackendCart } from "../api/api";

function ShoppingCart() {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const hasOutOfStockItem = cartItems.some(
    (item) => item.product.quantity === 0
  );

  const handleRemove = async (productId) => {
    dispatch(removeFromCart(productId));
    if (currentUser?.id) {
      try {
        await removeFromBackendCart(currentUser.id, productId);
      } catch (error) {
        console.error("Failed to remove item from backend:", error);
      }
    }
  };

  const handleClearCart = async () => {
    if (currentUser?.id) {
      try {
        await clearBackendCart(currentUser.id); // clear backend
      } catch (err) {
        console.error("Failed to clear cart on backend:", err);
      }
    }
    dispatch(clearCart()); // clear frontend regardless
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      <div className="bg-white text-black p-6 rounded-xl shadow-xl max-w-2xl mx-auto">
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-lg">Your cart is currently empty.</p>
            <p className="text-sm text-gray-500 mt-1">
              Browse products and add them to your cart.
            </p>
          </div>
        ) : (
          <>
            {cartItems.map((item, index) => {
              const outOfStock = item.product.quantity === 0;
              const lowStock = item.product.quantity === 1;

              return (
                <div
                  key={index}
                  className="border-b py-3 flex justify-between items-center relative"
                >
                  {outOfStock && (
                    <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full border border-red-300">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.598c.75 1.335-.213 3.003-1.743 3.003H3.482c-1.53 0-2.493-1.668-1.743-3.003L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-.25-4a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Out of Stock
                    </span>
                  )}

                  {lowStock && !outOfStock && (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full border border-yellow-300">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.598c.75 1.335-.213 3.003-1.743 3.003H3.482c-1.53 0-2.493-1.668-1.743-3.003L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-.25-4a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Only 1 Left
                    </span>
                  )}


                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs text-gray-500">
                      Stock Available: {item.product.quantity}
                    </p>
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="text-red-500 text-sm hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="font-semibold">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}

            <div className="mt-4 text-right font-bold text-lg">
              Total: ${totalPrice.toFixed(2)}
            </div>

            <div className="flex justify-between mt-6 items-center flex-col sm:flex-row gap-4 sm:gap-0">
              <button
                onClick={handleClearCart}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
              >
                Clear Cart
              </button>

              <Link to={hasOutOfStockItem ? "#" : "/checkout"}>
                <button
                  disabled={hasOutOfStockItem}
                  className="bg-yellow-400 text-black font-semibold px-6 py-2 rounded shadow hover:brightness-105 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>

            {hasOutOfStockItem && (
              <p className="text-sm text-red-500 mt-3 text-center sm:text-right">
                One or more items in your cart are out of stock. Remove them to proceed.
              </p>
            )}
          </>
        )}
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition cursor-pointer hover:underline"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export default ShoppingCart;
