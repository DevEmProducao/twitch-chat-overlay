<template>
  <div class="message-container">
    <UserAvatar :imageURL="imageURL"/>
    
    <div class="message-box">
      <div class="username-badges">
        <p class="username">{{Username}}</p>
        <UserBadges :badges="badges" />
      </div>

      <p class="message">{{ message }}</p>
    </div>

  </div>
</template>

<script>
import UserAvatar from './UserAvatar.vue';
import UserBadges from './UserBadges.vue';

export default {
  name: 'ChatTerminal',
  components: {
    UserAvatar,
    UserBadges
  },
  props: {
    imageURL: {
      required: true,
      type: String
    },
    Username: {
      required: true,
      type: String
    },
    message: {
      required: false,
      type: String
    }
  },
  data() {
    return {
      badges: [
        'https://static-cdn.jtvnw.net/badges/v1/3267646d-33f0-4b17-b3df-f923a41db1d0/1',
        'https://static-cdn.jtvnw.net/badges/v1/a1dd5073-19c3-4911-8cb4-c464a7bc1510/1'
      ]
    }
  }
}
</script>

<style scoped>
.message-container {
  margin-top: 1rem;
  position: relative;
  background-color: var(--purple-500);
  border-radius: 4px;
  border-bottom-left-radius: 48px;
  border-top-right-radius: 48px;
  border-bottom: 2px solid #6441A5;
  animation: Go 1s;
}

.message-box {
  padding: 16px 16px 16px 48px;
  word-wrap: anywhere;
}

.username-badges {
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-box .message {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  color: #fff;
}

</style>