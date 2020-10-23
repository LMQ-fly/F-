<template>
  <div class="home">
    <van-nav-bar :fixed="true">
      <template #left>
        <div class="home-title">
          {{timeText}}
          <span>,007</span>
        </div>
      </template>
      <template #right>
        <van-search placeholder="请输入商品名称" shape="round" />
      </template>
    </van-nav-bar>
    <div class="banner-box">
      <van-swipe :autoplay="5000" :show-indicators="false">
        <van-swipe-item v-for="(item, index) in bannerData" :key="index">
          <img class="auto-img" :src="item.bannerImg" alt @click=" Prouctinfo(item.pid)" />
        </van-swipe-item>
      </van-swipe>
    </div>
         
    <div class="hot-product">
      <div class="now-title">今日TOP</div>
    </div>
    <div class="now-top">
      <div class="now-box clearfix">
        <div
          class="now-item fl"
          v-for="(item,index) in hotProducts"
          :key="index"
          :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
        >
          <div class="p-img">
            <img :src="item.smallImg" alt class="auto-img" @click=" Prouctinfo(item.pid)" />
          </div>
          <div class="now-name">{{item.name}}</div>
          <div class="clearfix">
            <div class="now-price fl">￥{{item.price}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "../../assets/less/home.less";

export default {
  data() {
    return {
      timeText: "",
      bannerData: [],
      hotProducts: [],
     
 
    };
  },
  created() {
    console.log("ccc");
    this.getTime();
    this.getbannerData();
    this.getHotProducts();
  },
  methods: {
    getTime() {
      let hours = new Date().getHours();
      console.log(hours);
      if (hours >= 6 && hours < 12) {
        this.timeText = "早上好";
      } else if (hours >= 12 && hours < 18) {
        this.timeText = "下午好";
      } else if (hours >= 18 && hours < 24) {
        this.timeText = "晚上好";
      } else {
        this.timeText = "深夜好";
      }
    },
    //获取banner
    getbannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });
      this.axios({
        method: "GET",
        url: "/banner",
        //如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    // 跳转到详情页面
    Prouctinfo(pid) {
      this.$router.push({
        name: "Detail",
        query: { pid }
      });
    },
    //获取推荐商品数据
    getHotProducts() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        //如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          if (result.data.code == 500) {
            this.hotProducts = result.data.result;
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

  

  }
};
</script>
