<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* #app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
} */
#app {
  padding-bottom: 50px;
  margin:0;
  padding:0;
}
html,body,#app {
  width: 100%;
  height: 100%;
}
body {
  position:relative;
  font-family: PingFangSC-Regular, sans-serif;
  margin:0;
  padding:0;
}
</style>
