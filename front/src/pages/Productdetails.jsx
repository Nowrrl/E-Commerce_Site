import React, { useState } from "react";
import { useSelector } from "react-redux";
import iphone16Image from "../img/iphone16image.webp";

const ProductDetails = () => {
    const { currentUser } = useSelector((state) => state.user) || { currentUser: {} };
const username = currentUser?.username || "Anonymous";

    // const { currentUser } = useSelector((state) => state.user);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, text: "" });

    const handleCommentSubmit = () => {
        if (newComment.trim() !== "") {
            setComments([...comments, { username: currentUser.username, text: newComment }]);
            setNewComment("");
        }
    };

    const handleReviewSubmit = () => {
        if (newReview.text.trim() !== "") {
            setReviews([...reviews, newReview]);
            setNewReview({ rating: 5, text: "" });
        }
    };

    return (
        <div className="border-t-1 border-white max-w-screen-xl mx-auto p-4">
            <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg">
                <div className="flex-shrink-0 w-full md:w-96">
                    <img className="w-full h-auto border border-gray-200 rounded" src={iphone16Image} alt="iPhone 16" />
                </div>
            </div>
            
            {/* Review Section */}
            <div className="mt-8 border-t border-gray-300 pt-4">
                <h2 className="text-lg font-semibold mb-4">Customer Reviews</h2>
                <div className="mb-4">
                    <select
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                        className="border p-2 rounded"
                    >
                        {[5, 4, 3, 2, 1].map((star) => (
                            <option key={star} value={star}>{star} Stars</option>
                        ))}
                    </select>
                    <textarea
                        className="w-full border p-2 rounded mt-2"
                        placeholder="Write your review here..."
                        value={newReview.text}
                        onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    />
                    <button
                        onClick={handleReviewSubmit}
                        className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Submit Review
                    </button>
                </div>
                <div>
                    {reviews.length > 0 ? (
                        reviews.map((review, index) => (
                            <div key={index} className="p-2 border-b border-gray-200">
                                <p className="font-semibold">{review.rating} Stars</p>
                                <p>{review.text}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                    )}
                </div>
            </div>

            {/* Comment Section */}
            <div className="mt-8 border-t border-gray-300 pt-4">
                <h2 className="text-lg font-semibold mb-4">Customer Comments</h2>
                <div className="mb-4">
                    <textarea
                        className="w-full border p-2 rounded"
                        placeholder="Write your comment here..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        onClick={handleCommentSubmit}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Submit Comment
                    </button>
                </div>
                <div>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <div key={index} className="p-2 border-b border-gray-200">
                                <p className="font-semibold">{comment.username}:</p>
                                <p>{comment.text}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
