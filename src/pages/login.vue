<template>
  <div class="box">
    <div class="login-title">微微派单系统</div>
    <van-form @submit="onSubmit" class="login-form">
      <van-field
        v-model="username"
        name="username"
        label="用户名"
        placeholder="用户名"
        :clearable='true'
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="password"
        label="密码"
        placeholder="密码"
        :clearable='true'
        :rules="[{ required: true, message: '请填写密码' }]"
      />
      <div style="margin: 16px;">
        <van-button round color="#169BD5" block type="info" native-type="submit">
          登录
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<style lang="stylus" scoped>
.box{
  display flex
  flex-direction column
  width 100%
}
.login-title{
  font-size 30px
  font-weight 800
  color #169BD5
  padding 30px 0 60px 0;
  text-align center
}
.login-form{
  padding 15px
}
</style>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async onSubmit (values) {
      // console.log(values)
      let random = Math.random();
      let params = {
        account: values.username,
        pwd: values.password,
        random: random
      }
      let res = await this.$api.teaback.userLogin(params)
      // console.log(res)
      if(res.ret === true){
        this.$router.push('/index')
        let userInfo =JSON.stringify(res)
        localStorage.setItem('userInfo',userInfo)
        localStorage.setItem('account',res.account)
        localStorage.setItem('accountid',res.account_id)
        this.$toast.success('登录成功')
      }else if(res.msg === 'account or password error'){
        this.$toast.fail('账号密码错误')
      }else if(res.msg === 'account is bound'){
        this.$toast.fail('系统维护中，暂不能登录')
      }else{
        this.$toast.fail('登录失败')
      }
      
    }
  }
}
</script>
