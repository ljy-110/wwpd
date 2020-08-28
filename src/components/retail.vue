<template>
  <div class="box">
    <div class="contont">
      <div class="ret-top">
        <div class="ret-top-aa">
          <span class="ret-aa-acc">下级账号:</span>
          <input class="ret-aa-input" v-model="account_new" type="text">
        </div>
        <div class="ret-top-aa">
          <span class="ret-aa-password" style="width:30%">密码:</span>
          <input class="ret-aa-input" v-model="pwd" type="text">
        </div>
        <div class="ret-top-aa">
          <span class="ret-aa-price" style="width:40%">单价:</span>
          <input class="ret-aa-input" onkeyup="value=value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')" v-model="new_price" type="text">
        </div>
        <div class="ret-top-but">
          <van-button type="info" @click="addAccount" loading-size='12px' :loading='loading' loading-text="新建中" color="#169BD5" size="mini">新建账号</van-button>
        </div>
      </div>
    </div >
    <div class="ret-user" v-for="(item,index) in userInfo" :key="index">
      <div class="ret-user-aa" style="padding-left:10px;padding-bottom:10px">
        <span class="ret-user-acc">下级账号:</span>
        <span class="ret-user-name" style="padding-left:10px;">
          <span v-if="!item.is_ban" style="color:red;font-weight:700">{{item.account}}</span>
          <span v-else style="color:#bcbbbb">{{item.account}}</span>
        </span>
        <span style="padding-left:10px">
          <van-tag color="#169BD5" v-if="item.is_ban == false" @click="jingNum(item.account_id)" style="border-radius:5px;height:11px">正常/禁用</van-tag>
          <van-tag color="#999999" v-else-if="item.is_ban == true" @click="zhengNum(item.account_id)" style="border-radius:5px;height:11px">正常/禁用</van-tag>
        </span>
        <span style="padding-left:10px">
          <van-tag color="#169BD5" v-if="item.is_ban == false" @click="topPing(item.account_id)" style="border-radius:5px;height:11px">置顶</van-tag>
          <van-tag color="#169BD5" v-else-if="item.is_ban == true" @click="delUser(item.account_id)" style="border-radius:5px;height:11px">删除</van-tag>
        </span>
      </div>
      <div class="ret-user-aa" style="padding-left:10px;padding-bottom:10px">
        <span class="ret-user-acc">累计派单:</span>
        <span class="ret-user-name" style="padding-left:10px;font-weight:700">{{item.total_finish_num}}</span>
        <span style="padding-left:10px">未结算:
          <span>{{item.clear_before}}--{{item.clear_newest}}</span>
        </span>
        <span class="user-ling">
          <van-tag color="#169BD5" @click="clearMoney(item.account_id)" style="border-radius:5px;height:11px">清零</van-tag>
        </span>
        <van-overlay :show="showclearMoney">
          <div class="wrapper">
            <!-- <div class="block"> -->
                <van-loading type="spinner" color="#1989fa" >loading...</van-loading>
            <!-- </div> -->
          </div>
          
        </van-overlay>
      </div>
      <div class="ret-user-aa" style="padding-left:10px;padding-bottom:10px;display:flex;align-items:center;">
        <span class="ret-user-acc">结算账号:</span>
        <span class="ret-user-name" style="padding-left:10px">
          <img @click="getAccountQCcode(item.account_id)" src="../images/code.png" alt="" style="width:25px;">
          <van-dialog v-model="showImg" title="收款二维码" show-cancel-button>
            <img :src="codeImg" style="width:100%" />
          </van-dialog>
        </span>
        <span class="ret-user-name" style="padding-left:12px">
          <img @click="getBankCardInfo(item.account_id)" src="../images/yl.png" alt="" style="width:32px;">
          <van-dialog v-model="showCard" title="收款账号" show-cancel-button>
            <van-cell-group>
              <van-cell title="持卡人" :value="bank_user_name" />
              <van-cell title="银行卡号" :value="bank_card" />
              <van-cell title="开户银行" :value="bank_type" />
            </van-cell-group>
          </van-dialog>
        </span>
        <span style="padding-left:4px;">单价：
          <span v-if="item.show">{{item.price}}</span>
          <span v-else>?</span>
        </span>
        <span style="padding-left:10px">
          <van-tag color="#169BD5" v-if="item.show" @click="msgShow(item.account_id)" style="border-radius:5px;height:11px">显示/隐藏</van-tag>
          <van-tag color="#999999" v-else @click="msgClose(item.account_id)" style="border-radius:5px;height:11px">显示/隐藏</van-tag>
        </span>
        <span style="padding-left:10px">
          <van-tag color="#169BD5" @click="getPrices(item.account_id)" style="border-radius:5px;height:11px">修改</van-tag>
        </span>
        <van-overlay :show="show">
          <div class="wrapper">
            <div class="block">
               <van-icon name="cross" class="icon-g" @click="show = false" />
              <p style="width:100%;text-align:center;font-size:16px;">修改单价</p>
              <div class="flex-js">
                <label>原单价:</label>
              <input type="text" style="width:75%" disabled="true" v-model="getPrice">
              </div>
              <div class="flex-js">
                <label>新单价:</label>
                <input type="text" style="width:75%" onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')" v-model="newPrice">
              </div>
              <van-button round type="info" size="large" @click="resetPrice">修改</van-button>
            </div>
          </div>
        </van-overlay>
      </div>
    </div>
    <van-popup v-model="shows" round style="width:80%" :safe-area-inset-bottom='true'>
      <van-cell-group>
        <van-cell title="持卡人" :value="bank_user_name" />
        <van-cell title="银行卡号" :value="bank_card" />
        <van-cell title="开户银行" :value="bank_type" />
      </van-cell-group>
    </van-popup>
    <van-empty v-if="userInfo.length == 0" image="search" description="该用户还没有下级账号" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      account_new:'',
      pwd:'',
      new_price:'',
      userInfo:[],
      activeIndex: -1,
      show: false,
      getPrice: '',//原单价
      newPrice: '',//新单价
      account_lowid: '',
      shows: false,
      bank_user_name: '',//持卡人
      bank_card: '',//银行卡账号
      bank_type: '',//开户银行
      codeImg:'',
      showImg:false,
      showCard:false,
      loading:false,
      showclearMoney:false
    }
  },
  created(){
    this.getLowerList();
  },
  methods: {
    jingNum (accountid) {
      this.$dialog.alert({
        message: '确定要禁用该账号吗？',
        showCancelButton: true,
        width: 300
      })
        .then(async() => {
          let account_id = localStorage.getItem('accountid')
          let username = localStorage.getItem('account')
          let params = {
            account_id: account_id,
            account: username, 
            account_ban_id: accountid
          }
          let res = await this.$api.teaback.banAccount(params)
          // console.log(res)
          if(res.ret === true){
            this.getLowerList();
            this.$toast.success('你成功禁用了该账户')
          }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
            this.$toast.fail('禁用失败')
            this.getLowerList();
          }
          
        })
        .catch(() => {
          this.$toast('你取消了禁用')
        })
    },
    zhengNum (accountid) {
      this.$dialog.alert({
        message: '确定要解禁该账号吗？',
        showCancelButton: true,
        width: 300
      })
        .then(async() => {
          let account_id = localStorage.getItem('accountid')
          let username = localStorage.getItem('account')
          let params = {
            account_id: account_id,
            account: username, 
            account_ban_id: accountid
          }
          let res = await this.$api.teaback.unBanAccount(params)
          // console.log(res)
          if(res.ret === true){
            this.getLowerList();
            this.$toast.success('你成功解封了该账户')
          }else if(res.msg == 'you can not unban the account'){
            this.$toast.fail('该账号被总代理禁止，请联系总代理解封')
            this.getLowerList();
          }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
            this.$toast.fail('解封失败')
          }
        })
        .catch(() => {
          this.$toast('你取消了解禁')
        })
    },
    async topPing (id) {
      let account_id = localStorage.getItem('accountid')
      let params = {
        account_id: account_id,
        low_account_id: id
      }
      let res = await this.$api.teaback.topAccount(params)
      // console.log(res)
      if(res.ret === true){
        this.$toast.success('置顶成功')
        this.getLowerList();
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
        this.$toast.fail('置顶失败')
      }
    },
    delUser(accountid){
      this.$dialog.alert({
        message: '确定要删除该账号吗？',
        showCancelButton: true,
        width: 300
      })
        .then(async() => {
          let account_id = localStorage.getItem('accountid')
          let params = {
            account_id: account_id,
            account_del_id: accountid
          }
          let res = await this.$api.teaback.delAccount(params)
          // console.log(res)
          if(res.ret === true){
            this.getLowerList();
            this.$toast.success('你删除了该账户')
          }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
            this.$toast.fail('删除失败')
            this.getLowerList();
          }
        })
        .catch(() => {
          this.$toast('你取消了删除')
        })
      
    },
    clearMoney(accountid){
      this.$dialog.alert({
        message: '确定要清零该账号吗？',
        showCancelButton: true,
        width: 300
      })
        .then(async() => {
          this.showclearMoney = true
          let account_id = localStorage.getItem('accountid')
          let params = {
            account_id: account_id,
            account_low_id: accountid
          }
          let res = await this.$api.teaback.clearMoney(params)
          // console.log(res)
          if(res.ret === true){
            this.getLowerList();
            this.showclearMoney = false
            this.$toast.success('成功清零')
          }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.showclearMoney = false
            this.$router.push('/')
          }else{
            this.showclearMoney = false
            this.$toast.fail('清零失败')
            this.getLowerList();
          }
        })
        .catch(() => {
          this.$toast('你取消了清零')
        })
      
    },
    async msgShow(accountid){
      let account_id = localStorage.getItem('accountid')
      let params = {
        account_id: account_id,
        low_id: accountid,
        show: false
      }
      let res = await this.$api.teaback.setShow(params)
      // console.log(res)
      if(res.ret === true){
        this.getLowerList();
      }else if(res.msg == 'account be ban'){
        this.$toast.fail('该用户已被禁用')
        this.$router.push('/')
      }else{
        this.$toast.fail('隐藏失败')
      }
    },
    async msgClose(accountid){
      let account_id = localStorage.getItem('accountid')
      let params = {
        account_id: account_id,
        low_id: accountid,
        show: true
      }
      let res = await this.$api.teaback.setShow(params)
      // console.log(res)
      if(res.ret === true){
        this.getLowerList();
      }else if(res.msg == 'account be ban'){
        this.$toast.fail('该用户已被禁用')
        this.$router.push('/')
      }else{
        this.$toast.fail('显示失败')
      }
    },
    async addAccount(){//创建下级账号
      this.loading = true
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      let random = Math.random();
      let newPrice= this.new_price
      let userPrice = userInfo.price
      let params = {
        account_id: userInfo.account_id, 
        account: userInfo.account,
        account_no: userInfo.this_no,
        account_new: this.account_new,
        pwd: this.pwd,
        price: newPrice,
        random: random
      }
      let res = await this.$api.teaback.addAccount(params)
      console.log(res)
      if(res.ret === true){
        this.$toast.success('你成功创建了账号')
        this.getLowerList();
        this.account_new='',
        this.pwd='',
        this.new_price=''
        this.loading = false
      }else if(res.msg == 'the account is exist'){
        this.$toast.fail('该账户名称已存在！')
        this.loading = false
      }else if(res.msg == 'price is error'){
        this.$toast.fail('该单价不能为空！')
        this.loading = false
      }else if(res.msg == 'price can not >= price of higher account'){
        this.$toast.fail('下级单价不可以高于上级单价')
        this.loading = false
      }else if(res.msg == 'pwd is error'){
        this.$toast.fail('密码不能为空！')
        this.loading = false
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
            this.loading = false
          }else{
        this.$toast.fail('创建失败！')
        this.loading = false
      }
    },
    async getLowerList(){//获取下级账号列表
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid
      }
      let res = await this.$api.teaback.getLowerList(params)
      // console.log(res)
      if(res.ret === true){
        this.userInfo = res.list
      }else if(res.msg == 'account be ban'){
        this.$toast.fail('该用户已被禁用')
        this.$router.push('/')
      }else{
        this.$toast.fail('获取失败')
      }
      
    },
    async getPrices(id){
      this.show = true
      this.account_lowid = id
      let params = {
        account_id: id
      }
      let res = await this.$api.teaback.getAccountInfo(params)
      // console.log(res)
      this.getPrice = res.accountInfo.price
    },
    async resetPrice(){//修改单价
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      let accountid = localStorage.getItem('accountid')
      let newPrice= this.newPrice
      let userPrice = userInfo.price
      let params = {
        account_id: accountid,
        account_low_id: this.account_lowid,
        price: this.newPrice
      }
      let res = await this.$api.teaback.resetPrice(params)
      // console.log(res)
      if(res.ret === true){
        this.show = false
        this.$toast.success('成功修改单价')
        this.getLowerList()
        this.newPrice = ''
      }else if(res.msg == 'the price can not >= price of higher account'){
        this.$toast.fail('下级单价不可以高于上级单价')
      }else if(res.msg == 'account be ban'){
        this.$toast.fail('该用户已被禁用')
        this.$router.push('/')
      }else{
        this.$toast.fail('修改单价失败')
      }
    },
    async getBankCardInfo(accountid){//点击查看银行卡信息
        let params = {
          account_id: accountid
        }
        let res = await this.$api.teaback.getBankCardInfo(params)
        // console.log(res)
        if(res.ret === true){
          this.shows = true;
          this.bank_user_name = res.bank_user_name
          this.bank_card = res.bank_card
          this.bank_type = res.bank_type
        }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
          this.$toast.fail('该用户还没有添加银行卡信息')
        }
      },
    async getAccountQCcode(accountid){//点击查看下级账号二维码信息
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
          this.$toast.fail('该用户还没有添加银行卡信息')
        }
      }
  }
}
</script>

<style lang="stylus" scoped>
.box{
  overflow hidden
  padding 0px 8px
  
}
.ret-top{
  display flex
  width 100%
  flex-wrap wrap
  border-bottom 1px solid #ccc
}
.ret-top-aa{
  width 50%
  display flex
  justify-content flex-start
  padding-top 10px
}
.ret-top-aa span{
  font-size 14px
  width 40%
  padding-left 10px
  text-align-last:justify;
  text-align:justify;
  display inline-block
	vertical-align: top;
}
.ret-top-aa input{
  width 50%
  font-size 14px;
  height 16px
  line-height 16px
  margin-left 5px
}
.ret-top-but{
  width 50%
  text-align center
  padding-top 10px
  height 32px
}
.ret-top-but .van-button{
  padding 0px 24px 0 24px
  margin-left 53px
}
.ret-user{
  margin-top 12px
  font-size 14px
  border-bottom 1px solid #ccc
}
.ret-user-aa{
  position relative
}
.user-ling{
  position absolute
  right 15%
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.block {
  width: 300px;
  height: 200px;
  background-color: #fff;
  border-radius 10px;
  padding 0 10px
  position relative
}
.flex-js{
  display flex
  width 100%
  justify-content space-between
  padding-bottom 15px
}
.icon-g{
  position absolute
  right 10px
  top 5px
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
