'use client';

import { IDetailUserProfileDTO } from '@/types/profile';
import HeroTabPost from '../hero/HeroTabPost';
import { FeedPostCard, IFeedPost } from '../components/FeedPostCard';

interface ITabPost {
  data?: IDetailUserProfileDTO;
}

const MOCK_POSTS: IFeedPost[] = [
  {
    id: '1',
    author: {
      name: 'Cameron Williamson',
      username: 'cameron',
      avatarUrl: 'https://i.pravatar.cc/150?img=33',
    },
    content:
      'Just finished an amazing project! The creative process was incredibly rewarding. Check out these visuals I created using 3D design and motion graphics. What do you think? 🎨✨',
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
      'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&q=80',
    ],
    timestamp: '23 Aug at 4:21 PM',
    likes: 30,
    comments: 12,
    shares: 5,
    isLiked: false,
  },
  {
    id: '2',
    author: {
      name: 'Terry Lipshutz',
      username: 'terry',
      avatarUrl: 'https://i.pravatar.cc/150?img=47',
    },
    content:
      'Exploring new creative horizons with abstract art and digital design. The possibilities are endless when you combine imagination with technology! 🚀',
    images: ['https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=800&q=80'],
    timestamp: '22 Aug at 7:15 PM',
    likes: 45,
    comments: 18,
    shares: 8,
    isLiked: true,
  },
  {
    id: '3',
    author: {
      name: 'Randy Saris',
      username: 'randy',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
    },
    content:
      "Another day, another creative challenge! Here are some shots from today's photoshoot. The lighting and composition came out perfectly! 📸",
    images: [
      'https://images.unsplash.com/photo-1634193295627-1cdddf751ebf?w=800&q=80',
      'https://images.unsplash.com/photo-1618556450994-a83a8bd57fbe?w=800&q=80',
      'https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=800&q=80',
    ],
    timestamp: '21 Aug at 2:30 PM',
    likes: 67,
    comments: 24,
    shares: 12,
    isLiked: false,
  },
  {
    id: '4',
    author: {
      name: 'Angel Bergson',
      username: 'angel',
      avatarUrl: 'https://i.pravatar.cc/150?img=26',
    },
    content:
      'Working on some exciting new projects! Stay tuned for more updates. The creative journey never stops! 💜✨',
    images: [
      'https://images.unsplash.com/photo-1618005198920-f0cb6201c115?w=800&q=80',
      'https://images.unsplash.com/photo-1634170380000-c6a5c3d8c20c?w=800&q=80',
    ],
    timestamp: '20 Aug at 9:45 AM',
    likes: 89,
    comments: 31,
    shares: 15,
    isLiked: true,
  },
];

const TabPost = ({ data }: ITabPost) => {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      <div className="flex flex-col gap-4 flex-1 w-full lg:w-auto min-w-0">
        <HeroTabPost data={data} />
        <div className="flex flex-col gap-5">
          {MOCK_POSTS.map(post => (
            <FeedPostCard key={post.id} post={post} />
          ))}
        </div>
        <div className="flex justify-center py-4">
          <button className="group relative overflow-hidden rounded-xl bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 px-8 py-3 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:from-purple-500/20 hover:to-pink-500/20 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
            <span className="relative z-10">Tải thêm bài viết</span>
            <div className="absolute inset-0 z-0 bg-linear-to-r from-purple-500/0 via-purple-500/5 to-pink-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TabPost;
