import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/posts?page=${page}`);
        setPosts(res.data.data);
        setTotalPages(res.data.pagination.pages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page]);

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
          Discover stories, thinking, and expertise from writers on any topic.
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl">
          Join our community of over 5 million readers and writers.
        </p>
      </header>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-full border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-sm font-medium text-slate-600">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-full border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
