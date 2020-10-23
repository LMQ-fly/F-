<template>
  <div id="app">
     
    <router-view />
  </div>
</template>
<style lang="less">
body{
    background-color: #f5f5f5;
  }
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .fl{
    float: left;
  }
  .fr{
    float: right;
  }
  .clearfix::after{
    content: "";
    display: block;
    clear: both;
  }

  .auto-img{
    width: 100%;
    display: block;
  }
  /deep/ .van-button--danger {
    color: #fff;
    background-color: #5c82ef;
    border: 0.02667rem solid #5c82ef;
  }
   .one-text{
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }



</style>
