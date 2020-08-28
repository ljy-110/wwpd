<template>
  <div class="box" style="margin-top:30px;">
    <div style="width:100%;text-align:center;">
      <van-button type="info" color="#169BD5" :loading='loading' loading-text="请求中" @click="getGroupQCcode" size="small">请求二维码</van-button>
    </div>
    <div style="width:100%;text-align:center;margin-top:30px;">
      
      <van-empty v-if="!codeImg" image="error" description="还没绑定群" />
      <img v-else :src="codeImg" alt="" style="width:83%">
    </div>
    <div style="width:100%;text-align:center;margin-top:30px;">
      <van-button type="info" @click="releaseQCcode" :loading='load' loading-text="释放中" color="#169BD5" size="small">释放二维码</van-button>
    </div>
  </div>
</template>

<style lang="stylus" scoped>

</style>

<script>
export default {
  data(){
    return{
      codeImg:'',
      loading: false,
      load: false,
    }
  },
  created(){
    this.getGroupCode();
  },
  methods:{
    async getGroupCode(){
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid,
      }
      let res = await this.$api.teaback.getGroupCode(params)
      console.log(res)
      
      // console.log(image)
      if(res.ret === true){
        let bytes = new Uint8Array(res.photo.data);
        let data = "";
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
        　　data += String.fromCharCode(bytes[i]);
        }
        let image = "data:image/png;base64," + window.btoa(data);
        this.codeImg = image
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
          }else{
        this.$toast.fail('还没有绑定群')
      }
    },
    async getGroupQCcode(){//获取二维码
      this.loading = true
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid,
      }
      let res = await this.$api.teaback.getGroupQCcode(params)
      console.log(res)
      if(res.ret === true){
        let bytes = new Uint8Array(res.photo.data);
        let data = "";
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
        　　data += String.fromCharCode(bytes[i]);
        }
        let image = "data:image/png;base64," + window.btoa(data);
        this.codeImg = image
        this.$toast.success('获取成功')
        this.loading = false
      }else if(res.msg == 'account be ban'){
        this.$toast.fail('该用户已被禁用')
        this.$router.push('/')
        this.load = false
      }else if(res.msg == 'no group in system'){
        this.$toast.fail('系统没有群')
        this.loading = false
      }else if(res.msg == 'you already had a group'){
        this.$toast.fail('你已经有群在使用')
        this.loading = false
      }else if(res.msg == 'no group can use'){
        this.$toast.fail('系统没有群可以用')
        this.loading = false
      }else if(res.msg == 'you no have some phone'){
        this.$toast.fail('你还没有获取号码')
        this.loading = false
      }else{
        this.$toast.fail('获取失败')
        this.loading = false
      }
    },
    async releaseQCcode(){//释放二维码
      this.load = true
      let accountid = localStorage.getItem('accountid')
      let params = {
        account_id: accountid,
      }
      let res = await this.$api.teaback.releaseQCcode(params)
      console.log(res)
      if(res.ret === true){
        this.$toast.success('释放成功')
        this.codeImg = ''
        this.load = false
      }else if(res.msg == 'account be ban'){
            this.$toast.fail('该用户已被禁用')
            this.$router.push('/')
            this.load = false
          }else{
        this.$toast.fail('释放失败')
        this.load = false
      }
    },
  }
}
</script>
