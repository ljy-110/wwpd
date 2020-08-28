<template>
<div>
  <div class="box">
    <ul :model="userInfo">
      <li class="user-li">
        <div class="li-left" style="width:24%">用户名：</div>
        <div class="li-center">{{userInfo.account}}</div>
        <div class="li-right" style="width:30%">
          <van-button type="info" @click="changePassword" size="small">修改密码</van-button>
        </div>
      </li>
      <li class="user-li">
        <div class="li-left" style="width:34%">微信收款码：</div>
        <div class="li-center">
          <img @click="getAccountQCcode" src="../images/code.png" alt="" style="width:25px;">
          <van-dialog v-model="showImg" title="收款二维码" show-cancel-button>
            <img :src="codeImg" style="width:100%" />
          </van-dialog>
        </div>
        <div class="li-right" style="width:30%">
          <van-uploader :after-read="afterRead" style="width:100%">
            <van-button size="small" type="info" style="width:100%">重新上传</van-button>
          </van-uploader>
        </div>
      </li>
      <li class="user-li">
        <div class="li-left" style="width:38%">支付宝收款码：</div>
        <div class="li-center">
          <img @click="getAccountQCcodezfb" src="../images/code.png" alt="" style="width:25px;">
          <van-dialog v-model="showImgzfb" title="收款二维码" show-cancel-button>
            <img :src="codeImgzfb" style="width:100%" />
          </van-dialog>
        </div>
        <div class="li-right" style="width:30%">
          <van-uploader :after-read="afterReadzfb" style="width:100%">
            <van-button size="small" type="info" style="width:100%">重新上传</van-button>
          </van-uploader>
        </div>
      </li>
      <li class="user-li">
        <div class="li-left" style="width:30%">收款账号：</div>
        <div class="li-center">
          <img @click="getBankCardInfo" src="../images/yl.png" alt="" style="width:32px;">
        </div>
        <div class="li-right" style="width:30%">
          <van-button type="info" size="small" @click="cards">编辑</van-button>
        </div>
        <van-dialog v-model="show" title="收款账号" show-cancel-button>
            <van-cell-group>
              <van-cell title="持卡人" :value="bank_user_name" />
              <van-cell title="银行卡号" :value="bank_card" />
              <van-cell title="开户银行" :value="bank_type" />
            </van-cell-group>
        </van-dialog>
      </li>
      <li class="user-li">
        <div class="li-left" style="width:30%">结算单价：</div>
        <div class="li-center">
          <span v-if="price">{{userInfo.price}}</span>
        </div>
        <div class="li-right" style="width:30%">
          <van-button @click="price = !price" type="info" size="small">显示/隐藏</van-button>
        </div>
      </li>
    </ul>
  </div>
  <div :model='userNum'>
    <div class="user-num">
    <table class="num-ta1 user-tb1-tr">
      <tr>
        <td class="ta1-aa">直接派单数</td>
        <td class="ta1-bb">
          <span v-if="userNum.direct_finish_num">{{userNum.direct_finish_num}}</span>
          <span v-else>0</span>
        </td>
      </tr>
      <tr>
        <td class="ta1-aa">下线派单数</td>
        <td class="ta1-bb">
          <span v-if="userNum.low_finish_num">{{userNum.low_finish_num}}</span>
          <span v-else>0</span>
        </td>
      </tr>
      <tr>
        <td class="ta1-aa">派单总数</td>
        <td class="ta1-bb">{{userNum.total_finish_num}}</td>
      </tr>
    </table>
  </div>
  <div class="user-num">
    <table class="num-ta1">
      <tr>
        <td class="ta2-aa">上级未结算总数</td>
        <td class="ta2-bb">{{userNum.clear_before}}</td>
        <td class="ta2-cc">{{userNum.clear_newest}}</td>
      </tr>
      <tr>
        <td class="ta2-aa">给下级未结算总数</td>
        <td class="ta2-bb">{{userNum.lower_no_clear}}</td>
        <td class="ta2-cc"></td>
      </tr>
    </table>
  </div>
  </div>
  
</div>
</template>

<script>
export default {
  data () {
    return {
      price: false,
      userInfo: {
        account: '',//用户名
        price: '',//单价
      },
      show: false,
      showImg: false,
      showImgzfb: false,
      bank_user_name: '',//持卡人
      bank_card: '',//银行卡账号
      bank_type: '',//开户银行
      userNum:{},
      codeImg:'',
      codeImgzfb: ''
    }
  },
  created(){
    this.getAccountInfo()
  },
  methods: {
    changePassword () {
      this.$router.push('/index/resetpwd')
    },
    async getAccountInfo(){//用户信息
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid
      }
      let res = await this.$api.teaback.getAccountInfo(params)
      // console.log(res)
      this.userInfo.account = res.accountInfo.account
      this.userInfo.price = res.accountInfo.price
      this.userInfo.bank_card = res.accountInfo.bank_card
      this.userNum = res.accountInfo
    },
    async afterRead(data) {//上传二维码
      let img_kind = data.file;
      let accountid = localStorage.getItem('accountid')
      // console.log(img_kind);
      let formData = new FormData();
      formData.append("account_id",accountid);
      formData.append("file", img_kind);
      console.log(formData.get('file'),formData.get('account_id'))
      let that = this
      that.$axios({
          method: 'post',
          // url: 'http://192.168.101.153:9000/wxcrm/uploadAccountQCcode',
          url: `${this.$baseUrl}/wxcrm/uploadAccountQCcode`,
          headers:{'Content-Type': 'multipart/form-data'},
          data: formData
      }).then((response) => {
          // console.log(response)
          if(response.data.ret) {
              this.$toast.success('上传成功')
          }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
              this.$toast.fail(response.data.msg+'失败')
          }
      })
      .catch((e) => {
          this.$message.fail('上传失败')
      })
      },
    async afterReadzfb(data) {//上传支付宝二维码
      let img_kind = data.file;
      let accountid = localStorage.getItem('accountid')
      // console.log(img_kind);
      let formData = new FormData();
      formData.append("account_id",accountid);
      formData.append("file", img_kind);
      // console.log(formData.get('file'),formData.get('account_id'))
      let that = this
      that.$axios({
          method: 'post',
          // url: 'http://192.168.101.153:9000/wxcrm/uploadAccountQCcode',
          url: `${this.$baseUrl}/wxcrm/uploadzfbQCcode`,
          headers:{'Content-Type': 'multipart/form-data'},
          data: formData
      }).then((response) => {
          // console.log(response)
          if(response.data.ret) {
              this.$toast.success('上传成功')
          }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
              this.$toast.fail(response.data.msg+'失败')
          }
      })
      .catch((e) => {
          this.$message.fail('上传失败')
      })
      },
      async getAccountQCcode(){//查看微信二维码
        let accountid = localStorage.getItem('accountid')
        let params = {
          account_id: accountid
        }
        let res = await this.$api.teaback.getAccountQCcode(params)
        // console.log(res)
        if(res.ret === true){
                let bytes = new Uint8Array(res.photo.data);
                let data = "";
                let len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                　　data += String.fromCharCode(bytes[i]);
                }
                let image = "data:image/png;base64," + window.btoa(data);
                this.codeImg = image
                this.showImg = true
            }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
                this.$toast.fail('该用户还没有上传收款码');
            }
      },
      async getAccountQCcodezfb(){//查看支付宝二维码
        let accountid = localStorage.getItem('accountid')
        let params = {
          account_id: accountid
        }
        let res = await this.$api.teaback.getzfbQCcode(params)
        // console.log(res)
        if(res.ret === true){
                let bytes = new Uint8Array(res.zfb_photo.data);
                let data = "";
                let len = bytes.byteLength;
                for (let i = 0; i < len; i++) {
                　　data += String.fromCharCode(bytes[i]);
                }
                let image = "data:image/png;base64," + window.btoa(data);
                this.codeImgzfb = image
                this.showImgzfb = true
            }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
                this.$toast.fail('该用户还没有上传收款码');
            }
      },
      cards(){
        this.$router.push('/index/cards')
      },
      async getBankCardInfo(){//点击查看银行卡信息
        let accountid = localStorage.getItem('accountid')
        let params = {
          account_id: accountid
        }
        let res = await this.$api.teaback.getBankCardInfo(params)
        // console.log(res)
        if(res.ret === true){
          this.show = true;
          this.bank_user_name = res.bank_user_name
          this.bank_card = res.bank_card
          this.bank_type = res.bank_type
        }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
          this.$dialog.alert({
            message: '该账户还没有绑定银行卡，是否前往绑定？',
            showCancelButton: true,
            width: 300
          })
            .then(() => {
              this.$router.push('/index/cards')
            })
            .catch(() => {
              this.$toast('你取消了')
            })
            }
        

      }
  }
}
</script>

<style lang="stylus" scoped>
.box{
  width 100%
  height 100%
  overflow-x: hidden;
}
ul{
  padding-top 20px
  width 100%
}
.user-li{
  width 80%
  display flex
  justify-content space-between
  padding 10px 30px 10px 30px
}
.li-right button{
  width 90%
  background-color #169BD5
}
/deep/ .van-uploader__upload{
  width: 40px
  height: 40px
  margin: 0
}
.user-num{
  width 100%
  display flex
  justify-content center
  overflow-x: hidden;
}
.user-num tr{
  display flex
  width 100%
  justify-content center
  border 1px solid #ccc
}
.user-num tr:nth-child(2),
.user-num tr:nth-child(3){
  border-top 0;
}
.num-ta1{
  width 100%
  padding 30px 40px 10px 30px
}
.user-tb1-tr tr{
  border-right 0
}
tr td{
  text-align center
}
tr td:nth-child(1),
tr td:nth-child(2){
  border-right 1px solid #ccc
}
.num-ta1 tr .ta1-aa{
  width 70%
}
.num-ta1 tr .ta1-bb{
  width 30%
}
.ta2-aa{
  width 60%
}
.ta2-bb,.ta2-cc{
  width 20%
}
/deep/ .van-uploader__input-wrapper{
  width 90%
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 300px;
  height: 180px;
  background-color: #fff;
}
/deep/ .van-cell{
  border-bottom: 1px solid #ebedf0;
}
/deep/ .van-cell:nth-clild(1){
  border-bottom: 0;
}
/deep/ .van-cell__value{
  flex 2
}
/deep/ .van-dialog__header{
  padding 10px 0
}
</style>

