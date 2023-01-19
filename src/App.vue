<template>
  <div>
    <ChatMessage v-for="user in usersMessages" :key="user.userId"
      :Username="user.userDisplayName"
      :imageURL="user.userProfileImg"
      :message="user.message"
    />

    {{ usersMessages }}
  </div>
</template>

<script>
import ChatMessage from './components/ChatMessage.vue';
import tmi from 'tmi.js';

export default {
  name: 'App',
  components: {
    ChatMessage
  },
  data() {
    return {
      usersMessages: [],
      userList: new Map(),
    }
  },
  methods: {
    async getUser(userId) {
      const hasUser = this.userList.has(userId);

      if (!hasUser) {
        let params = new URLSearchParams()
        params.set('id', userId);
        const response = await fetch(`https://api.twitch.tv/helix/users?${params}`, {
          headers: {
            'Authorization': `Bearer ${process.env.VUE_APP_TOKEN_OAUTH}`,
            'Client-Id': process.env.VUE_APP_CLIENT_ID
          }
        })
        const {data} = await response.json();
        this.userList.set(userId, data[0])
      }

      return this.userList.get(userId);
    }
  },
  mounted() {
    const client = new tmi.Client({
      options: { debug: true },
      identity: {
        username: 'LucasChatBot',
        password: `oauth:${process.env.VUE_APP_TOKEN_OAUTH}`
      },
      channels: [ '#lucasarieiv' ]
    });

    client.connect().catch(console.error);
    client.on('message', async (channel, tags, message, self) => {
      if(self) return;
      const [command, ...chatMessage] = message.toLowerCase().split(' ');
      console.log(chatMessage)

      switch (command) {
        case '!themes':
          client.say(channel, `@${tags.username}, mudamos seu tema para`);
          break;
        case '!hello':
            client.say(channel, `@${tags.username}, heya!`);
          break;
        default: {
          console.log('Line 71 tags: ', tags);
          console.log(command)
          const userId = tags['user-id'];
          const userInfo = await this.getUser(userId);
          const isSub = userInfo.subscriber;
          const userDisplayName = userInfo.display_name;
          const userProfileImg = userInfo.profile_image_url;
          console.log(userProfileImg);
          const userFirstMessage = tags['first-msg'];
          const userColor = tags.color;
          const userMessage = {
            userId,
            isSub,
            userDisplayName,
            userProfileImg,
            userFirstMessage,
            userColor,
            message: chatMessage
          }
          this.usersMessages = [...this.usersMessages, userMessage]
          console.log(chatMessage);
          break;
        }
      }
    });
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
:root {
  --purple-500: #9f92b9;
  --gradient-first-person: linear-gradient(180deg, #e863cb 0%, rgba(71, 68, 211, 0.7) 100%);
  --gradient-sub: linear-gradient(180deg, #7237E8 0%, #FBA3A3 100%);
  --gray-700: #393a35;
  --wine-700: #2f0923;
  --green-300: #89c94b;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
