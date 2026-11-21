/**
 * Luma Central Store - LocalStorage State Management
 * Keeps Feed and Profile in perfect synchronization without dummy broken data.
 */

const STORAGE_KEYS = {
  PROFILE: 'luma_user_profile',
  POSTS: 'luma_posts_data',
  STORIES: 'luma_stories_data',
  EXPLORE: 'luma_explore_data',
  THEME: 'luma_theme_preference'
};

// Fallback SVG placeholder image generator in case of network disconnect
const getPlaceholderImage = (text = 'Luma', bg = '#262626', fg = '#FAFAFA') => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <rect width="800" height="800" fill="${bg}"/>
    <circle cx="400" cy="400" r="160" fill="none" stroke="${fg}" stroke-width="4" stroke-dasharray="10 10" opacity="0.3"/>
    <text x="50%" y="48%" font-family="sans-serif" font-size="32" font-weight="600" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    <text x="50%" y="54%" font-family="sans-serif" font-size="16" fill="${fg}" opacity="0.6" text-anchor="middle" dominant-baseline="middle">Luma Visual Platform</text>
  </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
};

const DEFAULT_PROFILE = {
  username: 'maya.lin',
  name: 'Maya Lin',
  headline: 'Visual Director · San Francisco',
  bio: 'Exploring quiet spaces, architectural light, and 35mm film textures.',
  website: 'mayalin.studio',
  location: 'San Francisco, CA',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  followers: '12.8k',
  following: '384'
};

const DEFAULT_STORIES = [
  {
    id: 'story-you',
    user: 'Your story',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=900&auto=format&fit=crop&q=80',
    seen: false,
    isSelf: true
  },
  {
    id: 'story-elena',
    user: 'elena.rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&auto=format&fit=crop&q=80',
    seen: false
  },
  {
    id: 'story-marcus',
    user: 'marcus.chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80',
    seen: false
  },
  {
    id: 'story-sofia',
    user: 'sofia.valdez',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&auto=format&fit=crop&q=80',
    seen: false
  },
  {
    id: 'story-kai',
    user: 'kai.takahashi',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80',
    seen: true
  },
  {
    id: 'story-claire',
    user: 'claire.dubois',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&auto=format&fit=crop&q=80',
    seen: false
  }
];

const DEFAULT_POSTS = [
  {
    id: 'post-1',
    user: 'maya.lin',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Zurich, Switzerland',
    time: '2h ago',
    aspect: 'aspect-square',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80'],
    currentSlide: 0,
    filter: 'none',
    isVideo: false,
    likes: 1240,
    liked: false,
    saved: false,
    type: 'carousel',
    caption: 'Midday winter sun across raw board-formed concrete and warm oak. Shadows do half the architectural work.',
    comments: [
      { id: 'c1', user: 'marcus.chen', text: 'The diagonal light cut is perfection.', time: '1h ago' },
      { id: 'c2', user: 'elena.rostova', text: 'Raw minimalism at its best.', time: '45m ago' }
    ]
  },
  {
    id: 'post-2',
    user: 'elena.rostova',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Arashiyama, Kyoto',
    time: '4h ago',
    aspect: 'aspect-[4/5]',
    images: [
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80'
    ],
    currentSlide: 0,
    filter: 'none',
    isVideo: false,
    likes: 1428,
    liked: false,
    saved: false,
    type: 'carousel',
    caption: 'First light through the Arashiyama bamboo grove before the city wakes up, followed by a quiet bowl of matcha.',
    comments: [
      { id: 'c3', user: 'maya.lin', text: 'Some mornings feel like stepping outside of time.', time: '3h ago' },
      { id: 'c4', user: 'sofia.valdez', text: 'Need to visit Kyoto this autumn!', time: '2h ago' }
    ]
  },
  {
    id: 'post-3',
    user: 'maya.lin',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Mission District, SF',
    time: '1d ago',
    aspect: 'aspect-square',
    images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&auto=format&fit=crop&q=80'],
    currentSlide: 0,
    filter: 'none',
    isVideo: false,
    likes: 965,
    liked: true,
    saved: true,
    type: 'photo',
    caption: 'Morning pour-over ritual on raw travertine stone. Natural textures that anchor the start of the day.',
    comments: [
      { id: 'c5', user: 'kai.takahashi', text: 'Love that ceramic dripper shape.', time: '18h ago' }
    ]
  },
  {
    id: 'post-4',
    user: 'sofia.valdez',
    name: 'Sofia Valdez',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=80',
    verified: false,
    location: 'Oaxaca Studio, Mexico',
    time: '2d ago',
    aspect: 'aspect-[4/5]',
    images: ['https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=1000&auto=format&fit=crop&q=80'],
    currentSlide: 0,
    filter: 'none',
    isVideo: false,
    likes: 2310,
    liked: false,
    saved: false,
    type: 'photo',
    caption: 'Fresh out of the reduction kiln — matte speckled stoneware vessels resting on raw linen before the open house.',
    comments: [
      { id: 'c6', user: 'maya.lin', text: 'The glaze texture on the tall vessel is sublime.', time: '1d ago' }
    ]
  },
  {
    id: 'post-5',
    user: 'maya.lin',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Amalfi Coast, Italy',
    time: '3d ago',
    aspect: 'aspect-square',
    images: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1000&auto=format&fit=crop&q=80'],
    currentSlide: 0,
    filter: 'none',
    isVideo: true,
    muted: true,
    likes: 4120,
    liked: false,
    saved: true,
    type: 'reel',
    caption: 'Turquoise swells along sunlit limestone cliffs. 35mm film memories.',
    comments: [
      { id: 'c7', user: 'claire.dubois', text: 'Magical light on the water!', time: '2d ago' }
    ]
  },
  {
    id: 'post-6',
    user: 'maya.lin',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    verified: true,
    location: 'Tokyo, Japan',
    time: '5d ago',
    aspect: 'aspect-square',
    images: ['https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80'],
    currentSlide: 0,
    filter: 'none',
    isVideo: true,
    muted: true,
    likes: 3210,
    liked: false,
    saved: false,
    type: 'reel',
    caption: 'Midnight reflections after summer rain in Shimokitazawa.',
    comments: []
  }
];

const DEFAULT_EXPLORE = [
  {
    id: 'ex-1',
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80',
    cat: 'travel',
    likes: 1428,
    comments: 42,
    tall: true,
    caption: 'Bamboo silence in Kyoto morning light.',
    location: 'Kyoto, Japan',
    user: 'elena.rostova'
  },
  {
    id: 'ex-2',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
    cat: 'architecture',
    likes: 894,
    comments: 19,
    tall: false,
    caption: 'Brutalist concrete geometry and winter light.',
    location: 'Zurich, Switzerland',
    user: 'marcus.chen'
  },
  {
    id: 'ex-3',
    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&auto=format&fit=crop&q=80',
    cat: 'travel',
    likes: 3210,
    comments: 88,
    tall: false,
    caption: 'Tokyo night street illumination.',
    location: 'Tokyo, Japan',
    user: 'kai.takahashi'
  },
  {
    id: 'ex-4',
    img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    cat: 'craft',
    likes: 2310,
    comments: 64,
    tall: true,
    caption: 'Raw linen and reduction-fired ceramic vessels.',
    location: 'Oaxaca, Mexico',
    user: 'sofia.valdez'
  },
  {
    id: 'ex-5',
    img: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80',
    cat: 'travel',
    likes: 4120,
    comments: 112,
    tall: false,
    caption: 'Limestone cliffs over Mediterranean blue.',
    location: 'Amalfi Coast, Italy',
    user: 'maya.lin'
  },
  {
    id: 'ex-6',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80',
    cat: 'craft',
    likes: 965,
    comments: 27,
    tall: false,
    caption: 'Craft coffee and slow morning daylight.',
    location: 'San Francisco, CA',
    user: 'maya.lin'
  },
  {
    id: 'ex-7',
    img: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80',
    cat: 'architecture',
    likes: 1840,
    comments: 35,
    tall: false,
    caption: 'Geometric staircase interior study.',
    location: 'Basel, Switzerland',
    user: 'marcus.chen'
  }
];

class LumaStoreClass {
  constructor() {
    this.listeners = [];
    this.init();
    window.addEventListener('storage', (e) => {
      this.notify(e.key);
    });
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    }
    if (!localStorage.getItem(STORAGE_KEYS.POSTS)) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_POSTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STORIES)) {
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(DEFAULT_STORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EXPLORE)) {
      localStorage.setItem(STORAGE_KEYS.EXPLORE, JSON.stringify(DEFAULT_EXPLORE));
    }
  }

  subscribe(fn) {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  notify(event) {
    this.listeners.forEach(fn => {
      try { fn(event); } catch (e) { console.error(e); }
    });
  }

  // Profile methods
  getProfile() {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return p ? JSON.parse(p) : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  setProfile(updates) {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));

    // Update avatar and name on posts belonging to the user
    const posts = this.getPosts();
    let changed = false;
    posts.forEach(p => {
      if (p.user === updated.username) {
        if (updates.name) p.name = updates.name;
        if (updates.avatar) p.avatar = updates.avatar;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    }

    this.notify('profile');
    return updated;
  }

  // Posts methods
  getPosts() {
    try {
      const p = localStorage.getItem(STORAGE_KEYS.POSTS);
      return p ? JSON.parse(p) : DEFAULT_POSTS;
    } catch {
      return DEFAULT_POSTS;
    }
  }

  savePosts(posts) {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    this.notify('posts');
  }

  addPost(data) {
    const profile = this.getProfile();
    const posts = this.getPosts();

    const newPost = {
      id: 'post-' + Date.now(),
      user: profile.username,
      name: profile.name,
      avatar: profile.avatar,
      verified: true,
      location: data.location || profile.location || 'San Francisco, CA',
      time: 'Just now',
      aspect: data.aspect || 'aspect-square',
      images: [data.image],
      currentSlide: 0,
      filter: data.filter || 'none',
      isVideo: Boolean(data.isVideo),
      muted: true,
      likes: 1,
      liked: true,
      saved: false,
      type: data.isVideo ? 'reel' : 'photo',
      caption: data.caption || '',
      comments: []
    };

    posts.unshift(newPost);
    this.savePosts(posts);
    return newPost;
  }

  toggleLike(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    post.liked = !post.liked;
    post.likes = Math.max(0, post.likes + (post.liked ? 1 : -1));
    this.savePosts(posts);
    return post;
  }

  toggleSave(postId) {
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    post.saved = !post.saved;
    this.savePosts(posts);
    return post;
  }

  addComment(postId, text, user = null) {
    if (!text || !text.trim()) return null;
    const posts = this.getPosts();
    const post = posts.find(p => p.id === postId);
    if (!post) return null;

    const profile = this.getProfile();
    const commentUser = user || profile.username;

    if (!Array.isArray(post.comments)) {
      post.comments = [];
    }

    const newComment = {
      id: 'c-' + Date.now(),
      user: commentUser,
      text: text.trim(),
      time: 'Just now'
    };

    post.comments.push(newComment);
    this.savePosts(posts);
    return newComment;
  }

  deletePost(postId) {
    let posts = this.getPosts();
    posts = posts.filter(p => p.id !== postId);
    this.savePosts(posts);
  }

  // Stories
  getStories() {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.STORIES);
      return s ? JSON.parse(s) : DEFAULT_STORIES;
    } catch {
      return DEFAULT_STORIES;
    }
  }

  markStorySeen(storyId) {
    const stories = this.getStories();
    const st = stories.find(s => s.id === storyId);
    if (st) {
      st.seen = true;
      localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(stories));
      this.notify('stories');
    }
  }

  // Explore
  getExplore(category = 'all') {
    try {
      const ex = localStorage.getItem(STORAGE_KEYS.EXPLORE);
      const items = ex ? JSON.parse(ex) : DEFAULT_EXPLORE;
      if (category === 'all') return items;
      return items.filter(item => item.cat === category);
    } catch {
      return DEFAULT_EXPLORE;
    }
  }

  // Theme
  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  }

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    this.notify('theme');
  }

  // Reset / Clear Helpers
  resetToDemo() {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(DEFAULT_POSTS));
    localStorage.setItem(STORAGE_KEYS.STORIES, JSON.stringify(DEFAULT_STORIES));
    localStorage.setItem(STORAGE_KEYS.EXPLORE, JSON.stringify(DEFAULT_EXPLORE));
    this.notify('reset');
  }

  clearAllPosts() {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify([]));
    this.notify('posts');
  }
}

// Global instance
window.LumaStore = new LumaStoreClass();
window.getPlaceholderImage = getPlaceholderImage;
