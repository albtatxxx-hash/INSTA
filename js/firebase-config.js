/**
 * Luma - Firebase Integration Module
 * Firebase SDK v13.4.0
 * Connects the web app to Firebase Firestore, Analytics, and cloud synchronization
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAnalytics, logEvent as fbLogEvent } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-analytics.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  deleteDoc, 
  query, 
  orderBy 
} from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";

// User's Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBdXa_IlF4It5UZK4yKjTOAAwucvXS-M6k",
  authDomain: "menu-b2bc1.firebaseapp.com",
  projectId: "menu-b2bc1",
  storageBucket: "menu-b2bc1.firebasestorage.app",
  messagingSenderId: "949528183713",
  appId: "1:949528183713:web:10de86ea594833437281e0",
  measurementId: "G-FV73QP141H"
};

// Initialize Firebase App
let app = null;
let analytics = null;
let db = null;
let isConnected = false;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Initialize Analytics if supported in current browser/environment
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.info("Firebase Analytics not initialized in this environment:", err.message);
  }
  
  isConnected = true;
  console.log("🔥 Firebase initialized successfully for project:", firebaseConfig.projectId);
} catch (error) {
  console.warn("⚠️ Firebase initialization failed; running in offline/local storage mode:", error);
}

// Cloud Service Bridge
export const LumaFirebase = {
  app,
  analytics,
  db,
  isConnected,

  // Log analytics events safely
  logEvent(eventName, params = {}) {
    if (analytics) {
      try {
        fbLogEvent(analytics, eventName, params);
      } catch (e) {
        // Silently catch analytics errors
      }
    }
  },

  // Save or update a single post in Firestore
  async savePost(post) {
    if (!db || !isConnected || !post || !post.id) return;
    try {
      const postRef = doc(db, "posts", post.id);
      await setDoc(postRef, {
        ...post,
        updatedAt: Date.now()
      }, { merge: true });
      this.logEvent("post_saved_cloud", { id: post.id });
    } catch (err) {
      console.warn("Firebase savePost error (using local storage fallback):", err.message);
    }
  },

  // Delete a post from Firestore
  async deletePost(postId) {
    if (!db || !isConnected || !postId) return;
    try {
      await deleteDoc(doc(db, "posts", postId));
      this.logEvent("post_deleted_cloud", { id: postId });
    } catch (err) {
      console.warn("Firebase deletePost error:", err.message);
    }
  },

  // Save profile to Firestore
  async saveProfile(profile) {
    if (!db || !isConnected || !profile) return;
    try {
      const username = profile.username || "maya.lin";
      const profileRef = doc(db, "profiles", username);
      await setDoc(profileRef, {
        ...profile,
        updatedAt: Date.now()
      }, { merge: true });
      this.logEvent("profile_saved_cloud", { username });
    } catch (err) {
      console.warn("Firebase saveProfile error:", err.message);
    }
  },

  // Fetch all posts from Firestore and sync with LumaStore
  async syncPostsFromCloud(store) {
    if (!db || !isConnected || !store) return;
    try {
      const q = query(collection(db, "posts"));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const cloudPosts = [];
        snapshot.forEach(docSnap => {
          cloudPosts.push(docSnap.data());
        });
        // Sort descending by timestamp or id
        cloudPosts.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        store.savePosts(cloudPosts);
        console.log(`🔥 Synced ${cloudPosts.length} posts from Firebase Firestore.`);
      } else {
        // Firestore is empty: push initial default local posts to Firestore
        const localPosts = store.getPosts();
        if (localPosts && localPosts.length > 0) {
          for (const p of localPosts) {
            this.savePost(p);
          }
        }
      }
    } catch (err) {
      console.warn("Firebase syncPostsFromCloud warning (check Firestore security rules):", err.message);
    }
  },

  // Listen for real-time post updates if Firestore is active
  listenRealtime(store) {
    if (!db || !isConnected || !store) return () => {};
    try {
      const q = query(collection(db, "posts"));
      return onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const updated = [];
          snapshot.forEach(docSnap => {
            updated.push(docSnap.data());
          });
          updated.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
          store.savePosts(updated);
        }
      }, (err) => {
        console.warn("Firebase realtime listener note:", err.message);
      });
    } catch (err) {
      console.warn("Firebase listenRealtime error:", err);
      return () => {};
    }
  }
};

// Expose globally on window
window.LumaFirebase = LumaFirebase;
window.firebaseConfig = firebaseConfig;

// Automatically bind with LumaStore once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  if (window.LumaStore) {
    // Hook into store mutations to auto-sync with Firebase
    const originalAddPost = window.LumaStore.addPost.bind(window.LumaStore);
    window.LumaStore.addPost = function(data) {
      const newPost = originalAddPost(data);
      if (newPost) {
        LumaFirebase.savePost(newPost);
      }
      return newPost;
    };

    const originalToggleLike = window.LumaStore.toggleLike.bind(window.LumaStore);
    window.LumaStore.toggleLike = function(postId) {
      const post = originalToggleLike(postId);
      if (post) {
        LumaFirebase.savePost(post);
      }
      return post;
    };

    const originalToggleSave = window.LumaStore.toggleSave.bind(window.LumaStore);
    window.LumaStore.toggleSave = function(postId) {
      const post = originalToggleSave(postId);
      if (post) {
        LumaFirebase.savePost(post);
      }
      return post;
    };

    const originalAddComment = window.LumaStore.addComment.bind(window.LumaStore);
    window.LumaStore.addComment = function(postId, text, user) {
      const comment = originalAddComment(postId, text, user);
      const post = window.LumaStore.getPosts().find(p => p.id === postId);
      if (post) {
        LumaFirebase.savePost(post);
      }
      return comment;
    };

    const originalDeletePost = window.LumaStore.deletePost.bind(window.LumaStore);
    window.LumaStore.deletePost = function(postId) {
      originalDeletePost(postId);
      LumaFirebase.deletePost(postId);
    };

    const originalSetProfile = window.LumaStore.setProfile.bind(window.LumaStore);
    window.LumaStore.setProfile = function(updates) {
      const updated = originalSetProfile(updates);
      LumaFirebase.saveProfile(updated);
      return updated;
    };

    // Initial sync from cloud
    LumaFirebase.syncPostsFromCloud(window.LumaStore);
  }
});
