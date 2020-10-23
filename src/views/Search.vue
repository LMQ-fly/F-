<template>
  <div class="search">
    <div class="menu-se clearfix">
      <div class="scan fl" @click="back">
        <img src="../assets/image/left.png" alt class="auto-img" />
      </div>
      <div class="menu-search fl">
        <van-search placeholder="请输入搜索关键词" v-model="value" />
      </div>
      <div class="vedio fr" @click="onSearch">搜索</div>
    </div>
    <div class="like-box" v-if="show">
      <div class="product-box clearfix">
        <div class="product-item fl" v-for="(item, index) in searchlist" :key="index">
          <van-card origin-price="36.00">
            <template #thumb>
              <van-tag plain>
                <img class="auto-img" :src="item.smallImg" alt />
              </van-tag>
            </template>
            <template #title>
              <van-tag plain>
                <div class="title">{{item.name}}</div>
                <div class="desc">{{item.enname}}</div>
              </van-tag>
            </template>
            <template #price>
              <van-tag plain>
                <div class="price">{{item.price}}</div>
              </van-tag>
            </template>
            <template #num>
              <van-tag plain>
                <div class="num" @click="look(item.pid)">点击查看</div>
              </van-tag>
            </template>
          </van-card>
        </div>
      </div>
    </div>
    <div class="hidden" v-else>
      <van-empty description="输入关键词,搜你喜欢"></van-empty>
    </div>
  </div>
</template>

<script>
import "../assets/less/search.less";
export default {
  data() {
    return {
      value: "",
      searchlist: [],
      show: false
    };
  },
  methods: {
    back() {
      this.$router.push({ name: "Menu" });
    },
    //搜索
    onSearch() {
      this.show = true;
      this.searchlist = [];
      if (this.value == "") {
        this.$notify({ background: "#547bec", message: "请输入关键字" });
        this.show = false;
        return;
      }

      let params = {
        appkey: this.appkey,
        name: this.value
      };

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "GET",
        url: "/search",
        params
      }).then(result => {
        this.$toast.clear();
        if (result.data.code == "Q001") {
          this.searchlist = result.data.result;
          if (this.searchlist.length == 0) {
            this.$notify({ background: "#547bec", message: "未找到相关商品" });
            this.show = false;
            return;
          }
        }
      });
    },
    // 查看详情
    look(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    }
  }
};
</script>

