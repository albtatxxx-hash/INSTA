/**
 * Luma App - Common UI Logic, Theme, Modals, Navigation & Shared Actions
 */

// URL Helpers for seamless navigation across root and subfolders
window.getProfileUrl = function() {
  if (window.location.pathname.includes('luma_visual_social_feed')) {
    return '../luma_user_profile_grid_view/code.html';
  }
  if (window.location.pathname.includes('luma_user_profile_grid_view')) {
    return 'code.html';
  }
  return 'profile.html';
};

window.getHomeUrl = function() {
  if (window.location.pathname.includes('luma_user_profile_grid_view')) {
    return '../luma_visual_social_feed/code.html';
  }
  if (window.location.pathname.includes('luma_visual_social_feed')) {
    return 'code.html';
  }
  return 'index.html';
};

// Global image error handler to prevent broken images
window.handleImageError = function(img, text = 'Luma') {
  if (!img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true';
    img.src = window.getPlaceholderImage ? window.getPlaceholderImage(text) : 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23262626"><text x="50%" y="50%" fill="%23fff" text-anchor="middle">Luma</text></svg>';
  }
};

// Toast notification banner
let toastTimer = null;
window.showToast = function(msg) {
  const toast = document.getElementById('toast-banner');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('opacity-0', 'pointer-events-none');
  toast.classList.add('opacity-100');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0', 'pointer-events-none');
  }, 2400);
};

// Theme switcher
window.applyTheme = function(theme) {
  const html = document.documentElement;
  const isDark = theme === 'dark';
  html.classList.toggle('dark', isDark);
  html.classList.toggle('light', !isDark);

  const mobileIcon = document.getElementById('mobile-theme-icon');
  const desktopIcon = document.getElementById('desktop-theme-icon');
  const desktopLabel = document.getElementById('desktop-theme-label');

  if (mobileIcon) mobileIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  if (desktopIcon) desktopIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
  if (desktopLabel) desktopLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
};

window.toggleTheme = function() {
  const current = window.LumaStore.getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  window.LumaStore.setTheme(next);
  window.applyTheme(next);
  const moreMenu = document.getElementById('more-menu');
  if (moreMenu) moreMenu.classList.add('hidden');
};

// Toggle More menu
window.toggleMoreMenu = function() {
  const menu = document.getElementById('more-menu');
  if (menu) menu.classList.toggle('hidden');
};

// Close more menu when clicking outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('more-menu');
  const btn = e.target.closest('button[onclick*="toggleMoreMenu"]');
  if (menu && !menu.classList.contains('hidden') && !btn && !menu.contains(e.target)) {
    menu.classList.add('hidden');
  }
});

// --- Create Post Modal Logic ---
let createPostState = {
  selectedImageSrc: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=900&auto=format&fit=crop&q=80',
  selectedAspect: 'aspect-square',
  selectedFilter: 'none'
};

window.openCreateModal = function() {
  const modal = document.getElementById('create-post-modal');
  if (modal) {
    modal.showModal();
    // Reset inputs
    const captionEl = document.getElementById('new-post-caption');
    const locEl = document.getElementById('new-post-location');
    if (captionEl) captionEl.value = '';
    if (locEl) locEl.value = '';
  }
};

window.closeCreateModal = function() {
  const modal = document.getElementById('create-post-modal');
  if (modal) modal.close();
};

window.setPreviewRatio = function(ratioClass) {
  createPostState.selectedAspect = ratioClass;
  const dz = document.getElementById('drop-zone');
  if (dz) {
    dz.className = `relative w-full ${ratioClass} rounded-md border-2 border-dashed border-light-outline-variant dark:border-dark-outline-variant bg-light-surface dark:bg-dark-surface-container-low flex flex-col items-center justify-center overflow-hidden transition-all`;
  }
  document.querySelectorAll('.aspect-btn').forEach(btn => {
    const isSelected = btn.dataset.aspect === ratioClass;
    btn.classList.toggle('bg-light-primary', isSelected);
    btn.classList.toggle('text-light-on-primary', isSelected);
    btn.classList.toggle('dark:bg-dark-primary', isSelected);
    btn.classList.toggle('dark:text-dark-on-primary', isSelected);
  });
};

window.setPreviewFilter = function(filterVal) {
  createPostState.selectedFilter = filterVal;
  const preview = document.getElementById('create-preview-img');
  if (preview) {
    preview.style.filter = filterVal;
  }
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isSelected = btn.dataset.filter === filterVal;
    btn.classList.toggle('ring-2', isSelected);
    btn.classList.toggle('ring-light-primary', isSelected);
    btn.classList.toggle('dark:ring-dark-primary', isSelected);
  });
};

window.handleFileInput = function(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    createPostState.selectedImageSrc = ev.target.result;
    const preview = document.getElementById('create-preview-img');
    if (preview) preview.src = createPostState.selectedImageSrc;
  };
  reader.readAsDataURL(file);
};

window.handleDrop = function(e) {
  e.preventDefault();
  const dz = document.getElementById('drop-zone');
  if (dz) dz.classList.remove('border-light-secondary');

  const file = e.dataTransfer && e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      createPostState.selectedImageSrc = ev.target.result;
      const preview = document.getElementById('create-preview-img');
      if (preview) preview.src = createPostState.selectedImageSrc;
    };
    reader.readAsDataURL(file);
  }
};

window.publishNewPost = function() {
  const captionInput = document.getElementById('new-post-caption');
  const locInput = document.getElementById('new-post-location');
  const caption = (captionInput && captionInput.value.trim()) || 'A quiet captured moment.';
  const location = (locInput && locInput.value.trim()) || 'San Francisco, CA';

  window.LumaStore.addPost({
    image: createPostState.selectedImageSrc,
    caption: caption,
    location: location,
    aspect: createPostState.selectedAspect,
    filter: createPostState.selectedFilter
  });

  window.closeCreateModal();
  window.showToast('Post shared to your feed and profile!');

  // If on profile page or feed, re-render
  if (typeof window.renderFeed === 'function') window.renderFeed();
  if (typeof window.renderProfileGrid === 'function') window.renderProfileGrid();
  if (typeof window.updateProfileStats === 'function') window.updateProfileStats();
};

// --- Story Viewer Logic ---
let storyTimer = null;
window.openStoryViewer = function(storyId) {
  const stories = window.LumaStore.getStories();
  const story = stories.find(s => s.id === storyId) || stories[0];
  if (!story) return;

  window.LumaStore.markStorySeen(story.id);

  const modal = document.getElementById('story-modal');
  const img = document.getElementById('story-modal-img');
  const avatar = document.getElementById('story-modal-avatar');
  const user = document.getElementById('story-modal-user');
  const prog = document.getElementById('story-modal-progress');

  if (img) img.src = story.media;
  if (avatar) avatar.src = story.avatar;
  if (user) user.textContent = story.user;
  if (prog) {
    prog.style.width = '0%';
    setTimeout(() => { prog.style.width = '100%'; }, 50);
  }

  if (modal) {
    modal.showModal();
    clearTimeout(storyTimer);
    storyTimer = setTimeout(() => {
      modal.close();
    }, 4500);
  }
};

window.closeStoryViewer = function() {
  const modal = document.getElementById('story-modal');
  if (modal) modal.close();
  clearTimeout(storyTimer);
};

// Initialize common state on load
document.addEventListener('DOMContentLoaded', () => {
  // Dynamic links routing
  document.querySelectorAll('[data-link="profile"]').forEach(a => {
    a.href = window.getProfileUrl();
  });
  document.querySelectorAll('[data-link="home"]').forEach(a => {
    a.href = window.getHomeUrl();
  });
  document.querySelectorAll('[data-link="explore"]').forEach(a => {
    a.href = window.getHomeUrl() + '#explore';
  });
  document.querySelectorAll('[data-link="reels"]').forEach(a => {
    a.href = window.getHomeUrl() + '#reels';
  });

  // Apply saved theme
  const savedTheme = window.LumaStore.getTheme();
  window.applyTheme(savedTheme);

  // Sync profile avatars in navigation
  const profile = window.LumaStore.getProfile();
  document.querySelectorAll('.user-avatar-sync').forEach(img => {
    img.src = profile.avatar;
  });
  document.querySelectorAll('.user-name-sync').forEach(el => {
    el.textContent = profile.name;
  });
  document.querySelectorAll('.user-username-sync').forEach(el => {
    el.textContent = profile.username;
  });
});
