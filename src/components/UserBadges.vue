<template>
  <div class="badges" >
    <img v-for="badge in badges" :key="badge" :src="badge" alt="Badge">
  </div>
</template>

<script>
export default {
  name: 'UserBadges',
  props: {
    badges: {
      required: false,
      type: []
    }
  }
}
</script>

<style>
img {
  display: inline-block;
  margin-right: 4px;
}
</style>