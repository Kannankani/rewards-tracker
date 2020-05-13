<template>
  <div class="HomeContent">
    <Redeem/>
    <Rewards/>
  </div>
</template>


<script>
import Rewards from '../components/Rewards'
import Redeem from '../components/Redeem'
export default {
  name: "HomeContent",
  components: {
    Rewards,
    Redeem
  }
};
</script>
