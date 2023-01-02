const containerElement = document.querySelector('.container');
const TOKEN_OAUTH = 'cn9q591ur161oa8dygkwxo502vx80q'
const CLIENT_ID = 'aos7x393ave7et1p7pu8zth5w7agyu'
let badgeList = []
let userList = new Map();
let messageCount = 0;

async function getBadges() {
  const response = await fetch('https://api.twitch.tv/helix/chat/badges/global', {
    headers: {
      'Authorization': `Bearer ${TOKEN_OAUTH}`,
      'Client-Id': CLIENT_ID
    }
  })

  const data = await response.json();
  return data;
}

function getUserBadges(badges) {
  let userBadges = []
  for (let badge in badges) {
    const badgeInfo = getBadgeByName(badge);
    userBadges.push(badgeInfo)
  }

  return userBadges;
}

function badgesImgElements(userBadges) {
  let imageElements = '';
  let imageUrl = '';

  userBadges.forEach(badge => {
    imageUrl = badge.versions[0].image_url_1x;
    imageElements += `<img src="${imageUrl}" alt="${badge.set_id}" />`;
  });

  return imageElements;
}

async function getUser(userId) {
  const hasUser = userList.has(userId);

  if (!hasUser) {
    let params = new URLSearchParams()
    params.set('id', userId);
    const response = await fetch(`https://api.twitch.tv/helix/users?${params}`, {
      headers: {
        'Authorization': `Bearer ${TOKEN_OAUTH}`,
        'Client-Id': CLIENT_ID
      }
    })
    const {data} = await response.json();
    userList.set(userId, data[0])
  }

  return userList.get(userId);
}

function setUserSub(userId, isSub) {
  const userSettings = userList.get(userId)
  userSettings.subscriber = isSub;
  userList.set(userId, userSettings)
}

async function getBadgeList() {
  if (badgeList.length === 0) {
    const {data} = await getBadges();
    badgeList = data
  }
}

function getBadgeByName(badgeName) {
  const badgeInfo = badgeList.find(badge => badge.set_id === badgeName);
  return badgeInfo;
}

function createMessageHTML(username, userProfileImg, userColor, message, isMod=false, badges, firstMessage, isSub) {
  const messages = document.querySelectorAll('.message-container');
  
  if (messages.length >= 7) {
    messages[6].classList.add('-message-out');
    messages[6].addEventListener('animationend', ()=> {
      messages[6].remove();
    })
  }
  
  const unusedColors = ['#FF69B4', '#DAA520', '#5F9EA0', '#FF7F50']
  const isUnusedColor = unusedColors.find(color => color === userColor);

  const messageElement = `
  <div class="message-container ${firstMessage && '-first-message'} ${isSub && '-sub'}">
    <div class="avatar-image">
      <div class="image-box">
        <img src="${userProfileImg}" alt="${username}">
      </div>
    </div>
    <div class="message-box">
      <div class="username-badges">
        <p class="username" style="color: ${ isUnusedColor !== undefined ? '#393A35' : userColor}">${username}</p>

        <div class="badges">
          ${badges}
        </div>

      </div>

      <p class="message">${message}</p>
    </div>
  </div>
  `
  return messageElement
}

function insertMessageOnContainer(element) {
  containerElement.insertAdjacentHTML("afterbegin", element);
}

function messageEmoteRender(message, emote, img) {
  return message.replace(emote, img);
}

function getEmotePositionFromMessage(firstPosition, lastPosition, message) {
  const emoteName = message.slice(firstPosition, Number(lastPosition)  + 1)
  return emoteName;
}

function imageRender(emoteId) {
  const emoteURL = `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`;
  return `
    <img src="${emoteURL}" />
  `;
}

function splitEmote(message, emotes) {
  const messageSlice = message;
  let replacedMessage = message;

  for (let emote in emotes) {
    const emoteId = emote;
    const emotePositions = emotes[emote]

    for (let position of emotePositions) {
      const [startsAt, endsAt] = position.split('-')
      const emoteImgURL = imageRender(emoteId)
      const emoteName = getEmotePositionFromMessage(startsAt, endsAt, messageSlice)
      replacedMessage = messageEmoteRender(replacedMessage, emoteName, emoteImgURL)
    }
  }

  return replacedMessage;
}

async function initialLoad() {
  await getBadgeList();
}

initialLoad()

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: 'LucasChatBot',
		password: `oauth:${TOKEN_OAUTH}`
	},
	channels: [ '#lucasarieiv' ]
});
client.connect().catch(console.error);
client.on('message', async (channel, tags, message, self) => {
	if(self) return;

  const [command, ...chatMessage] = message.toLowerCase().split(' ');

  switch (command) {
    case '!themes':
      client.say(channel, `@${tags.username}, mudamos seu tema para @${theme}`);
      break;
    case '!hello':
        client.say(channel, `@${tags.username}, heya!`);
      break;
    default:
      
      const isMod = tags.mod
      const newMessage = splitEmote(message, tags.emotes);

      let userBadges = getUserBadges(tags.badges)
      let badgesImg = badgesImgElements(userBadges);

      const userId = tags['user-id'];
      
      const userInfo = await getUser(userId);
      setUserSub(userId, tags.subscriber)
      const isSub = userInfo.subscriber;
      const userDisplayName = userInfo['display_name'];
      const userProfileImg = userInfo.profile_image_url;
      const userFirstMessage = tags['first-msg'];
      const userColor = tags.color;

      const messageElement = createMessageHTML(userDisplayName, userProfileImg, userColor, newMessage, isMod, badgesImg, userFirstMessage, isSub);
      insertMessageOnContainer(messageElement)
      break;
  }
});

