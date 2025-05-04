import React, { useEffect, useState } from "react";
import axios from "axios";

const CommentApproval = () => {
  const [pendingComments, setPendingComments] = useState([]);
  const [approvedComments, setApprovedComments] = useState([]);
  const [showApproved, setShowApproved] = useState(false);

  const loadPending = () => {
    axios.get("http://localhost:8085/comments/pending")
      .then(res => setPendingComments(res.data))
      .catch(err => console.error("Failed to fetch pending comments:", err));
  };

  const loadApproved = () => {
    axios.get("http://localhost:8085/comments/approved")
      .then(res => setApprovedComments(res.data))
      .catch(err => console.error("Failed to fetch approved comments:", err));
  };

  const approveComment = (id) => {
    axios.put(`http://localhost:8085/comments/approve/${id}`)
      .then(() => {
        loadPending();
        loadApproved();
      })
      .catch(err => console.error("Failed to approve comment:", err));
  };

  const rejectComment = (id) => {
    axios.delete(`http://localhost:8085/comments/reject/${id}`)
      .then(() => loadPending())
      .catch(err => console.error("Failed to reject comment:", err));
  };

  const deleteComment = (id) => {
    axios.delete(`http://localhost:8085/comments/${id}`)
      .then(() => {
        loadPending();
        loadApproved();
      })
      .catch(err => console.error("Failed to delete comment:", err));
  };

  useEffect(() => {
    const waitForAuthAndLoad = async () => {
      const savedAuth = localStorage.getItem("adminAuth");
      if (savedAuth) {
        axios.defaults.headers.common["Authorization"] = savedAuth;
      }
  
      try {
        await Promise.all([loadPending(), loadApproved()]);
      } catch (err) {
        console.error("Failed to load comments after auth:", err);
      }
    };
  
    waitForAuthAndLoad();
  }, []);

  return (
    <div className="p-10 min-h-screen bg-gradient-to-b from-black to-purple-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">🗨️ Comment Moderation Panel</h1>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showApproved}
              onChange={() => setShowApproved(!showApproved)}
              className="w-4 h-4"
            />
            Show approved
          </label>
        </div>

        {!showApproved ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">⏳ Pending Comments</h2>
            {pendingComments.length === 0 ? (
              <p className="text-gray-300">No comments awaiting approval.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingComments.map((comment) => (
                  <div key={comment.id} className="bg-white text-black p-6 rounded-xl shadow-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-purple-700">{comment.user.username}</span>
                      <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mb-4 text-gray-800">{comment.text}</p>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => approveComment(comment.id)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                        Approve
                      </button>
                      <button onClick={() => rejectComment(comment.id)} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
                        Reject
                      </button>
                      <button onClick={() => deleteComment(comment.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">✅ Approved Comments</h2>
            {approvedComments.length === 0 ? (
              <p className="text-gray-300">No approved comments.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {approvedComments.map((comment) => (
                  <div key={comment.id} className="bg-green-50 border border-green-200 text-black p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-green-700">{comment.user.username}</span>
                      <span className="text-sm text-gray-600">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="mb-4 text-gray-800">{comment.text}</p>
                    <div className="flex justify-end">
                      <button onClick={() => deleteComment(comment.id)} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CommentApproval;
