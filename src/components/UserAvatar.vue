<template>
  <div class="avatar-image">
    <div class="image-box">
      <img :src="imageURL" :alt="imageAlt">
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserAvatar',
  props: {
    imageAlt: {
      required: false,
      type: String,
      default: 'User avatar'
    },
    imageURL: {
      required: true,
      type: String,
      default: 'https://www.infoescola.com/wp-content/uploads/2010/11/pinguim-real_103683425.jpg'
    }
  }
}
</script>

<style scoped>
  .avatar-image {
    position: absolute;
    transform: translate(-25%, -20%);
    width: 56px;
    height: 56px;
    border: 2px solid #6441A5;
    background: transparent;
    border-radius: 50%;
    transform-origin: center;
    animation: avatarAnimation 700ms linear;
  }

  .image-box {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
  }

  img {
    width: 48px;
  }
</style>