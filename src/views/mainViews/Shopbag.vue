<template>
  <div class="shopbag">
    <van-nav-bar
      title="购物袋"
      left-text="返回"
      left-arrow
      :right-text="isEdit ? '完成' : '编辑'"
      :fixed="true"
      @click-right="editProduct"
      @click-left="goback"
    >
      <template #right v-if="shopbagData.length > 0">
        <div>{{isEdit ? '完成' : '编辑'}}</div>
      </template>
    </van-nav-bar>
    <div v-if="shopbagData.length > 0">
      <van-swipe-cell :disabled="!isEdit" v-for="(item, index) in shopbagData" :key="index">
        <van-cell :border="false">
          <div class="clearfix cell-box">
            <div class="fl check">
              <van-checkbox
                v-model="item.isCheck"
                icon-size="24px"
                checked-color="#4c72e8"
                @change="simpleSelect"
              ></van-checkbox>
            </div>
            <div class="fl pro-img">
              <img :src="item.small_img" alt class="auto-img" />
            </div>
            <div class="fl pro-info">
              <div class="text-box">
                <div class="cleaxfix">
                  <div class="text-name fl">{{item.name}}</div>
                  <div class="text-role fl">{{item.rule}}</div>
                  <br />
                </div>
                <div class="text-title">{{item.tenname}}</div>
              </div>
              <div class="price-box">
                <div class="price fl">
                  ￥{{item.
                  price}}
                </div>
                <div class="fr">
                  <van-stepper
                    v-model="item.count"
                    theme="round"
                    button-size="24"
                    disable-input
                    @change="modifyCount(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </van-cell>
        <template #right>
          <van-button square color="#3D75FE" text="删除" @click="del(item.sid)" />
        </template>
      </van-swipe-cell>
    <van-submit-bar
      :price="total"
      button-text="提交订单"
      button-color="#4c72e8"
      v-show="!isEdit"
      @submit="addpay"
    >

      <van-checkbox v-model="checked" checked-color="#4c72e8" @click="allSelect">全选</van-checkbox>
    </van-submit-bar>
    <van-submit-bar v-show="isEdit" button-text="删除选择" button-color="#4c72e8" @submit="delAll">
      <van-checkbox v-model="checked" icon-size="24px" checked-color="#4c72e8" @click="allSelect">全选</van-checkbox>
    </van-submit-bar>
    </div>

      <div v-else>
      <van-empty description="购物袋空空如也,去逛一逛!">
        <van-button round color="#5075e9" class="bottom-button" @click="goMenu">去逛一逛</van-button>
      </van-empty>
    </div>

  </div>
</template>

<script>
import "../../assets/less/shopbag.less";
import { utils } from "../../assets/js/utils";
export default {
  data() {
    return {
      isEdit: false,
      checked: false,
      shopbagData: [],
      total: 0
    };
  },

  created() {
    console.log("shopbag");
    this.findShopbag();
  },
  methods: {
    // 编辑商品
    editProduct() {
      this.isEdit = !this.isEdit;
    },
    // 全选
    allSelect() {
      this.shopbagData.map(v => {
        v.isCheck = this.checked;
      });
      this.sum();
    },
    //单选
    simpleSelect() {
      this.sum();
      for (let i = 0; i < this.shopbagData.length; i++) {
        if (!this.shopbagData[i].isCheck) {
          this.checked = false;
          return;
        }
      }
      this.checked = true;
    },
    //查询购物袋数据
    findShopbag() {
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
        url: "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
          this.$toast.clear();
          console.log("find shopcartbag result ==> ", result);
          if (result.data.code == 5000) {
            result.data.result.map(v => {
              v.isCheck = false;
            });
            this.shopbagData = result.data.result;
          } else {
            this.$$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err==>", err);
        });
    },
    //修改商品数量
    modifyCount(item) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sid: item.sid,
        count: item.count
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/modifyShopcartCount",
        data
      })
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          this.sum();
          if (result.data.code !== 6000) {
            this.$toast(result.data.msg);
          }
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    //删除购物袋数据
    removeShopbag(sids) {
      //sids: sid的集合，类型：array

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(sids)
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      return this.axios({
        method: "POST",
        url: "/deleteShopcart",
        data
      });
    },

    //单个删除购物袋
    del(sid, index) {
      this.removeShopbag([sid])
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          if (result.data.code == 7000) {
            this.shopbagData.splice(index, 1);
          }

          this.$toast(result.data.msg);

          this.sum();
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    //删除多个购物袋
    delAll() {
      //查找选择购物袋
      let sids = [];
      this.shopbagData.map(v => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      this.removeShopbag(sids)
        .then(result => {
          this.$toast.clear();
          console.log("result ==> ", result);
          if (result.data.code == 7000) {
            for (let i = this.shopbagData.length - 1; i >= 0; i--) {
              if (this.shopbagData[i].isCheck) {
                this.shopbagData.splice(i, 1);
              }
            }

            this.sum();
          }

          this.$toast(result.data.msg);
        })
        .catch(err => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
    // 计算总数
    sum() {
      this.total = 0;
      this.shopbagData.map(v => {
        if (v.isCheck) {
          this.total += v.count * v.price;
        }
      });
      this.total *= 100;
    },
    // 立即购买
    addpay() {
      //查找需要购买的商品, sid
      let sids = [];
      this.shopbagData.map(v => {
        if (v.isCheck) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast("请选择购买商品");
        return;
      }

      sids = sids.join("-");

      this.$router.push({ name: "Pay", query: { sids } });
    },
    // 返回上一级
    goback() {
      this.$router.go(-1);
    },
    goMenu(){
      this.$router.push({
        name:'Menu'
      })
    }
  }
};
</script>

