<template>
  <div class="main">
    <!-- 二级路由 -->
    <!-- include="Home,Menu" Home组件和Menu组件被缓存 -->
   
     
    <keep-alive include="Home,Menu">
      <router-view></router-view>
    </keep-alive>

    <van-tabbar v-model="active" active-color="#0C34BA" :route="true">
      <van-tabbar-item v-for="(item,index) in tabbarData" :key="index" :to="item.url">
        <span>{{item.title}}</span>
        <template #icon="props">
          <img :src="props.active ? item.icon.active : item.icon.inactive" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      tabbarData: [
        {
          title: "首页",
          icon: {
            active: require("../assets/image/12.png"),
            inactive: require("../assets/image/7.png")
          },
          url: {
            name: "Home"
          }
        },
        {
          title: "菜单",
          icon: {
            active: require("../assets/image/13.png"),
            inactive: require("../assets/image/8.png")
          },
          url: {
            name: "Menu"
          }
        },
        {
          title: "购物袋",
          icon: {
            active: require("../assets/image/15.png"),
            inactive: require("../assets/image/10.png")
          },
          url: {
            name: "Shopbag"
          }
        },
        {
          title: "我的",
          icon: {
            active: require("../assets/image/16.png"),
            inactive: require("../assets/image/11.png")
          },
          url: {
            name: "My"
          }
        }
      ]
    };
  }
};
</script>

<style lang="less" scoped>
.main {
  padding-bottom: 50px;
}
</style>