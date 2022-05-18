<template>
  <div class="container">
    <div class="header">
    <van-nav-bar title="消息" left-arrow @click-left="backs"></van-nav-bar>
    </div>

    <div class="main"
    :data="helpform"
     v-for="(item,index) in helpform"
    :key="index"
    >
      <!-- 头像名字 -->
      <div class="touxiang">
       <van-image round width="1.3rem" height="1.3rem" :src="item.user_chart"/>
       <span>{{item.help_name}}</span>
       <span class="time">{{item.created_at}}</span>
      </div>
      <!-- 评论 -->
      <div class="newcomment">
           <div class="huifu">{{item.user_name}}回复:{{item.help_article}}</div>
      <span class="newcomments">{{item.help_article}} </span>
      </div>
      <div class="talktalk">
         <div class="tell">
        <div class="dongtai">{{item.user_article}}</div>
          <div class="tell-pic">
            <!-- 图片 -->
          <van-grid :border="false" :column-num="1">
          <van-grid-item>
            <van-image :src="item.help_chart" />
          </van-grid-item>
          </van-grid>
          </div>
          </div>
          </div>
          <!-- 回复 -->
          <div class="reword">
             <!-- <van-cell-group class="van-ellipsis">
             <van-field label="回复" placeholder="请输入评论"/>
            </van-cell-group> -->
            <span>回复</span>
            <input type="text" v-model="commentinfo">
            <button @click="sentcomment">发送</button>
          </div>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
  </div>
</template>
 

<script>
export default {
 created() {
    this.getuserlist()
  },
data() {
  return {
    helpform:[],
    commentinfo:''
  }
},
methods:{
  backs(){
    this.$router.push('/myhelp')
  },
  async getuserlist(){
    var user_name = sessionStorage.getItem('user_name')
 
    const{data: res} = await this.$http.get('/api/friend/userh?user_name='+user_name)

    this.helpform = res.data
 

    sessionStorage.setItem('help_name',res.data[0].help_name )
    sessionStorage.setItem('useridother1',res.data[0].userid )
    sessionStorage.setItem('user_name',res.data[0].user_name )
    sessionStorage.setItem('user_article',res.data[0].user_article )
    sessionStorage.setItem('help_chart',res.data[0].help_chart )
    //头像
    this.userid = res.data[0].user_chart
    },
    async sentcomment(){
         var help_chart = sessionStorage.getItem('help_chart')

         var user_article = sessionStorage.getItem('user_article')

         var help_userid = localStorage.getItem('help_userid',this.userid)

         var user_name = sessionStorage.getItem('user_name')

        var useridother1 = sessionStorage.getItem('userid')

       var help_name = sessionStorage.getItem('help_name')

      const{data: res1} = await this.$http.post('/api/friend/hreplys',{
       help_name:help_name,
       help_article:this.commentinfo,
       userid:userid,
       user_name:user_name,
       help_userid:help_userid,
       user_article:user_article,
       help_chart:help_chart
      })
    }
}

}
</script>

<style scoped>
.header{
  height: 1.2rem;
}
.headphoto{
  width:1.5rem;     
  height:1.5rem;
  margin-left: -57px;
}
.van-ellipsis {
    overflow: visible !important;;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.main{
  margin-top: 50px;
}
.container{
  height: 100%;
  background-color: #d7e7ee;
  box-shadow: 5px 35px 40px 40px #e3ecec;
}
.main{
  margin-top: 0.6rem !important;
  margin: 0 auto;
  height: 100%;
  width: 96%;
  background-color: #fff;

}
.touxiang{
  padding-top: 12px;
  padding-left: 13px;
}
.touxiang span {
  font-size: 27px;
  margin-left: 15px;
}
.talktalk {
  margin: 0 auto;
  width: 97%;
  height:100%;

  border: 2px solid #eee;
}
.newcomment {
  margin-top: 10px;
  margin-left: 8px;
}
.reword {
  margin-top: 10px;
}
.time{
  font-size: 16px !important;
}
.dongtai{
  font-size: 20px;
  margin-left: 7px;
  margin-top: 5px;
}
.newcomments{
  font-size: 22px;
}
.reword span {
  margin-left: 10px;
  font-size: 17px;
}
.reword input {
  height: 18px;
  margin-left: 10px;
  width: 300px;
  border: 1px solid rgb(213, 211, 211);
  margin-bottom: 9px;
}
.reword button{
  color: #fff;
  border: 1px solid rgb(146, 187, 233); 
  margin-left: 10px;
  background-color: rgb(85, 182, 247);
  border-radius: 9px;
}
.huifu{
    font-size: 20px;
    margin-bottom: 10px;
}
</style>