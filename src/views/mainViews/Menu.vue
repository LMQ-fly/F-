<template>
  <div class="menu">
    <div class="menu-search">
      <van-nav-bar :fixed="true" left-text="返回" left-arrow>
        <template #right>
          <van-search placeholder="请搜索商品" shape="round"
          @click="search" />
        </template>
      </van-nav-bar>
    </div>
    <div class="menu-box">
      <div class="left-product">
        <ul class="menu-list">
          <li
            v-for="(item, index) in typeData"
            :key="index"
            @click="toggleType(item)"
            class="text"
            :class="{active: item.isActive}"
          >{{item.typeDesc}}</li>
        </ul>
        <div class="right-product">
          <van-skeleton :row="6" :loading="isLoading">
            <div
              class="product-list"
              :class="{'not-first': index > 0}"
              v-for="(item, index) in products"
              :key="index"
              @click=" detail(item.pid)"
            >
              <div class="pro-box">
                <div class="pro-img">
                  <img class="auto-img" :src="item.smallImg" alt />
                </div>
                <div class="pro-info">
                  <div class="pro-text fl">
                    <div class="ch-name">{{item.name}}</div>
                    <div class="en-name">{{item.enname}}</div>
                  </div>
                  <div class="pro-price fr">￥{{item.price}}</div>
                </div>
              </div>
            </div>
          </van-skeleton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../../assets/less/menu.less";
export default {
  //组件名称
  name: "Menu",
  data() {
    return {
      typeData: [],
      products: [],

      //是否显示骨架屏
      isLoading: true
    };
  },
  created() {
    this.getTypeData();
  },
  methods: {
    //获取商品类型数据
    getTypeData() {
      console.log("load");
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });
      this.axios({
        method: "GET",
        url: "/type",
        //如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
        params: {
          appkey: this.appkey
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("... result ==> ", result);
          if (result.data.code == 400) {
            let iconData = [
              {
                type: "latte"
              },
              {
                type: "coffee"
              },
              {
                type: "rena_ice"
              }
            ];

            result.data.result.map(v => {
              for (let i = 0; i < iconData.length; i++) {
                if (v.type == iconData[i].type) {
                  v.isActive = false;
                  break;
                }
              }
            });

            result.data.result.unshift({
              type: "isHot",
              typeDesc: "推荐",
              isActive: true
            });

            this.typeData = result.data.result;

            //根据商品类型获取商品数据
            this.getProductsByType(this.typeData[0]);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    //切换商品类型
    toggleType(item) {
      if (item.isActive) {
        return;
      }

      this.isLoading = true;

      for (let i = 0; i < this.typeData.length; i++) {
        if (this.typeData[i].isActive) {
          this.typeData[i].isActive = false;
          break;
        }
      }
      item.isActive = true;

      //根据商品类型获取商品数据
      this.getProductsByType(item);
    },
    //根据商品类型获取商品数据
    getProductsByType(item) {
      this.products = [];
      // console.log('item ==> ', item);

      //如果存在缓存数据,则在缓存获取商品数据,不发起请求
      let data = sessionStorage.getItem(item.type);
      if (data) {
        this.isLoading = false;
        console.log("存在缓存数据");
        this.products = JSON.parse(data);

        return;
      }

      console.log("不存在缓存数据");

      let params = {
        key: "type",
        value: item.type,
        appkey: this.appkey
      };

      if (item.type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      }

      console.log("params ==> ", params);

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
        params
      })
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          if (result.data.code == 500) {
            this.isLoading = false;

            this.products = result.data.result;

            //将商品数据缓存
            sessionStorage.setItem(item.type, JSON.stringify(this.products));
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    //查看商品详情
    detail(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
      search(){
      this.$router.push({
        name:'Search'
      })
    }
  }
};
</script>

