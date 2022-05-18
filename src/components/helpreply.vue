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
     <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
    <div style="text-align:center;padding:10px">
      <van-icon 
        name="arrow-left" 
        style="float:left" 
        @click="onClickLeft"/>
        <font class="my">我的求助</font>
      <van-icon name="sort" color="#000000"/>
    </div>
    <!-- 背景图 -->
    <div style="height:140px" @click="show = true">
    <!-- 主页个人头像 -->
      <div :data="mainPicture">
      <van-image
        round
        style="margin-top:10%;float:left;padding:20px"
        width="85px"
        height="85px"
        :src="mainPicture.user_chart"
      />
      </div>
    </div>
<hr style="filter: alpha(opacity=100,finishopacity=0,style=3)" width="90%" color=#000 size=2>
    <!-- 第一个单元格 -->
    <div class="box" :data="info" v-for="item in info" :key="item.id">
    <van-cell-group>
      <!-- 文字 -->
      <font size="3" style="padding:5px">
        {{ item.help_article }}  
      </font>
      <div style="padding:5px">
        <!-- 内容图片 -->
      <van-image
        width="100%"
        height="100%"
        :src="item.help_chart"
        />
      </div>
      <div style="padding-left:5px;width:100%;" >
      <font style="float:left;">
        {{ item.id }}
        &nbsp;&nbsp;:&nbsp;&nbsp;
        {{ item.help_article }}
    </font>
    </div>
      <van-field
        style="padding:5px"
        v-model="message1"
        label="评论"
        right-icon="flower-o"
        disabled
      />
    </van-cell-group>
    </div>
    </van-pull-refresh>
  </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import Vue from 'vue';
import { Uploader } from 'vant';

Vue.use(Uploader);

export default {
  data() {
    return {
      info: {},
      mainPicture: [],
      isLoading: false,
      show: false,
      photo:[],
      showreply:false,
      message:'',
      message1:'',
      text:'',
      actions: [{ name: '从手机里选择' }],
    };
  },
    created(){
    this.userid = this.$route.query.userid;
    this.getPhoto();
    this.getAll();
    this.getComment();
    this.getAllOne();
  },
  methods: {
    //获取主页头像
    async getPhoto() {
      sessionStorage.setItem('userid',this.userid);
      const userid=sessionStorage.getItem('userid');
      const { data:res } = await this.$http.get('/api/dingding/photo?userid='+userid);
      this.mainPicture.user_chart = res.data;
    },
    async getAllOne() {
      const { data: res } = await this.$http.get('/api/friend/gethelpall');
      sessionStorage.setItem('helpuserid', res.data.map(o=>{return[o.userid]}));
      sessionStorage.setItem('userarticle', res.data.map(o=>{return[o.help_article]}));
    },
    async getComment() {
      const help_userid = sessionStorage.getItem('helpuserid');
      const user_article = sessionStorage.getItem('userarticle');
      const { data:res } = await this.$http.post('/api/friend/gethelps',
      {
        help_userid: help_userid,
        user_article: user_article
      });
      this.info = res.data;
    },
    async getAll() {
      const userid=sessionStorage.getItem('userid');
      const { data: res } = await this.$http.get('/api/friend/gethelp?userid='+userid);
      this.info = res.data;
    },
    onClickLeft() {
      this.$router.replace('/help');
    },
    reply() {
      this.showreply = true;
    },
    ok() {
      this.showreply=false;
    },
    onCancel() {
      Toast('取消');
    },
      //更换背景图片
    afterRead(file) {
      this.show=false;
      this.photo.backgroundPhoto=file.content
    },
    onRefresh() {
      setTimeout(() => {
        Toast('刷新成功');
        this.isLoading = false;
      }, 1000);
    },
  },
};
</script>

<style scoped>
  .my {
  padding: 10px;
  font-family:"华文琥珀";
  font-size: 30px;
}
  .custom-image .van-empty__image {
    width: 90px;
    height: 90px;
  }
  .van-empty {
    padding: 0px;
  }
  .van-divider {
    margin: 0px;
  }
  .box {
    width:90%;
    border:2px solid white;
    border-radius:20px;
    padding: 5px;
    box-shadow:20px 10px 40px 20px #e3ecec;
    margin: 35px auto;
  }
  .wrapper {
    display: flex;
    /* align-items: center; */
    justify-content: center;
    height: 100%;
  }
</style>
