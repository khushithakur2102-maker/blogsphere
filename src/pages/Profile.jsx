import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import { Loader2, Settings, User as UserIcon } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const res = await api.get('/posts/me');
        setPosts(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <header className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 mb-12 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <UserIcon size={48} />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{user?.name}</h1>
          <p className="text-slate-500 mb-4">{user?.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <span className="text-sm font-medium text-slate-700 bg-slate-50 px-4 py-2 rounded-xl">
              <span className="font-bold text-slate-900">{posts.length}</span> Stories
            </span>
          </div>
        </div>
        <button className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
          <Settings size={24} />
        </button>
      </header>

      <section>
        <h2 className="text-2xl font-bold text-slate-900 mb-8 px-4">Your Stories</h2>
        <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
          {posts.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-slate-400">You haven't written any stories yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
