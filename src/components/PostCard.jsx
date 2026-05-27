import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User as UserIcon, Tag } from 'lucide-react';

const PostCard = ({ post }) => {
  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-primary-200 hover:shadow-xl hover:shadow-primary-50 transition-all duration-300">
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-50 rounded-full flex items-center gap-1"
            >
              <Tag size={12} />
              {tag}
            </span>
          ))}
        </div>
        
        <Link to={`/posts/${post._id}`}>
          <h2 className="text-2xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors mb-3">
            {post.title}
          </h2>
        </Link>
        
        <p className="text-slate-600 line-clamp-3 mb-6 leading-relaxed">
          {post.content.replace(/<[^>]*>/g, '')}
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <UserIcon size={16} />
            </div>
            <span className="text-sm font-medium text-slate-700">{post.author?.name}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400 text-sm">
            <Calendar size={14} />
            <span>{date}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
