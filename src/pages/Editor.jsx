import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-hot-toast';
import { Loader2, Save, X, Plus, Hash } from 'lucide-react';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    tags: [],
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      const fetchPost = async () => {
        try {
          const res = await api.get(`/posts/${id}`);
          const { title, content, tags } = res.data.data;
          setFormData({ title, content, tags });
        } catch (err) {
          toast.error('Failed to load post');
          navigate('/');
        } finally {
          setFetching(false);
        }
      };
      fetchPost();
    }
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/posts/${id}`, formData);
        toast.success('Post updated!');
      } else {
        await api.post('/posts', formData);
        toast.success('Post published!');
      }
      navigate('/');
    } catch (err) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const addTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput] });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <header className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {isEdit ? 'Edit Story' : 'New Story'}
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {isEdit ? 'Update' : 'Publish'}
            </button>
          </div>
        </header>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Title"
            className="w-full text-4xl md:text-5xl font-extrabold text-slate-900 border-none focus:ring-0 placeholder:text-slate-200"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 mb-4">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium"
                >
                  <Hash size={12} />
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-primary-800">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tags..."
                className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <textarea
            placeholder="Tell your story..."
            className="w-full min-h-[400px] text-lg text-slate-700 border-none focus:ring-0 placeholder:text-slate-200 resize-none"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
        </div>
      </form>
    </div>
  );
};

export default Editor;
