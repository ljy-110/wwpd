<template>
  <div class="box">
    <div class="tak-top">
        <van-button type="info" color="#169BD5" @click="getNoPassList" size="mini">只看已通过没拉的</van-button>
        <van-button type="info" color="#169BD5" @click="getPhoneListss" size="mini">看全部</van-button>
        <van-button type="info" color="#169BD5" :disabled='disabled' @click="getNewPhone" size="mini">请求新号码</van-button>
    </div>
    <van-list
      v-model="loadings"
      :finished="finished"
      finished-text="没有更多了"
      @load="getPhoneList"
    >
      <div class="ul-li flex-sta" style="border-bottom:1px solid #ccc;padding-bottom:10px;" v-for="(item,index) of phoneList" :key="index">
          <span style="text-align:center;" class="ser">{{phoneList.length-index}}</span>
        <div style="width:90%">
          <van-cell-group :model="list">
            <van-field v-model="item.phone" type="tel" label="手机号:" readonly></van-field>
            <van-field v-model="item.wx_name" @input="wxName" type="text" :value='null' :clearable='true' label="昵称:" placeholder="请输入昵称" />
            <van-field v-model="item.wx_account" @input="wxNum" type="text" :value='null' :clearable='true' label="微信号:" placeholder="请输入微信号"/>
            <van-field v-model="item.group_name" @input="groupName" type="text" :value='null' :clearable='true' label="进群名称:" placeholder="请输入进群名称"/>
          </van-cell-group>
          <div class="flex-bet">
            <van-button type="primary" style="margin-top:10px;width:45%" size="small" @click="updatePhoneInfo(item.phone_id,item.batch_id)">保存</van-button>
            <van-button type="danger" size="small" @click="delPhone(item.phone_id,item.batch_id)" style="margin-top:10px;width:45%">删除</van-button>
          </div>
        </div>
      </div>
    </van-list>
    <!-- <ul style="width:100%;">
      <li class="ul-li flex-sta" style="border-bottom:1px solid #ccc;padding-bottom:10px;" v-for="(item,index) of phoneList" :key="index">
          <span style="text-align:center;" class="ser">{{phoneList.length-index}}</span>
        <div style="width:90%">
          <van-cell-group :model="list">
            <van-field v-model="item.phone" type="tel" label="手机号:" readonly></van-field>
            <van-field v-model="item.wx_name" @input="wxName" type="text" :value='null' :clearable='true' label="昵称:" placeholder="请输入昵称" />
            <van-field v-model="item.wx_account" @input="wxNum" type="text" :value='null' :clearable='true' label="微信号:" placeholder="请输入微信号"/>
            <van-field v-model="item.group_name" @input="groupName" type="text" :value='null' :clearable='true' label="进群名称:" placeholder="请输入进群名称"/>
          </van-cell-group>
          <div class="flex-bet">
            <van-button type="primary" style="margin-top:10px;width:45%" size="small" @click="updatePhoneInfo(item.phone_id,item.batch_id)">保存</van-button>
            <van-button type="danger" size="small" @click="delPhone(item.phone_id,item.batch_id)" style="margin-top:10px;width:45%">删除</van-button>
          </div>
        </div>
      </li>
      
    </ul> -->
    <van-overlay :show="load">
          <div class="wrapper">
            <!-- <div class="block"> -->
                <van-loading type="spinner" color="#1989fa" >loading...</van-loading>
            <!-- </div> -->
          </div>
          
        </van-overlay>
    <van-empty v-if="phoneList.length == 0" image="search" description="该用户没有号码" />
  </div>
</template>

<script>
export default {
  data () {
    return {
      phoneList: [],
      tel: '',
      list:{
        wx_name: [],
        wx_num: [],
        group: [],
      },
      wx_name: null,
      wx_num: null,
      group: null,
      show:false,
      loading:false,
      disabled:false,
      load:false,
      loadings: false,
      finished: false,
      pages:0,
    }
  },
  created (){
    // this.getPhoneList();
  },
  mounted () {
    // this.getPhoneList();
  },
  methods:{
    getPhoneListss(){
      this.pages = 0
      this.phoneList = []
      this.finished = false
      this.getPhoneList();
    },
    async getPhoneList(){
      
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid,
        begin:this.pages,
        len:10
      }
      let res = await this.$api.teaback.getPhoneList(params)
      console.log(res)
      if(res.ret){
        this.loadings = false
        this.phoneList = this.phoneList.concat(res.list)
        this.pages = this.pages + 10
        console.log(this.pages)
        if (res.list.length === 0) {
          this.finished = true
        }else{}
      }else{
        this.finished = true
      }
      
    },
    async updatePhoneInfo(phoneid,batchid){//添加号码微信信息
    this.load = true
      let accountid = localStorage.getItem('accountid')
      let wx_name = this.wx_name
      let wx_account = this.wx_num
      let group_name = this.group
      let params = {
        account_id: accountid,
        wx_name: this.wx_name, 
        wx_account: this.wx_num, 
        group_name: this.group, 
        phone_id: phoneid,
        batch_id:batchid
      }
      let res = await this.$api.teaback.updatePhoneInfo(params)
      console.log(res)
      if(res.ret === true){
        this.$toast.success('添加成功')
        this.wx_name=null, 
        this.wx_num=null, 
        this.group=null, 
        // this.getPhoneList();
        this.load = false
      }else if(res.msg == 'account be ban'){
        this.$toast.fail('该用户已被禁用')
        this.$router.push('/')
        this.load = false
      }else if(res.msg == 'no input'){
        this.$toast.fail('信息没有更新')
        this.load = false
      }else if(res.msg == 'no bind group'){
        this.$toast.fail('没有绑定群,不能添加群名称')
        this.load = false
      }else if(res.msg == 'please set wx_name'){
        this.$toast.fail('请先填好微信昵称，再填微信号')
        this.load = false
      }else if(res.msg == 'please set wx_name and wx_account'){
        this.$toast.fail('请先填好微信号和微信昵称，再填进群名称')
        this.load = false
      }else{
        this.$toast.fail('添加失败')
        this.load = false
        this.wx_name=null, 
        this.wx_num=null, 
        this.group=null
      }
      
    },
    async getNoPassList(){//看已通过没拉的
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid,
      }
      let res = await this.$api.teaback.getNoPassList(params)
      // console.log(res)
      if(res.result.length == 0){
        this.$toast.fail('该用户没有已通过没拉的号码')
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
        this.phoneList = res.result
      }
    },
    async getNewPhone(){//请求新号码
      this.disabled=true
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid,
      }
      let res = await this.$api.teaback.getNewPhone(params)
      console.log(res)
      if(res.ret === true){
        this.$toast.success('请求号码成功')
        this.disabled=false
        this.pages = 0
        this.phoneList = []
        this.finished = false
        this.getPhoneList();
      }else if(res.msg == 'the account already had >= 3 phone'){
        this.$toast.fail('还有号码没用完，请用完再请求新号码')
        this.disabled=false
      }else if(res.msg == 'no new phone in the system'){
        this.$toast.fail('没有更多号码')
        this.disabled=false
      }else if(res.msg == 'your group is full,please release group'){
        this.$toast.fail('该群已满，请先释放群，再请求')
        this.disabled=false
      }else if(res.msg == 'account be ban'){
        this.$toast.fail('该用户已被禁用')
        this.disabled=false
        this.$router.push('/')
      }else if(res.msg == 'your group is full,please release group'){
        this.$toast.fail('群人数已满，请换个群使用')
        this.disabled=false
      }else if(res.msg == 'your group is del'){
        this.$toast.fail('你的群已被删除，请先释放群后再请求')
        this.disabled=false
      }else{
        this.$toast.fail('请求失败')
        this.disabled=false
      }
    },
    wxName(e){
      this.wx_name = e
    },
    wxNum(e){
      this.wx_num = e
    },
    groupName(e){
      this.group = e
    },
    async delPhone(phoneid,batchid){//删除号码
    this.$dialog.alert({
        message: '确定要删除该账号吗？',
        showCancelButton: true,
        width: 300
      })
        .then(async() => {
          this.load = true
          let accountid = localStorage.getItem('accountid')
          let params = {
            account_id: accountid, 
            phone_id: phoneid,
            batch_id: batchid
          }
          let res = await this.$api.teaback.delPhone(params)
          // console.log(res)
          if(res.ret === true){
            this.$toast.success('删除成功')
            this.getPhoneList();
            this.load = false
          }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
            this.load = false
          }else if(res.msg == 'the wx_name no info'){
            this.$toast.fail('请填写昵称后再删除')
            this.load = false
          }else{
            this.$toast.fail('删除失败')
            this.load = false
          }
        })
        .catch(() => {
          this.$toast('你取消了删除')
          this.load = false
        })
    }
  }
}
</script>
<style lang="stylus" scoped>
.box{
  overflow hidden
  padding 0px 20px;
}
.tak-top{
  padding 20px 0 20px 0;
  border-bottom 1px solid #ccc
}
.tak-top .van-button {
  margin-right 25px;
  padding 0 10px 0 10px;
  border-radius 5px;
}
.van-button:nth-child(3){
  margin-right 0px;
}
.flex-bet{
  display flex;
  width:100%
  justify-content space-between
}
.flex-sta{
  display flex;
  width:100%
  justify-content flex-start
}
.ord-num{
  display flex
  align-items center
}
.flex-center{
  display flex
  flex-direction column
  justify-content center
}
/deep/ .van-cell {
  padding 5px
}
/deep/ .van-button--mini+.van-button--mini {
  margin-left: 0px;
}
/deep/ .van-field__label{
  width 70px;
  margin-right 10px
}
/deep/ .van-field__label span{
  text-align-last:justify;
  text-align:justify;
  display inline-block
	vertical-align: top;
  width 100%
  
}
/deep/ .van-cell::after{
  width:100%
  left 3px
}
.ser{
  margin-top 7px
  color red
  font-size 14px
  text-align center
  display:inline-block;
}
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>


