<template>
  <div class="pay">
    <van-nav-bar title="提交订单" left-text="返回" left-arrow :fixed="true" @click-left="back" />

    <div class="address-bg">
      <div class="clearfix open" @click="openAddress">
        <div class="fl address-title">选择收货地址</div>
        <div class="fl arrow-box">
          <van-icon name="arrow" class="arrow-icon" />
        </div>
      </div>
      <div class="address-content">
        <div class="clearfix">
          <div class="fl name">{{currentAddress.name}}</div>
          <div class="fl phone">{{currentAddress.tel}}</div>
        </div>
        <div class="address-info">{{currentAddress.address}}</div>
      </div>
    </div>
    <div class="address-box">
      <div class="order-title">商品列表</div>
      <div class="left-box left"></div>
      <div class="left-box right"></div>
      <div>
        <div class="clearfix cell-box" v-for="(item,index) in shopbagData" :key="index">
          <div class="fl pro-img">
            <img :src="item.small_img" alt class="auto-img" />
          </div>
          <div class="fl pro-info">
            <div class="text-box">
              <div class="clearfix">
                <div class="fl text-name">{{item.name}}</div>
                <div class="fl text-rule">{{item.rule}}</div>
              </div>
              <div class="text-enname">{{item.enname}}</div>
            </div>
            <div class="price-box">
              <div class="fl price">{{item.price}}</div>
              <div class="fr count">{{item.count}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="pro-box">
        <div class="clearfix pro-boxing">
          <div class="fl pro-count">共计 {{product.count}}件商品</div>
          <div class="fr pro-total">合计 ￥{{product.total}}</div>
        </div>
        <div class="lefts-box lefts"></div>
        <div class="lefts-box rights"></div>
      </div>
    </div>

    <div class="bottom">
      <div class="clearfix pay-boxing">
        <div class="fl pay-price">合计 ￥2</div>
        <div class="fr pay-button">
          <van-button round @click="pay">去支付</van-button>
        </div>
      </div>
    </div>
    <van-popup v-model="isOpen" position="bottom" closeable>
      <div class="address-title-box">选择收货地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="selectAddress"
        @add="newAddress"
        color="#4b70e9"
      />
    </van-popup>
  </div>
</template>

<script>
import "../assets/less/pay.less";
import { utils } from "../assets/js/utils";
export default {
  data() {
    return {
      //选择地址数据
      currentAddress: {
        name: "",
        tel: "",
        address: ""
      },
         //购物袋数据
        shopbagData: [],
      list: [],
      chosenAddressId: "",
      isOpen: false,
      product: {
        count: 0,
        total: 0
      },
      sids: []
    };
  },

  created() {
    this.sids = this.$route.query.sids.split("-");

    this.getReceiveAddress();

    this.getShopbagDataBySids();
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    openAddress() {
      this.isOpen = true;
    },

    // 支付
    pay() {
      //判断是否选择地址
      if (this.chosenAddressId == "") {
        this.$toast("请选择收货地址");
        return;
      }

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(this.sids),
        phone: this.currentAddress.tel,
        address: this.currentAddress.address,
        receiver: this.currentAddress.name
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/pay",
        data
      }).then(result => {
        this.$toast.clear();

        this.$toast(result.data.msg);
        if (result.data.code == 60000) {
          this.$router.push({ name: "Order" });
        }
      });
    },
    // 新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },
    //选择地址
    selectAddress(item) {
      this.isOpen = false;

      for (let key in this.currentAddress) {
        this.currentAddress[key] = item[key];
      }
    },

    // 查询收货地址
    getReceiveAddress() {
        //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return;
        }
        
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method: 'GET',
          url: '/findAddress',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 20000) {
            
            result.data.result.map(v => {
              let address = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address,
                isDefault: Boolean(v.isDefault)
              })

        

            })
          }
          
        })

      },
    //根据sids查询购物袋数据
    getShopbagDataBySids() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "GET",
        url: "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids)
        }
      }).then(result => {
        this.$toast.clear();

        if (result.data.code == 50000) {
          if (result.data.result.length === 0) {
            return this.$router.push({ name: "Menu" });
          }

          result.data.result.map(v => {
            this.product.count += v.count;
            this.product.total += v.count * v.price;
          });

          this.shopbagData = result.data.result;
        }
      });
    }
  }
};
</script>

