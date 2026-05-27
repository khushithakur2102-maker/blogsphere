import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Loader2, Calendar, User as UserIcon, MessageSquare, Edit, Trash2 } from 'lucide-react';
import CommentSection from '../components/CommentSection';

const PostView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/posts/${id}`);
        setPost(res.data.data);
      } catch (err) {
        toast.error('Post not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success('Post deleted');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  const isAuthor = user && user.id === post.author?._id;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <article className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 mb-12">
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full">
                {tag}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-between py-6 border-y border-slate-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                <UserIcon size={24} />
              </div>
              <div>
                <p className="font-bold text-slate-900">{post.author?.name}</p>
                <div className="flex items-center gap-2 text-slate-500 text-sm">
                  <Calendar size={14} />
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {isAuthor && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/posts/${id}/edit`)}
                  className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            )}
          </div>
        </header>

        <div 
          className="prose prose-slate prose-lg max-w-none text-slate-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      <CommentSection postId={id} />
    </div>
  );
};

export default PostView;
