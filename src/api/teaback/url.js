/*
 * @Descripttion:
 * @version:
 * @Author: hengzi
 * @Date: 2019-12-12 14:58:13
 * @LastEditors  : hengzi
 * @LastEditTime : 2020-01-14 10:44:04
 */
import config from '../../../vue.config'
const defaultServerIP = '120.24.148.2'
const url = process.env.NODE_ENV === 'production' ? 'http://120.24.148.2:9000' : 'api'
// const url = process.env.NODE_ENV === "production" ? "http://192.168.150.154:9000" : "api";
const baseUrl = config.publicPath + url
// const baseUrl = config.publicPath

// const  baseUrl = '106.12.119.162:8008'
export default {
  baseUrl: baseUrl,
  // 用户消息列表websocket
  ws_host_path_0: 'ws://' + defaultServerIP + ':63333',
  ws_user_listen: baseUrl + '/chat/ws/user/listen',
  // 聊到室监听websocket
  userLogin: baseUrl + '/wxcrm/login',//账号密码登录
  getAccountInfo: baseUrl + '/wxcrm/getAccountInfo',//获取个人信息
  resetPwd: baseUrl + '/wxcrm/resetPwd',//修改密码
  uploadAccountQCcode: baseUrl + '/wxcrm/uploadAccountQCcode',//上传微信收款二维码
  uploadzfbQCcode: baseUrl + '/wxcrm/uploadzfbQCcode',//上传支付宝收款二维码
  getAccountQCcode: baseUrl + '/wxcrm/getAccountQCcode',//查看微信收款二维码
  getzfbQCcode: baseUrl + '/wxcrm/getzfbQCcode',//查看支付宝收款二维码
  resetBankCard: baseUrl + '/wxcrm/resetBankCard',//编辑银行卡账号
  getBankCardInfo: baseUrl + '/wxcrm/getBankCardInfo',//查看账号银行卡信息
  addAccount: baseUrl + '/wxcrm/addAccount',//新建下级账号
  getLowerList: baseUrl + '/wxcrm/getLowerList',//获得下级账号
  banAccount: baseUrl + '/wxcrm/banAccount',//禁用账号
  unBanAccount: baseUrl + '/wxcrm/unBanAccount',//解封账号
  delAccount: baseUrl + '/wxcrm/delAccount',//删除账号
  clearMoney: baseUrl + '/wxcrm/clearMoney',//清零未结算
  resetPrice: baseUrl + '/wxcrm/resetPrice',//修改单价
  getPhoneList: baseUrl + '/wxcrm/getPhoneList',//获取用户所请求的号码列表
  delPhone: baseUrl + '/wxcrm/delPhone',//删除号码
  getNoPassList: baseUrl + '/wxcrm/getNoPassList',//只看已通过但没拉的
  getNewPhone: baseUrl + '/wxcrm/getNewPhone',//请求新号码
  updatePhoneInfo: baseUrl + '/wxcrm/updatePhoneInfo',//更新号码资料 释放二维码
  getGroupQCcode: baseUrl + '/wxcrm/getGroupQCcode',//请求二维码
  releaseQCcode: baseUrl + '/wxcrm/releaseQCcode',//释放二维码
  getGroupCode: baseUrl + '/wxcrm/getGroupCode',//查看群二维码
  topAccount: baseUrl + '/wxcrm/topAccount',//置顶
  setShow: baseUrl + '/wxcrm/setShow',//分销显示隐藏
}
