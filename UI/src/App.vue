<template>
  <div id="app" class="d-flex flex-column h-100">
    <nav-bar />
    <div class="container flex-grow-1">
      <error />
      <div class="mt-5">
        <router-view />
      </div>
    </div>

    <!-- commenting footer

    <footer class="bg-light text-center p-3">
      <div class="logo"></div>
      <p>
        Sample project provided by
        <a href="https://auth0.com">Auth0</a>
      </p>
    </footer>

    -->

  </div>
</template>

<script>
import NavBar from "./components/NavBar";
import Error from "./components/Error";

export default {
  components: {
    NavBar,
    Error
  }
};
</script>
