import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, Send, Trash2 } from 'lucide-react';

const CommentSection = ({ postId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      setComments(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Login to comment');
      return;
    }
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await api.post(`/posts/${postId}/comments`, { text });
      setText('');
      fetchComments();
      toast.success('Comment added');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments(comments.filter(c => c._id !== id));
      toast.success('Comment removed');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100">
      <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
        Comments <span className="text-slate-400 font-normal">({comments.length})</span>
      </h3>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={user ? "Share your thoughts..." : "Please login to comment"}
            disabled={!user || submitting}
            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px] transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!user || submitting || !text.trim()}
            className="absolute bottom-4 right-4 bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {submitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </form>

      <div className="space-y-8">
        {loading ? (
          <div className="flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>
        ) : comments.length === 0 ? (
          <p className="text-center text-slate-400 py-8">No comments yet. Be the first to start the conversation!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-400">
                {comment.author?.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-bold text-slate-900">{comment.author?.name}</p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    {user && user.id === comment.author?._id && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-slate-600 leading-relaxed">{comment.text}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default CommentSection;
