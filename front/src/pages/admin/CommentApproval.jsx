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
    loadPending();
    loadApproved();
  }, []);

  return (
    <div className="p-8 bg-white max-w-4xl mx-auto rounded-xl shadow-lg mt-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">🛠️ Comment Management</h1>

      <div className="mb-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showApproved}
            onChange={() => setShowApproved(!showApproved)}
          />
          <span className="text-sm text-gray-700">Show approved comments</span>
        </label>
      </div>

      {!showApproved ? (
        <>
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Pending Comments</h2>
          {pendingComments.length === 0 ? (
            <p className="text-gray-500">No comments waiting for approval.</p>
          ) : (
            <div className="space-y-4">
              {pendingComments.map((comment) => (
                <div key={comment.id} className="border border-gray-300 p-4 rounded-lg bg-gray-50 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-purple-700">{comment.user.username}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800 mb-2">{comment.text}</p>
                  <div className="flex gap-3 justify-end">
                    <button onClick={() => approveComment(comment.id)} className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                      Approve
                    </button>
                    <button onClick={() => rejectComment(comment.id)} className="px-4 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                      Reject
                    </button>
                    <button onClick={() => deleteComment(comment.id)} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700">
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
          <h2 className="text-xl font-semibold text-green-800 mb-4">Approved Comments</h2>
          {approvedComments.length === 0 ? (
            <p className="text-gray-500">No approved comments available.</p>
          ) : (
            <div className="space-y-4">
              {approvedComments.map((comment) => (
                <div key={comment.id} className="border border-green-300 p-4 rounded-lg bg-green-50 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-700">{comment.user.username}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800 mb-2">{comment.text}</p>
                  <div className="flex justify-end">
                    <button onClick={() => deleteComment(comment.id)} className="px-4 py-1 bg-red-600 text-white rounded hover:bg-red-700">
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
  );
};

export default CommentApproval;
