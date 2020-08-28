<template>
  <div>
    <div>
      <van-nav-bar
      title="修改密码"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    </div>
    <div class="paw-box">
      <van-form @submit="onSubmit">
        <van-field
          v-model="username"
          name="username"
          label="用户名"
          placeholder="用户名"
          readonly
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="password2"
          type="password"
          name="password2"
          label="新密码"
          placeholder="请输入新的密码"
          :rules="[{ required: true, message: '请填写新的密码密码' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            提交
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      password2: '',
      pwd: ''
    };
  },
  created(){
    this.getAccountInfo();
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      Toast('按钮');
    },
    async onSubmit(values) {
      let accountid = localStorage.getItem('accountid')
      if(this.password == this.pwd){
        let params = {
          account_id: accountid,
          new_pwd: this.password2
        }
        let res = await this.$api.teaback.resetPwd(params)
        // console.log(res)
        if(res.ret === true){
          this.$toast.success('修改密码成功');
          this.$router.push('/')
        }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
          this.$toast.fail('密码修改失败');
        }
      }else{
        this.$toast.fail('原密码输入错误');
      }
      
    },
    async getAccountInfo() {
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid
      }
      let res = await this.$api.teaback.getAccountInfo(params)
      // console.log(res)
      if(res.ret === true){
        this.pwd = res.accountInfo.pwd
      this.username = res.accountInfo.account
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
            this.$toast.fail('获取失败')
          }
      
    },
    
  },
}
</script>

<style lang="stylus" scoped>
.paw-box{
  margin-top 50px
}
</style>