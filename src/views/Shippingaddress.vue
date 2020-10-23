<template>
  <div class="my-address">
    <van-nav-bar title="地址管理" left-text="返回" left-arrow :fixed="true" @click-left="back" />
    <div class="address-bg"></div>
    <div class="address-box">
      <div v-if="list.length>0">
        <van-address-list
          v-model="chosenAddressId"
          :list="list"
          default-tag-text="默认"
          @add="newAddress"
          @edit="onEdit"
        />
      </div>
      <div v-else>
        <van-empty description="没有地址,赶紧去添加一个吧">
          <van-button round class="bottom-button" @click="newAddress">添加地址</van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/shippingaddress.less";
export default {
  data() {
    return {
      chosenAddressId: "",
      //地址列表数据
      list: []
    };
  },
  created() {
    //查询收货地址
    this.getReceiveAddress();
  },

  methods: {
    back() {
      this.$router.go(-1);
    },
    // 新增地址
    newAddress() {
      this.$router.push({
        name: "NewAddress"
      });
    },
    // 编辑地址
    onEdit(item) {
      this.$router.push({
        name: "NewAddress",
        query: {
          aid: item.id
        }
      });
    },
    //查询收获地址
    getReceiveAddress() {
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
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString
        }
      })
        .then(result => {
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
              });
            });
          }
        })
      
    }
  }
};
</script>

