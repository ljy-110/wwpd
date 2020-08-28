<template>
  <div>
    <van-nav-bar title="微微派单">
      <template #right>
        <!-- <van-icon name="search" size="18" /> -->
      </template>
    </van-nav-bar>
    <div>
      <van-tabs type="card" @click="handleLoad">
        <van-tab name="1" title="个人信息">
          <userInfo :key="timer1"></userInfo>
        </van-tab>
        <van-tab name="2" title="分销">
          <retailInfo :key="timer2"></retailInfo>
        </van-tab>
        <van-tab name="3" title="取单">
          <takeOrder :key="timer3"></takeOrder>
        </van-tab>
        <van-tab name="4" title="派单">
          <dispatch :key="timer4"></dispatch>
        </van-tab>
      </van-tabs>
    </div>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- <p>刷新次数: {{ count }}</p> -->
    </van-pull-refresh>
  </div>
</template>

<style lang="stylus" scoped>
/deep/ .van-tabs__nav--card{
  margin 0
}
/deep/ .van-tabs__nav--card .van-tab.van-tab--active {
    color: #000;
    background-color: #99CCFF;
}
/deep/ .van-tabs--card>.van-tabs__wrap {
    height: 40px;
}
/deep/ .van-tabs__nav--card {
    height: 40px;
    border 0
    border-top: 1px solid #B3B3B3;
    border-bottom: 1px solid #B3B3B3;
}
/deep/ .van-tabs__nav--card .van-tab {
    color #000
    border-right: 1px solid #B3B3B3;
}
/deep/ .van-tabs__nav--card .van-tab:last-child {
    border-right: 0;
}
</style>

<script>
import userInfo from '../components/user.vue'
import retailInfo from '../components/retail.vue'
import takeOrder from '../components/takeOrder.vue'
import dispatch from '../components/dispatch.vue'
export default {
  components: {
    userInfo: userInfo,
    retailInfo: retailInfo,
    takeOrder: takeOrder,
    dispatch: dispatch
  },
  data(){
    return {
      isLoading: false,
      timer1: '',
      timer2: '',
      timer3: '',
      timer4: '',
    }
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
        this.count++;
      }, 1000);
    },
    handleLoad (name) {
      if(name = 1){
        this.timer1 = new Date().getTime()
      }else if(name = 2){
        this.timer2 = new Date().getTime()
      }else if(name = 3){
        this.timer3 = new Date().getTime()
      }else if(name = 4){
        this.timer4 = new Date().getTime()
      }
      
    }
  },
}
</script>
