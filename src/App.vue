<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center w-100">
    <div class="w-75 w-lg-80 align-self-center">   
      <NavBar />
      <main>
        <router-view />
      </main>
      <FooTer />
    </div>
  </div>

</template>

<script setup>
  import NavBar from "./components/NavBar.vue";
  import FooTer from "./components/FooTer.vue"
</script>


<style scoped>

@media (max-width: 768px) {
  body {
    background: lightgray;
	  }
}

</style>


