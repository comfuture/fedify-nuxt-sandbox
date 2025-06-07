<script setup lang="ts">
const route = useRoute();
const identifier = route.params.identifier as string;
const { data } = await useFetch(`/user/${identifier}`, {
  headers: {
    'accept': 'application/ld+json',
  },
})

import { ref, computed } from 'vue'
const showRaw = ref(false)

// 타입 안전성을 위해 data의 타입을 명시적으로 선언
interface ProfileData {
  id?: string;
  name?: string;
  preferredUsername?: string;
  summary?: string;
  inbox?: string;
  endpoints?: {
    sharedInbox?: string;
  };
  icon?: {
    url?: string;
  };
}

const profile = computed<ProfileData>(() => data.value as ProfileData || {})

const avatarUrl = computed(() => profile.value.icon?.url || null)
const initials = computed(() => {
  if (profile.value.name) {
    return profile.value.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }
  if (profile.value.preferredUsername) {
    return profile.value.preferredUsername.slice(0, 2).toUpperCase()
  }
  return '?'
})
</script>
<template>
  <div class="profile-page">
    <header class="profile-header">
      <div class="header-bg"></div>
      <div class="profile-avatar">
        <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
        <div v-else class="avatar-initials">{{ initials }}</div>
      </div>
      <div class="profile-info">
        <h1>{{ profile.name }}</h1>
        <p class="username">@{{ profile.preferredUsername }}</p>
        <p class="summary" v-if="profile.summary">{{ profile.summary }}</p>
      </div>
    </header>
    <section class="profile-actions">
      <button class="follow-btn">Follow</button>
      <div class="profile-stats">
        <div class="stat">
          <span class="stat-num">123</span>
          <span class="stat-label">Follows</span>
        </div>
        <div class="stat">
          <span class="stat-num">456</span>
          <span class="stat-label">Following</span>
        </div>
        <div class="stat">
          <span class="stat-num">2024-06-08</span>
          <span class="stat-label">가입일</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%);
  font-family: 'Segoe UI', 'Apple SD Gothic Neo', sans-serif;

  .profile-header {
    position: relative;
    width: 100%;
    min-height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 180px;
      background: linear-gradient(90deg, #3b82f6 0%, #6366f1 100%);
      border-bottom-left-radius: 2.5rem;
      border-bottom-right-radius: 2.5rem;
      z-index: 1;
    }

    .profile-avatar {
      position: relative;
      z-index: 2;
      margin-top: 100px;
      width: 120px;
      height: 120px;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }

      .avatar-initials {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2.8rem;
        font-weight: 700;
        color: #3b82f6;
        background: #e0e7ef;
        border-radius: 50%;
      }
    }

    .profile-info {
      z-index: 2;
      margin-top: 1.2rem;
      text-align: center;

      h1 {
        font-size: 2.1rem;
        font-weight: 700;
        color: #222;
        margin-bottom: 0.2rem;
      }

      .username {
        font-size: 1.15rem;
        color: #5b6b7a;
        margin-bottom: 0.7rem;
      }

      .summary {
        font-size: 1.08rem;
        color: #444;
        margin-bottom: 0.5rem;
        line-height: 1.5;
      }
    }
  }

  .profile-actions {
    margin: 2.2rem auto 0 auto;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;

    .follow-btn {
      background: #2563eb;
      color: #fff;
      border: none;
      border-radius: 0.5rem;
      padding: 0.6rem 2.2rem;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #1d4ed8;
      }
    }

    .profile-stats {
      display: flex;
      gap: 2.5rem;

      .stat {
        display: flex;
        flex-direction: column;
        align-items: center;

        .stat-num {
          font-size: 1.25rem;
          font-weight: 700;
          color: #222;
        }

        .stat-label {
          font-size: 0.98rem;
          color: #64748b;
        }
      }
    }
  }
}
</style>