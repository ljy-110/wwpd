<template>
  <div>
    <div>
      <van-nav-bar
      title="编辑银行卡账号"
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
          label="持卡人"
          placeholder="持卡人"
          :rules="[{ required: true, message: '请填写持卡人' }]"
        />
        <van-field
          v-model="cardNum"
          type="cardNum"
          name="cardNum"
          label="银行卡号"
          placeholder="持卡人银行卡号"
          bind:change='bankCardChange'
          maxlength="19"
          :rules="[{ required: true, message: '请填写持卡人银行卡号' }]"
        />
        <van-field
          v-model="bank"
          type="bank"
          name="bank"
          label="开户银行"
          placeholder="例如：中国银行"
          :rules="[{ required: true, message: '请填写开户银行' }]"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">
            保存
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
      cardNum: '',
      bank: '',
    };
  },
  created(){
    this.getBankCardInfo()
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    },
    onClickRight() {
      Toast('按钮');
    },
    async onSubmit(values) {
      // console.log(values)
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid, 
        bank_user_name: this.username, 
        bank_card: this.cardNum, 
        bank_type: this.bank
      }
      let res = await this.$api.teaback.resetBankCard(params)
      // console.log(res)
      if(res.ret === true){
        this.$toast.success('修改银行卡成功')
        this.$router.go(-1)
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
        this.$toast.fail('修改失败');
      }
    },
    async getBankCardInfo() {//查询银行卡信息
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid
      }
      let res = await this.$api.teaback.getBankCardInfo(params)
      // console.log(res)
      if(res.ret === true){
        this.username = res.bank_user_name,
        this.cardNum= res.bank_card,
        this.bank= res.bank_type
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
        this.username = "",
        this.cardNum= "",
        this.bank= ""
      }
    },
    
  },
}
</script>

<style lang="stylus" scoped>

</style>