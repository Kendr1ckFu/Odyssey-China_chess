<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created () {
    this.resize()
    document.body.onresize = this.resize
  },
  methods: {
    resize () {
      let clientWidth = document.body.clientWidth
      let width = clientWidth / 750 * 100
      if (width > 100) {
        width = 100
      } else if (width < 32) {
        width = 32
      }
      document.querySelector('html').style.fontSize = width + 'px'
    }
  }
}
</script>

<style>
body {
  user-select: none;
  margin: 0;
  padding: 0;
  align-items: center;
  position:relative;
  min-width: 1000px;
  max-height: 713px;
  height: 600px;
  background-image: url("./assets/images/ink.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -moz-background-size: cover;
}
</style>
