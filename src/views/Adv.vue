<template>
  <div>
    <van-button
      @click="goHome"
      round
      color="linear-gradient(to right, #505acb, #64299f)"
      
    >跳过 {{num}}s</van-button>
    <img
      src="https://img.zcool.cn/community/0186d8575183f66ac72525ae4a674e.jpg@2o.jpg"
      alt
      class="bg"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      num: 15,
      cleardata: null
    };
  },
  methods: {
    goHome() {
      this.$router.push({
        name: "Home"
      });
    }
  },
  created() {
    // 倒计时
    this.cleardata = setInterval(() => {
      if (this.num == 0) {
        // 跳转首页
        this.$router.push({
          name: "main/home"
        }); //跳转首页
      } else {
        this.num--;
      }
    }, 1000);

    // //隐藏导航
    // this.$store.state.main = false;
  },
  // 切换组件生周期钩子，销毁函数
  beforeDestroy() {
    // this.$store.state.main = true;
    // 当路由器切换时候，关闭定时器
    clearInterval(this.cleardata);
  }
};
</script>

<style lang="less" scoped>
html,
body {
  width: 100%;
  height: 100%;
}

.bg {
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.van-button {
  position: absolute;
  top: 15px;
  right: 20px;
}
</style>