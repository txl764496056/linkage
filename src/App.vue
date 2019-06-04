<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import './scss/base.scss';
*{margin:0;padding:0;box-sizing:border-box;}
button:focus{
  outline: none;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color:$color-black-4;
  background-color:$color-gray-15;
  min-height:100vh;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: $color-black-4;
    &.router-link-exact-active {
      color: $color-theme;
    }
  }
}

// 图标高亮
  .light-red{
      &:hover{color:$color-red-15;}
  }
</style>
