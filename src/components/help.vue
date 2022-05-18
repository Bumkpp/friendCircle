<template>
  <div>
    <div>
      <van-image 
      :data="photo"
      :src="photo.backgroundPhoto" 
      width="100%" height="100%" 
      style="z-index:-100;position:fixed;left:0;top:0"/>
      <van-overlay :show="show" @click="show = false">
        <div class="wrapper" @click.stop>
    <van-uploader :after-read="afterRead" preview-size="75px" style="padding:300px"/>
        </div>
    </van-overlay>
    <!-- 头像以上模块 -->
    <div style="height:150px;padding:10px" @click="show = true">
      <!-- 吸顶设置:"求助"字体和进入添加页面按钮 -->
      <van-sticky>
        <!-- 进入添加页面 -->
        <van-grid style="float: right" icon-size="25px">
        <van-grid-item icon="plus" @click="toAdd"/>
        </van-grid>
        <!-- 求助字体 -->
        <div style="text-align:center">
          <font class="fonttext">求助</font>
          <van-icon name="friends-o" />
        </div>
      </van-sticky>
      <!-- 主页个人头像==已交互成功 -->
      <div
      :data="mainPicture"
      :key="mainPicture.userid">
      <van-image
      round
      style="margin-top:10%;float:right;"
      width="85px"
      height="85px"
      :src="mainPicture.mainPhoto"
      />
      </div>
    </div>
<hr style="filter: alpha(opacity=100,finishopacity=0,style=3)" width="90%" color=#000 size=2>
    <!-- 第一块单元格 -->
    <div class="box" :data="conent" v-for="item in conent" :key="item.id">
    <van-cell-group>
    <div style="padding-left:5px;width:100%">
    <!-- 内容头像 -->
    <div style="width:20%;float:left">
    <van-image
      round
      width="50px"
      height="50px"
      @click="helpreply(item.userid)"
      :src="item.user_chart"
    />
    </div>
      <!-- 内容昵称 -->
    <div style="padding-top:10px;width:80%;float:left;">
      <font size="4">
        {{ item.help_name }}
      </font>
    </div>
    </div>
    <!-- 内容文字 -->
    <div 
      :data="conent"
      :key="conent.userid"
      style="width:100%;float:left;padding:5px">
    <font size="3">
      {{ item.help_article }}
    </font>
    </div>
    <!-- 图片内容 -->
    <div style="padding:5px">
      <van-image
      width="100%"
      height="100%"
      @click="getImg(item.help_chart)"
      :src="item.help_chart"
    />
    </div>
    <div>
    <div style="position:relative;padding:5px;">
    <!-- 评论图标 -->
    <van-icon name="comment-o" size="20"/>
    </div>
    <!-- 别人的评论 -->
    <van-cell-group style="padding:15px;" @click="commit">
    <div>
    <font style="float:left;">
        {{ item.help_name }}
        &nbsp;
        <b>:</b>
        &nbsp;
        {{ item.help_article }}
    </font>
    </div>
    </van-cell-group>
    <van-cell-group style="padding:15px;" @click="commit">
       <!-- 评论别人的评论的评论 -->
      <div 
      :data="comment_commentReply"
      >
        <div style="float:left;">
          {{ item.help_name }}
          &nbsp;
          <b>回复</b>
          &nbsp;
          {{ item.help_name }}
          <b>:</b>
          &nbsp;
          {{ item.help_article }}
          </div>
      </div>
    </van-cell-group >
      <!-- 弹出回复的窗口 -->
      <van-popup 
      v-model="commitreply" 
      position="top" 
      :style="{ height: '25%' }"
      >
      <div :model="replyarticle">
      <h3 style="text-align:center">发表回复</h3>
      <van-field
        style="padding:20px"
        rows="1"
        v-model="replyarticle.reply_article"
        clearable
        autosize
        label="回复"
        type="textarea"
        left-icon="smile-comment"
        placeholder="请输入内容~"
      />
      </div>
      <div style="text-align:center;padding:5px">
      <van-button plain type="primary" @click="okReply()">确定</van-button>
      </div>
      </van-popup>
    <van-cell-group >
    <!-- 点击评论+弹出评论窗口√ -->
    <div>
    <van-field
        style="padding:10px"
        v-model="message1"
        label="评论"
        left-icon="smile-comment"
        right-icon="flower-o"
        @click="reply"
        disabled 
      />
    </div>
      <!-- 弹出评论的窗口 -->
      <van-popup 
      v-model="showreply" 
      position="top" 
      :style="{ height: '25%' }"
      >
      <div :model="commitarticle">
      <h3 style="text-align:center">发表评论</h3>
      <van-field
        style="padding:20px"
        rows="1"
        v-model="commitarticle.help_article"
        clearable
        autosize
        label="评论"
        type="textarea"
        left-icon="smile-comment"
        placeholder="请输入内容~"
      />
      </div>
      <div style="text-align:center;padding:5px">
      <van-button plain type="primary" @click="okComment()">确定</van-button>
      </div>
      </van-popup>
      </van-cell-group>
      </div>
    </van-cell-group>
    </div>
  </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { ImagePreview } from 'vant';

export default {
  data() {
    return {
      conent: {},
      photo:[],
      fileList: [],
      mainPicture: [],//主页个人头像
      commentName: [],//评论人姓名
      commitarticle: {
        help_name:'',
        help_article: ''
      },//别人的评论内容
      replyarticle: {
        reply_article:''
      },//别人回复的内容
      comment_commentReply: [],
      show: false,
      showPhoto:false,
      showreply: false,
      commitreply:false,
      actions: [{ name: '从手机里选择'}],
      isLoading: false,
      text:'',
      message:'',
      message1:'',
      message2:''
    };
  },
  created(){
    this.getPhoto();
    this.getAll();
    this.getComment();
  },
    methods: {
    //获取主页头像
    async getPhoto() {
      sessionStorage.setItem('userid',userid);
      sessionStorage.setItem('help_name',user_name);
      sessionStorage.setItem('help_userid',userid)
      const userid=sessionStorage.getItem('userid');
      if(res.code == 200){
      const { data:res } =await this.$http.get('/api/dingding/photo?userid='+userid);
      if(res.code==200) {
        const { data:res } = await this.$http.get('/api/friend/commstate?userid='+userid);
        sessionStorage.setItem('state',res.data[0].state);
      }
      this.mainPicture.mainPhoto = res.data;//渲染主页头像
      }
    },
    //获取所有的求助数据
    async getAll() {
      const { data: res } = await this.$http.get('/api/friend/gethelpall');
      this.conent = res.data;
      sessionStorage.setItem('help_chart', res.data.map(o=>{return[o.help_chart]}));
      sessionStorage.setItem('help_userid', res.data.map(o=>{return[o.userid]}));
      sessionStorage.setItem('user_article', res.data.map(o=>{return[o.help_article]}));
      sessionStorage.setItem('userid', res.data.map(o=>{return[o.userid]}));
    },
    //获取评论的数据
    async getComment() {
      const help_userid = sessionStorage.getItem('help_userid');
      const user_article = sessionStorage.getItem('user_article');
      const { data:res } = await this.$http.post('/api/friend/gethelps',
      {
        help_userid: help_userid,
        user_article: user_article
      });
      this.conent.help_name = res.data.map(o=>{return[o.help_name]});
      this.conent.help_article = res.data.map(o=>{return[o.help_article]});
    },
    onCancel() {
      Toast('取消');
    },
    //评论的确定键方法
    async okComment() {
      const help_name = sessionStorage.getItem('help_name');//评论人的姓名
      const userid = sessionStorage.getItem('userid');//评论人的id
      const help_userid = sessionStorage.getItem('help_userid');//求助人的id
      const help_chart = sessionStorage.getItem('help_chart');//求助的图
      const user_article = sessionStorage.getItem('user_article');//求助的信息
      const { data: res } = await this.$http.post('/api/friend/hreply',
      {
        help_name: help_name,
        help_article: this.commitarticle.help_article,
        userid: userid,
        user_name: this.help_name,
        help_userid: help_userid,
        help_chart: help_chart,
        user_article: user_article
      }) 
      console.log(res);
        if(res.code == 200) {
          this.showreply=false;
          this.help_name = help_name;
        }
    },
    //回复评论的确定键方法
    async okReply() {
      const help_name = sessionStorage.getItem('help_name');//评论人的姓名
      const userid = sessionStorage.getItem('userid');//评论人的id
      const help_userid = sessionStorage.getItem('help_userid');//求助人的id
      const help_chart = sessionStorage.getItem('help_chart');//求助的图
      const user_article = sessionStorage.getItem('user_article');//求助的信息
      const { data: res } = await this.$http.post('/api/friend/hreply',
      {
        help_name: help_name,
        help_article: this.replyarticle.reply_article,
        userid: userid,
        user_name: this.help_name,
        help_userid: help_userid,
        help_chart: help_chart,
        user_article: user_article
      }) 
      console.log(res);
        if(res.code == 200) {
          this.commitreply=false;
        }
    },
    //进入发布求助页面
    toAdd(){
      const state = sessionStorage.getItem('state');
      if( state == 0 ) {
        this.$router.push({ path:'/helpadd'});
      } else {
        Toast.fail('您的账号已被禁用！');
      }
    },
    //点击内容图片后可放大预览
    getImg(img){
      ImagePreview([img])
    },
    //显示输入评论的窗口
    commit() {
      this.commitreply = true;
    },
    //显示输入回复的窗口
    reply() {
      this.showreply = true;
    },
    //更换背景图片
    afterRead(file) {
      this.show=false;
      this.photo.backgroundPhoto=file.content
    },
    //点击头像后跳转至个人求助的页面
    async helpreply(id) {
      this.$router.push({ path:'/helpreply',query:{ userid: id }});
    },
  },
};
</script>

<style scoped>
  .van-grid-item__content {
    /* 设置背景为透明 */
    background-color:transparent;
    padding: 0;
  }
  .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
  .van-empty {
    padding: 0px;
  }
  .fonttext {
    font-family:"华文琥珀";
    font-size: 30px
  }
  .van-divider {
    margin: 0px;
  }
  .box {
    width:90%;
    border:2px solid white;
    border-radius:20px;
    padding: 5px;
    box-shadow:5px 5px 60px 10px #e3ecec;
    margin: 35px auto;
  }
  .wrapper {
    display: flex;
    justify-content: center;
    height: 100%;
  }
</style>
