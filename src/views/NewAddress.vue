<template>
  <div class="new-address">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="back"
    />

    <van-address-edit
      :area-list="areaList"
      show-postal
      :show-delete="!!aid"
      show-set-default
      show-search-result
      :address-info="addressInfo"
      :area-columns-placeholder="['请选择', '请选择', '请选择']"
      @save="onSave"
      @delete="onDelete"
    />
  </div>
</template>

<script>
import "../assets/less/newAddress.less";
import areaList from "../assets/js/arealist";
import { utils } from "../assets/js/utils";

export default {
  data() {
    return {
      areaList,
      addressInfo: {
        id: "",
        name: "",
        tel: "",
        province: "",
        city: "",
        county: "",
        addressDetail: "",
        areaCode: "",
        postalCode: "",
        isDefault: false
      },

      aid: ""
    };
  },
  created() {
    //获取aid
    this.aid = this.$route.query.aid;

    if (this.aid) {
      this.getAddressDataByAid();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },
    //新增地址
    newAddress(address) {
      let content = Object.assign({}, address);

      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      delete content.id;
      delete content.country;

      content.isDefault = Number(content.isDefault);

      content.appkey = this.appkey;
      content.tokenString = tokenString;

      //参数序列化
      let data = utils.queryString(content);

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/addAddress",
        data
      }).then(result => {
        this.$toast.clear();

        this.$toast(result.data.msg);
        if (result.data.code == 9000) {
          setTimeout(() => {
            this.$router.go(-1);
          }, 2000);
        }
      });
    },
    //编辑地址
    editAddress(content) {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      //判断地址是否被修改
      let isModify = false;
      for (let key in this.addressInfo) {
        if (this.addressInfo[key] != content[key]) {
          //已经被修改
          isModify = true;
          break;
        }
      }

      if (isModify) {
        //发起修改地址请求

        //复制对象
        let addressData = Object.assign({}, content);
        delete addressData.country;
        delete addressData.id;
        addressData.aid = this.aid;

        addressData.tokenString = tokenString;
        addressData.appkey = this.appkey;
        addressData.isDefault = Number(addressData.isDefault);

        //序列化参数
        let data = utils.queryString(addressData);

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
          loadingType: "spinner"
        });

        this.axios({
          method: "POST",
          url: "/editAddress",
          data
        })
          .then(result => {
            this.$toast.clear();

            this.$toast(result.data.msg);
            if (result.data.code == 30000) {
              setTimeout(() => {
                this.$router.push({ name: "Address" });
              }, 1000);
            }
          })
     
      } else {
        this.$router.push({ name: "Address" });
      }
    },
    // 保存
    onSave(address) {
      if (this.aid) {
        this.editAddress(address);
      } else {
        this.newAddress(address);
      }
    },
    //根据aid查询地址数据
    getAddressDataByAid() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "GET",
        url: "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid
        }
      }).then(result => {
        this.$toast.clear();

        if (result.data.code == 40000) {
          for (let key in this.addressInfo) {
            if (key == "id") {
              this.addressInfo[key] = result.data.result[0].aid;
              continue;
            }

            this.addressInfo[key] =
              key == "isDefault"
                ? Boolean(result.data.result[0][key])
                : result.data.result[0][key];
          }
        }
      });
    },
    // 删除
    onDelete() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      //参数序列化
      let data = utils.queryString({
        appkey: this.appkey,
        tokenString,
        aid: this.aid
      });

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner"
      });

      this.axios({
        method: "POST",
        url: "/deleteAddress",
        data
      }).then(result => {
        this.$toast.clear();

        this.$toast(result.data.msg);
        if (result.data.code == 10000) {
          setTimeout(() => {
            this.$router.push({ name: "Address" });
          }, 1000);
        }
      });
    }
  }
};
</script>

