<template>
  <div>
    <div v-if="!$auth.isAuthenticated">
      <hero />
      <hr />
    </div>
    <div v-if="$auth.isAuthenticated">
      <home-content />
    </div>
  </div>
</template>

<script>
import Hero from "../components/Hero";
import HomeContent from "../components/HomeContent";

export default {
  name: "home",
  components: {
    Hero,
    HomeContent
  }
};
</script>

<style lang="scss" scoped>
.next-steps {
  .fa-link {
    margin-right: 5px;
  }
}
</style>
