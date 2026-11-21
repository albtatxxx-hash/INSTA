/**
 * Luma Profile - Grid View, Highlights, Post Detail Modal & Profile Editing
 */

let currentProfileTab = 'posts';
let activeModalPostId = null;

// Highlights Data
const HIGHLIGHTS_DATA = [
  {
    id: 'h-kyoto',
    title: "Kyoto '26",
    img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=300&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&auto=format&fit=crop&q=80'
  },
  {
    id: 'h-arch',
    title: 'Architecture',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=300&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=900&auto=format&fit=crop&q=80'
  },
  {
    id: 'h-ceramics',
    title: 'Ceramics',
    img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&auto=format&fit=crop&q=80'
  },
  {
    id: 'h-film',
    title: '35mm Film',
    img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=300&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80'
  },
  {
    id: 'h-coffee',
    title: 'Coffee',
    img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop&q=80',
    media: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&auto=format&fit=crop&q=80'
  }
];

// --- Render Highlights ---
window.renderHighlights = function() {
  const container = document.getElementById('highlights-container');
  if (!container) return;

  container.innerHTML = HIGHLIGHTS_DATA.map(h => `
    <button
      type="button"
      onclick="openHighlightViewer('${h.id}')"
      class="flex flex-col items-center gap-gutter-xs shrink-0 group focus-visible:outline-none"
    >
      <div class="p-1 rounded-full border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface dark:bg-dark-surface transition-transform duration-state-change group-hover:scale-105">
        <img
          src="${h.img}"
          alt="${h.title}"
          onerror="handleImageError(this, '${h.title}')"
          class="w-16 h-16 rounded-full object-cover"
        >
      </div>
      <span class="font-label text-label-sm text-light-on-surface dark:text-dark-on-surface">${h.title}</span>
    </button>
  `).join('') + `
    <button
      type="button"
      onclick="openCreateModal()"
      class="flex flex-col items-center gap-gutter-xs shrink-0 group"
    >
      <div class="w-16 h-16 rounded-full border border-light-outline-variant dark:border-dark-outline-variant bg-light-surface-container-low dark:bg-dark-surface-container-low flex items-center justify-center text-light-on-surface-variant dark:text-dark-on-surface-variant transition-transform duration-state-change group-hover:scale-105">
        <span class="material-symbols-outlined text-headline-md">add</span>
      </div>
      <span class="font-label text-label-sm text-light-on-surface-variant dark:text-dark-on-surface-variant">New</span>
    </button>
  `;
};

window.openHighlightViewer = function(highlightId) {
  const h = HIGHLIGHTS_DATA.find(x => x.id === highlightId);
  if (!h) return;

  const modal = document.getElementById('story-modal');
  const img = document.getElementById('story-modal-img');
  const avatar = document.getElementById('story-modal-avatar');
  const user = document.getElementById('story-modal-user');
  const prog = document.getElementById('story-modal-progress');
  const profile = window.LumaStore.getProfile();

  if (img) img.src = h.media;
  if (avatar) avatar.src = profile.avatar;
  if (user) user.textContent = `${profile.username} · ${h.title}`;
  if (prog) {
    prog.style.width = '0%';
    setTimeout(() => { prog.style.width = '100%'; }, 50);
  }

  if (modal) {
    modal.showModal();
    clearTimeout(window.highlightTimer);
    window.highlightTimer = setTimeout(() => {
      modal.close();
    }, 4500);
  }
};

// --- Profile Header & Stats ---
window.updateProfileStats = function() {
  const profile = window.LumaStore.getProfile();
  const allPosts = window.LumaStore.getPosts();
  const userPosts = allPosts.filter(p => p.user === profile.username);

  // Update elements
  const postCountEl = document.getElementById('profile-post-count');
  if (postCountEl) postCountEl.textContent = userPosts.length;

  const followersCountEl = document.getElementById('profile-followers-count');
  if (followersCountEl) followersCountEl.textContent = profile.followers || '12.8k';

  const followingCountEl = document.getElementById('profile-following-count');
  if (followingCountEl) followingCountEl.textContent = profile.following || '384';

  const displayNameEl = document.getElementById('profile-display-name');
  if (displayNameEl) displayNameEl.textContent = profile.name;

  const bioEl = document.getElementById('profile-bio-text');
  if (bioEl) bioEl.textContent = profile.bio;

  const headlineEl = document.getElementById('profile-headline-text');
  if (headlineEl) headlineEl.textContent = profile.headline || 'Visual Director · San Francisco';

  const websiteEl = document.getElementById('profile-website-link');
  if (websiteEl) {
    websiteEl.textContent = profile.website || 'mayalin.studio';
    websiteEl.href = profile.website.startsWith('http') ? profile.website : 'https://' + profile.website;
  }

  const avatarImg = document.getElementById('profile-header-avatar');
  if (avatarImg) {
    avatarImg.src = profile.avatar;
  }
};

// --- Profile Media Grid ---
window.renderProfileGrid = function(tab = currentProfileTab) {
  currentProfileTab = tab;
  const container = document.getElementById('profile-media-grid');
  if (!container) return;

  const profile = window.LumaStore.getProfile();
  const allPosts = window.LumaStore.getPosts();

  let items = [];
  if (tab === 'posts') {
    items = allPosts.filter(p => p.user === profile.username);
  } else if (tab === 'reels') {
    items = allPosts.filter(p => p.isVideo || p.type === 'reel');
  } else if (tab === 'saved') {
    items = allPosts.filter(p => p.saved === true);
  } else if (tab === 'tagged') {
    items = allPosts.filter(p => p.user !== profile.username);
  }

  if (items.length === 0) {
    let emptyMsg = 'No posts published yet.';
    if (tab === 'reels') emptyMsg = 'No reels shared yet.';
    if (tab === 'saved') emptyMsg = 'No saved posts yet. Click the bookmark icon on any post to save it here.';
    if (tab === 'tagged') emptyMsg = 'No photos tagging you yet.';

    container.innerHTML = `
      <div class="col-span-3 py-16 text-center flex flex-col items-center gap-gutter-md border border-dashed border-light-outline-variant dark:border-dark-outline-variant rounded-md p-gutter-xl">
        <span class="material-symbols-outlined text-display-lg text-light-on-surface-variant dark:text-dark-on-surface-variant">
          ${tab === 'saved' ? 'bookmark' : tab === 'reels' ? 'smart_display' : 'photo_library'}
        </span>
        <p class="font-body text-body-md text-light-on-surface-variant dark:text-dark-on-surface-variant max-w-sm">
          ${emptyMsg}
        </p>
        ${tab === 'posts' ? `
          <button
            type="button"
            onclick="openCreateModal()"
            class="px-gutter-md py-gutter-xs rounded bg-light-primary dark:bg-dark-primary text-light-on-primary dark:text-dark-on-primary font-label text-label-md"
          >
            Share your first photo
          </button>
        ` : ''}
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const mainImg = item.images && item.images[0] ? item.images[0] : item.img;
    const commentsCount = item.comments ? item.comments.length : 0;
    const isMultiple = item.images && item.images.length > 1;

    return `
      <div
        role="button"
        tabindex="0"
        onclick="openDetailModal('${item.id}')"
        class="group relative aspect-square rounded-sm overflow-hidden bg-light-surface-container dark:bg-dark-surface-container cursor-pointer focus-visible:ring-2 focus-visible:ring-light-secondary dark:focus-visible:ring-dark-secondary"
      >
        <img
          src="${mainImg}"
          alt="${item.caption || 'Profile photo'}"
          onerror="handleImageError(this, 'Profile photo')"
          style="filter: ${item.filter || 'none'};"
          class="w-full h-full object-cover transition-transform duration-surface-enter group-hover:scale-105"
        >

        ${isMultiple ? `
          <span class="absolute top-2 right-2 text-light-on-primary drop-shadow">
            <span class="material-symbols-outlined text-title-md icon-filled">collections</span>
          </span>
        ` : item.isVideo || item.type === 'reel' ? `
          <span class="absolute top-2 right-2 text-light-on-primary drop-shadow">
            <span class="material-symbols-outlined text-title-md icon-filled">smart_display</span>
          </span>
        ` : ''}

        <!-- Hover Overlay -->
        <div class="absolute inset-0 bg-light-scrim/45 opacity-0 group-hover:opacity-100 transition-opacity duration-state-change flex items-center justify-center gap-gutter-md text-light-on-primary">
          <span class="flex items-center gap-1 font-label text-label-lg tabular-nums">
            <span class="material-symbols-outlined text-title-md icon-filled">favorite</span>
            ${Number(item.likes).toLocaleString()}
          </span>
          <span class="flex items-center gap-1 font-label text-label-lg tabular-nums">
            <span class="material-symbols-outlined text-title-md icon-filled">chat_bubble</span>
            ${commentsCount}
          </span>
        </div>
      </div>
    `;
  }).join('');
};

window.switchProfileTab = function(tab) {
  document.querySelectorAll('.profile-tab').forEach(btn => {
    const active = btn.dataset.profileTab === tab;
    btn.classList.toggle('border-light-primary', active);
    btn.classList.toggle('dark:border-dark-primary', active);
    btn.classList.toggle('text-light-on-surface', active);
    btn.classList.toggle('dark:text-dark-on-surface', active);
    btn.classList.toggle('border-transparent', !active);
    btn.classList.toggle('text-light-on-surface-variant', !active);
    btn.classList.toggle('dark:text-dark-on-surface-variant', !active);
  });
  window.renderProfileGrid(tab);
};

// --- Post Detail Modal ---
window.openDetailModal = function(postId) {
  const posts = window.LumaStore.getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;

  activeModalPostId = postId;
  const modal = document.getElementById('post-detail-modal');

  const imgEl = document.getElementById('detail-modal-img');
  const userEl = document.getElementById('detail-modal-user');
  const avatarEl = document.getElementById('detail-modal-avatar');
  const locEl = document.getElementById('detail-modal-location');
  const capEl = document.getElementById('detail-modal-caption');
  const statsEl = document.getElementById('detail-modal-stats');
  const likeBtn = document.getElementById('detail-modal-like-btn');
  const saveBtn = document.getElementById('detail-modal-save-btn');
  const commentsListEl = document.getElementById('detail-modal-comments-list');
  const deleteBtn = document.getElementById('detail-modal-delete-btn');

  if (imgEl) {
    imgEl.src = post.images && post.images[0] ? post.images[0] : post.img;
    imgEl.style.filter = post.filter || 'none';
  }
  if (userEl) userEl.textContent = post.user;
  if (avatarEl) avatarEl.src = post.avatar;
  if (locEl) locEl.textContent = post.location || '';
  if (capEl) capEl.textContent = post.caption || '';
  if (statsEl) {
    statsEl.textContent = `${Number(post.likes).toLocaleString()} likes · ${post.comments ? post.comments.length : 0} comments`;
  }

  // Like & Save status
  if (likeBtn) {
    likeBtn.classList.toggle('text-like-red', Boolean(post.liked));
    const icon = likeBtn.querySelector('.material-symbols-outlined');
    if (icon) icon.className = `material-symbols-outlined text-headline-md ${post.liked ? 'text-like-red icon-filled' : ''}`;
  }
  if (saveBtn) {
    const icon = saveBtn.querySelector('.material-symbols-outlined');
    if (icon) icon.className = `material-symbols-outlined text-headline-md ${post.saved ? 'icon-filled' : ''}`;
  }

  // Allow deleting own posts
  const profile = window.LumaStore.getProfile();
  if (deleteBtn) {
    deleteBtn.classList.toggle('hidden', post.user !== profile.username);
  }

  // Render modal comments
  if (commentsListEl) {
    if (post.comments && post.comments.length > 0) {
      commentsListEl.innerHTML = post.comments.map(c => `
        <div class="flex items-start gap-2 py-1">
          <span class="font-semibold text-light-on-surface dark:text-dark-on-surface text-body-sm">${c.user}</span>
          <span class="text-light-on-surface-variant dark:text-dark-on-surface-variant text-body-sm flex-1">${c.text}</span>
          <span class="text-xs text-light-outline dark:text-dark-outline">${c.time || ''}</span>
        </div>
      `).join('');
    } else {
      commentsListEl.innerHTML = `<p class="text-body-sm text-light-on-surface-variant dark:text-dark-on-surface-variant py-2">No comments yet. Be the first to comment!</p>`;
    }
  }

  if (modal) modal.showModal();
};

window.closeDetailModal = function() {
  const modal = document.getElementById('post-detail-modal');
  if (modal) modal.close();
  activeModalPostId = null;
};

window.modalToggleLike = function() {
  if (!activeModalPostId) return;
  window.LumaStore.toggleLike(activeModalPostId);
  window.openDetailModal(activeModalPostId);
  window.renderProfileGrid();
};

window.modalToggleSave = function() {
  if (!activeModalPostId) return;
  const post = window.LumaStore.toggleSave(activeModalPostId);
  window.openDetailModal(activeModalPostId);
  window.showToast(post.saved ? 'Saved to collection' : 'Removed from collection');
  window.renderProfileGrid();
};

window.modalSubmitComment = function() {
  if (!activeModalPostId) return;
  const input = document.getElementById('detail-modal-comment-input');
  if (!input || !input.value.trim()) return;

  window.LumaStore.addComment(activeModalPostId, input.value.trim());
  input.value = '';
  window.openDetailModal(activeModalPostId);
  window.renderProfileGrid();
  window.showToast('Comment added');
};

window.modalDeletePost = function() {
  if (!activeModalPostId) return;
  if (confirm('Are you sure you want to delete this post?')) {
    window.LumaStore.deletePost(activeModalPostId);
    window.closeDetailModal();
    window.renderProfileGrid();
    window.updateProfileStats();
    window.showToast('Post deleted');
  }
};

// --- Edit Profile Modal ---
window.openEditProfile = function() {
  const profile = window.LumaStore.getProfile();
  const nameInput = document.getElementById('edit-name-input');
  const bioInput = document.getElementById('edit-bio-input');
  const headlineInput = document.getElementById('edit-headline-input');
  const websiteInput = document.getElementById('edit-website-input');
  const avatarPreview = document.getElementById('edit-avatar-preview');

  if (nameInput) nameInput.value = profile.name;
  if (bioInput) bioInput.value = profile.bio;
  if (headlineInput) headlineInput.value = profile.headline || 'Visual Director · San Francisco';
  if (websiteInput) websiteInput.value = profile.website || 'mayalin.studio';
  if (avatarPreview) avatarPreview.src = profile.avatar;

  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.showModal();
};

window.closeEditProfile = function() {
  const modal = document.getElementById('edit-profile-modal');
  if (modal) modal.close();
};

window.handleAvatarChange = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    const avatarPreview = document.getElementById('edit-avatar-preview');
    if (avatarPreview) avatarPreview.src = ev.target.result;
    window._newAvatarData = ev.target.result;
  };
  reader.readAsDataURL(file);
};

window.saveProfileEdits = function() {
  const name = document.getElementById('edit-name-input')?.value.trim();
  const bio = document.getElementById('edit-bio-input')?.value.trim();
  const headline = document.getElementById('edit-headline-input')?.value.trim();
  const website = document.getElementById('edit-website-input')?.value.trim();

  const updates = {};
  if (name) updates.name = name;
  if (bio) updates.bio = bio;
  if (headline) updates.headline = headline;
  if (website) updates.website = website;
  if (window._newAvatarData) {
    updates.avatar = window._newAvatarData;
    window._newAvatarData = null;
  }

  window.LumaStore.setProfile(updates);
  window.updateProfileStats();
  window.closeEditProfile();
  window.showToast('Profile updated successfully!');
};

window.copyProfileLink = function() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    window.showToast('Profile link copied to clipboard!');
  } else {
    window.showToast('Profile link: ' + window.location.href);
  }
};

// Store Subscription
window.LumaStore.subscribe((event) => {
  if (event === 'profile' || event === 'reset') {
    window.updateProfileStats();
    window.renderProfileGrid();
  }
  if (event === 'posts' || event === 'reset') {
    window.updateProfileStats();
    window.renderProfileGrid();
  }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
  window.updateProfileStats();
  window.renderHighlights();
  window.renderProfileGrid('posts');
});
