/**
 * Luma Feed - Home Feed, Stories, Explore Grid & Interactive Feed Posts
 */

const quickEmojis = ['🔥', '❤️', '🙌', '✨', '👏', '😍'];

// --- Stories Carousel ---
window.renderStories = function() {
  const container = document.getElementById('stories-carousel');
  if (!container) return;

  const stories = window.LumaStore.getStories();
  const currentProfile = window.LumaStore.getProfile();

  container.innerHTML = stories.map(s => {
    const isSelf = s.isSelf;
    const avatar = isSelf ? currentProfile.avatar : s.avatar;
    const displayName = isSelf ? 'Your story' : s.user;

    const ringClass = isSelf
      ? 'p-[2px] border-2 border-dashed border-light-outline-variant dark:border-dark-outline-variant'
      : s.seen
        ? 'p-[2px] bg-light-outline dark:bg-dark-outline'
        : 'p-[2.5px] bg-gradient-to-tr from-accent-orange via-accent-magenta to-accent-violet';

    return `
      <button
        type="button"
        onclick="openStoryViewer('${s.id}')"
        class="flex flex-col items-center gap-gutter-xs shrink-0 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-light-secondary dark:focus-visible:ring-dark-secondary rounded-full"
      >
        <div class="${ringClass} rounded-full transition-transform duration-state-change group-hover:scale-105">
          <div class="p-0.5 rounded-full bg-light-surface dark:bg-dark-surface">
            <img
              src="${avatar}"
              alt="${displayName}"
              onerror="handleImageError(this, '${displayName}')"
              class="w-14 h-14 rounded-full object-cover"
            >
          </div>
        </div>
        <span class="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface max-w-[70px] truncate">
          ${displayName}
        </span>
      </button>
    `;
  }).join('');
};

// --- Feed Posts Rendering ---
window.renderFeed = function(searchQuery = '') {
  const container = document.getElementById('feed-posts');
  if (!container) return;

  let posts = window.LumaStore.getPosts();

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    posts = posts.filter(p =>
      p.user.toLowerCase().includes(q) ||
      (p.caption && p.caption.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q))
    );
  }

  if (posts.length === 0) {
    container.innerHTML = `
      <div class="py-16 text-center flex flex-col items-center gap-gutter-md border border-light-outline-variant dark:border-dark-outline-variant rounded-lg p-gutter-xl bg-light-surface dark:bg-dark-surface-container-low">
        <div class="w-16 h-16 rounded-full bg-light-surface-container dark:bg-dark-surface-container flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant">
          <span class="material-symbols-outlined text-headline-lg">photo_camera</span>
        </div>
        <h3 class="font-headline text-headline-md text-light-on-surface dark:text-dark-on-surface">No posts found</h3>
        <p class="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant max-w-sm">
          ${searchQuery ? 'Try a different search keyword.' : 'Your feed is empty. Start by sharing your first visual story!'}
        </p>
        <button
          type="button"
          onclick="openCreateModal()"
          class="inline-flex items-center gap-2 px-gutter-md py-gutter-sm rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md"
        >
          <span class="material-symbols-outlined text-title-md">add_box</span>
          Create New Post
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = posts.map(post => {
    const activeImage = post.images[post.currentSlide || 0] || post.images[0];
    const isOwner = post.user === 'maya.lin';
    const profileHref = window.getProfileUrl ? window.getProfileUrl() : 'profile.html';

    return `
      <article
        id="${post.id}"
        class="border border-light-outline-variant dark:border-dark-outline-variant rounded-md bg-light-surface dark:bg-dark-surface overflow-hidden shadow-sm transition-shadow hover:shadow-md"
      >
        <!-- Post Header -->
        <header class="flex items-center justify-between px-gutter-md py-gutter-sm">
          <div class="flex items-center gap-gutter-sm">
            <a href="${profileHref}" class="p-[1.5px] rounded-full bg-gradient-to-tr from-accent-orange via-accent-magenta to-accent-violet">
              <div class="p-0.5 rounded-full bg-light-surface dark:bg-dark-surface">
                <img
                  src="${post.avatar}"
                  alt="${post.user}"
                  onerror="handleImageError(this, '${post.user}')"
                  class="w-8 h-8 rounded-full object-cover"
                >
              </div>
            </a>
            <div>
              <div class="flex items-center gap-1">
                <a href="${profileHref}" class="font-label text-label-md text-light-on-surface dark:text-dark-on-surface hover:underline">
                  ${post.user}
                </a>
                ${post.verified ? '<span class="material-symbols-outlined text-title-md text-verified-blue icon-filled" title="Verified">verified</span>' : ''}
              </div>
              ${post.location ? `<p class="font-body text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">${post.location}</p>` : ''}
            </div>
          </div>

          <div class="flex items-center gap-gutter-xs text-light-on-surface-variant dark:text-dark-on-surface-variant">
            <span class="font-body text-label-sm">${post.time}</span>
            <button type="button" onclick="showToast('Post options for @${post.user}')" aria-label="More options" class="p-1 rounded-full hover:bg-light-surface-container dark:hover:bg-dark-surface-container">
              <span class="material-symbols-outlined text-title-md">more_horiz</span>
            </button>
          </div>
        </header>

        <!-- Media Stage with double tap heart -->
        <div
          class="relative ${post.aspect || 'aspect-square'} w-full bg-light-surface-container dark:bg-dark-surface-container select-none overflow-hidden"
          ondblclick="doubleTapLike('${post.id}')"
        >
          <img
            src="${activeImage}"
            alt="${post.caption || 'Luma photo'}"
            onerror="handleImageError(this, 'Luma photo')"
            style="filter: ${post.filter || 'none'};"
            class="w-full h-full object-cover pointer-events-none"
          >

          <!-- Double-tap burst heart -->
          <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span id="burst-${post.id}" class="material-symbols-outlined text-6xl text-like-red opacity-0 scale-50 transition-none icon-filled drop-shadow-lg">
              favorite
            </span>
          </div>

          <!-- Carousel Controls if multiple images -->
          ${post.images.length > 1 ? `
            <button
              type="button"
              onclick="slidePost('${post.id}', -1)"
              aria-label="Previous slide"
              class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-light-scrim/60 text-light-on-primary flex items-center justify-center backdrop-blur hover:bg-light-scrim/80 transition-colors"
            >
              <span class="material-symbols-outlined text-title-md">chevron_left</span>
            </button>
            <button
              type="button"
              onclick="slidePost('${post.id}', 1)"
              aria-label="Next slide"
              class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-light-scrim/60 text-light-on-primary flex items-center justify-center backdrop-blur hover:bg-light-scrim/80 transition-colors"
            >
              <span class="material-symbols-outlined text-title-md">chevron_right</span>
            </button>
            <div class="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 pointer-events-none">
              ${post.images.map((_, idx) => `
                <span class="w-1.5 h-1.5 rounded-full ${idx === (post.currentSlide || 0) ? 'bg-light-primary dark:bg-dark-primary w-4' : 'bg-light-on-primary/60'} transition-all"></span>
              `).join('')}
            </div>
          ` : ''}

          <!-- Video / Audio badge if video -->
          ${post.isVideo ? `
            <button
              type="button"
              onclick="toggleAudio('${post.id}')"
              class="absolute bottom-3 right-3 p-1.5 rounded-full bg-dark-scrim/65 text-light-on-primary backdrop-blur"
              aria-label="Toggle audio"
            >
              <span class="material-symbols-outlined text-title-md">${post.muted ? 'volume_off' : 'volume_up'}</span>
            </button>
          ` : ''}
        </div>

        <!-- Post Action Bar -->
        <div class="p-gutter-md flex flex-col gap-gutter-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-gutter-md">
              <button
                type="button"
                onclick="toggleLike('${post.id}')"
                aria-label="Like post"
                class="hover:scale-110 active:scale-95 transition-transform"
              >
                <span class="material-symbols-outlined text-headline-md ${post.liked ? 'text-like-red icon-filled' : 'text-light-on-surface dark:text-dark-on-surface'}">
                  favorite
                </span>
              </button>
              <button
                type="button"
                onclick="focusCommentInput('${post.id}')"
                aria-label="Comment"
                class="hover:scale-110 active:scale-95 transition-transform text-light-on-surface dark:text-dark-on-surface"
              >
                <span class="material-symbols-outlined text-headline-md">chat_bubble</span>
              </button>
              <button
                type="button"
                onclick="sharePost('${post.id}')"
                aria-label="Share"
                class="hover:scale-110 active:scale-95 transition-transform text-light-on-surface dark:text-dark-on-surface"
              >
                <span class="material-symbols-outlined text-headline-md">send</span>
              </button>
            </div>

            <button
              type="button"
              onclick="toggleSave('${post.id}')"
              aria-label="Save post"
              class="hover:scale-110 active:scale-95 transition-transform"
            >
              <span class="material-symbols-outlined text-headline-md ${post.saved ? 'icon-filled text-light-on-surface dark:text-dark-on-surface' : 'text-light-on-surface dark:text-dark-on-surface'}">
                bookmark
              </span>
            </button>
          </div>

          <!-- Likes Count -->
          <p class="font-label text-label-md text-light-on-surface dark:text-dark-on-surface tabular-nums font-semibold">
            ${Number(post.likes).toLocaleString()} likes
          </p>

          <!-- Caption -->
          <div class="font-body text-body-md text-light-on-surface dark:text-dark-on-surface">
            <a href="${profileHref}" class="font-semibold mr-1.5 hover:underline">${post.user}</a>
            <span id="caption-${post.id}">
              ${post.caption}
            </span>
          </div>

          <!-- Comments Count & Link -->
          ${post.comments && post.comments.length > 0 ? `
            <div class="flex flex-col gap-1 mt-1">
              ${post.comments.slice(-2).map(c => `
                <p class="font-body text-body-sm text-light-on-surface dark:text-dark-on-surface">
                  <span class="font-semibold mr-1.5">${c.user}</span>${c.text}
                </p>
              `).join('')}
              ${post.comments.length > 2 ? `
                <button type="button" onclick="showAllComments('${post.id}')" class="text-left font-body text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant hover:underline mt-0.5">
                  View all ${post.comments.length} comments
                </button>
              ` : ''}
            </div>
          ` : ''}

          <!-- Inline Quick-Comment Input with Emoji Picker -->
          <div class="relative mt-1 pt-gutter-sm border-t border-light-outline-variant dark:border-dark-outline-variant flex items-center gap-gutter-sm">
            <button
              type="button"
              onclick="toggleEmojiPicker('${post.id}')"
              aria-label="Insert emoji"
              class="text-light-on-surface-variant dark:text-dark-on-surface-variant hover:text-light-on-surface dark:hover:text-dark-on-surface"
            >
              <span class="material-symbols-outlined text-title-md">sentiment_satisfied</span>
            </button>
            <div
              id="emoji-popover-${post.id}"
              class="hidden absolute bottom-10 left-0 z-20 flex items-center gap-1 px-gutter-sm py-1.5 rounded-full border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface/95 dark:bg-dark-surface-container-low/95 backdrop-blur-md shadow-lg"
            >
              ${quickEmojis.map(em => `
                <button type="button" onclick="insertEmoji('${post.id}', '${em}')" class="px-1 hover:scale-125 transition-transform">${em}</button>
              `).join('')}
            </div>
            <input
              id="comment-input-${post.id}"
              type="text"
              placeholder="Add a comment..."
              onkeydown="if(event.key==='Enter'){submitComment('${post.id}')}"
              class="flex-1 bg-transparent border-0 p-0 font-body text-body-sm text-light-on-surface dark:text-dark-on-surface placeholder:text-light-on-surface-variant dark:placeholder:text-dark-on-surface-variant focus:ring-0 focus:outline-none"
            >
            <button
              type="button"
              onclick="submitComment('${post.id}')"
              class="font-label text-label-md text-light-secondary dark:text-dark-secondary hover:opacity-80 font-semibold"
            >
              Post
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
};

// --- Post Actions ---
window.toggleLike = function(id) {
  const post = window.LumaStore.toggleLike(id);
  if (!post) return;
  window.renderFeed(document.getElementById('feed-search-input')?.value || '');
};

window.doubleTapLike = function(id) {
  const post = window.LumaStore.getPosts().find(p => p.id === id);
  if (!post) return;
  if (!post.liked) {
    window.LumaStore.toggleLike(id);
    window.renderFeed(document.getElementById('feed-search-input')?.value || '');
  }
  const burst = document.getElementById('burst-' + id);
  if (burst) {
    burst.classList.remove('animate-heart-burst');
    void burst.offsetWidth;
    burst.classList.add('animate-heart-burst');
  }
};

window.toggleSave = function(id) {
  const post = window.LumaStore.toggleSave(id);
  if (!post) return;
  window.showToast(post.saved ? 'Saved to your collection' : 'Removed from saved collection');
  window.renderFeed(document.getElementById('feed-search-input')?.value || '');
};

window.slidePost = function(id, dir) {
  const posts = window.LumaStore.getPosts();
  const p = posts.find(x => x.id === id);
  if (!p) return;
  p.currentSlide = (p.currentSlide + dir + p.images.length) % p.images.length;
  window.LumaStore.savePosts(posts);
  window.renderFeed(document.getElementById('feed-search-input')?.value || '');
};

window.toggleAudio = function(id) {
  const posts = window.LumaStore.getPosts();
  const p = posts.find(x => x.id === id);
  if (!p) return;
  p.muted = !p.muted;
  window.LumaStore.savePosts(posts);
  window.renderFeed(document.getElementById('feed-search-input')?.value || '');
};

window.sharePost = function(id) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + '#' + id);
    window.showToast('Post link copied to clipboard!');
  } else {
    window.showToast('Post link ready to share');
  }
};

window.focusCommentInput = function(id) {
  const input = document.getElementById('comment-input-' + id);
  if (input) input.focus();
};

window.toggleEmojiPicker = function(id) {
  const pop = document.getElementById('emoji-popover-' + id);
  if (pop) pop.classList.toggle('hidden');
};

window.insertEmoji = function(id, emoji) {
  const input = document.getElementById('comment-input-' + id);
  if (input) {
    input.value += emoji;
    input.focus();
  }
  const pop = document.getElementById('emoji-popover-' + id);
  if (pop) pop.classList.add('hidden');
};

window.submitComment = function(id) {
  const input = document.getElementById('comment-input-' + id);
  if (!input || !input.value.trim()) return;

  window.LumaStore.addComment(id, input.value.trim());
  input.value = '';
  window.showToast('Comment posted!');
  window.renderFeed(document.getElementById('feed-search-input')?.value || '');
};

window.showAllComments = function(id) {
  const posts = window.LumaStore.getPosts();
  const p = posts.find(x => x.id === id);
  if (!p) return;
  const list = p.comments.map(c => `${c.user}: ${c.text}`).join('\n');
  alert(`Comments on @${p.user}'s post:\n\n${list}`);
};

// --- Explore View ---
window.renderExplore = function(cat = 'all') {
  const grid = document.getElementById('explore-grid');
  if (!grid) return;

  const items = window.LumaStore.getExplore(cat);
  grid.innerHTML = items.map(item => `
    <div
      role="button"
      tabindex="0"
      onclick="openExploreDetail('${item.id}')"
      class="group relative ${item.tall ? 'row-span-2' : ''} rounded-md overflow-hidden bg-light-surface-container dark:bg-dark-surface-container cursor-pointer aspect-square"
    >
      <img
        src="${item.img}"
        alt="${item.caption || item.cat}"
        onerror="handleImageError(this, '${item.cat}')"
        class="w-full h-full object-cover transition-transform duration-surface-enter group-hover:scale-105"
      >
      <div class="absolute inset-0 bg-light-scrim/45 opacity-0 group-hover:opacity-100 transition-opacity duration-state-change flex items-center justify-center gap-gutter-md text-light-on-primary">
        <span class="flex items-center gap-1 font-label text-label-lg tabular-nums">
          <span class="material-symbols-outlined text-title-md icon-filled">favorite</span>
          ${item.likes}
        </span>
        <span class="flex items-center gap-1 font-label text-label-lg tabular-nums">
          <span class="material-symbols-outlined text-title-md icon-filled">chat_bubble</span>
          ${item.comments}
        </span>
      </div>
    </div>
  `).join('');
};

window.filterExplore = function(cat) {
  document.querySelectorAll('.explore-pill').forEach(btn => {
    const active = btn.dataset.exploreCat === cat;
    btn.className = active
      ? 'explore-pill px-gutter-md py-gutter-xs rounded-full bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md cursor-pointer'
      : 'explore-pill px-gutter-md py-gutter-xs rounded-full bg-light-surface-container dark:bg-dark-surface-container text-light-on-surface dark:text-dark-on-surface font-label text-label-md cursor-pointer';
  });
  window.renderExplore(cat);
};

window.openExploreDetail = function(id) {
  const items = window.LumaStore.getExplore('all');
  const item = items.find(i => i.id === id);
  if (!item) return;
  window.showToast(`Exploring @${item.user || 'creator'}: ${item.caption}`);
};

// --- Tab Switching in Index (Home / Explore / Reels) ---
window.switchTab = function(tab) {
  ['home', 'explore', 'reels'].forEach(t => {
    const el = document.getElementById('tab-' + t);
    if (el) el.classList.toggle('hidden', t !== tab);
  });

  // Update navigation items
  document.querySelectorAll('[data-nav]').forEach(btn => {
    const active = btn.dataset.nav === tab;
    btn.classList.toggle('bg-light-surface-container-low', active);
    btn.classList.toggle('dark:bg-dark-surface-container-low', active);
    btn.classList.toggle('font-semibold', active);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// --- Search Drawer ---
window.focusSearch = function() {
  window.switchTab('home');
  const drawer = document.getElementById('search-drawer');
  if (drawer) {
    drawer.classList.remove('hidden');
    const input = document.getElementById('feed-search-input');
    if (input) input.focus();
  }
};

window.handleFeedSearch = function(e) {
  const val = e.target.value;
  window.renderFeed(val);
};

// --- Follow Toggle in Suggestions ---
window.toggleFollowUser = function(btn) {
  const isFollowing = btn.textContent.trim() === 'Following';
  btn.textContent = isFollowing ? 'Follow' : 'Following';
  btn.classList.toggle('text-light-on-surface-variant', !isFollowing);
  window.showToast(isFollowing ? 'Unfollowed user' : 'Now following creator');
};

// Subscribe to store updates
window.LumaStore.subscribe((event) => {
  if (event === 'posts' || event === 'reset') {
    window.renderFeed(document.getElementById('feed-search-input')?.value || '');
  }
  if (event === 'stories' || event === 'reset') {
    window.renderStories();
  }
  if (event === 'explore' || event === 'reset') {
    window.renderExplore();
  }
});

// Initialize Feed
document.addEventListener('DOMContentLoaded', () => {
  window.renderStories();
  window.renderFeed();
  window.renderExplore('all');

  // Handle URL hash navigation (e.g. #explore, #reels)
  if (window.location.hash === '#explore') {
    window.switchTab('explore');
  } else if (window.location.hash === '#reels') {
    window.switchTab('reels');
  }
});
