<template>
  <div>
      <!--顶部导航栏-->
      <div style="height:25px;text-align:center;padding:20px;background-color:black">
        <font style="float:left;color:white" @click="onClickLeft">取消</font>
        <font class="mytext">我的求助</font>
        <van-button type="default" style="float:right;" @click="addOk" size="mini">发表</van-button>
      </div>
        <!-- 添加请求的内容 -->
        <van-cell-group class="boxadd">
          <div :model='article'>
          <van-field
          v-model="article.help_article"
          rows="17"
          autosize
          label=""
          type="textarea"
          maxlength="935"
          placeholder="提出待解决问题......"
          show-word-limit/>
          </div>
        <div :model="chart">
        <!-- 上传文件和文件预览 -->
        <van-uploader :after-read="afterRead" v-model="chart.help_chart" upload-text="照片/视频" preview-size="75px" multiple :max-count="1" ref="file"/>
        </div>
</van-cell-group>
  </div>
</template>

<script>
import { Toast } from 'vant';

export default {
    data() {
        return {
        article: {
        help_article: '',
        },
        chart: [],
      }
  },
  created() {
      this.getlist();
    },
  methods: {
      afterRead(file) {
      const forms = new FormData();
      forms.append("file", file.file); // 获取上传图片信息
      this.$http.post('/api/file/photo', forms, {
          headers: {
            "content-type": "multipart/form-data"
          },
        })
        .then((res) => {
          //如果传入的响应状态码为200，则成功将文件发送给后台
          if (res.data == 200) {
            console.log(res);
          } else {
            sessionStorage.setItem('help_chart',res.data.fileUrl);
          }
        });
    },
    async getlist() {
        sessionStorage.setItem('userid',userid);
        sessionStorage.setItem('help_name',user_name);
      },
    async addOk() {
      const userid=sessionStorage.getItem('userid')
      const help_name=sessionStorage.getItem('help_name')
      const help_chart=sessionStorage.getItem('help_chart');
      const { data: res } = await this.$http.post('/api/friend/hsend',
      { help_name: help_name, 
        userid:userid, 
        help_article: this.article.help_article, 
        help_chart: help_chart
      });
      if(res.code == 200){
        Toast('发表成功');
        this.$router.replace('/help');
      } else {
        Toast('发表失败，请重新发表');
        this.$router.replace('/help');
      }
    },
    onClickLeft() {
      Toast('取消成功');
      this.$router.replace('/help');
    },
  },
};
</script>

<style scoped>
.mytext {
  color:white;
  font-family:"楷体";
  text-align:center;
  font-size: 30px;
}
.van-nav-bar__title {
    color: #FFF;
    font-weight: 600;
    font-size: 30px;
}
.van-nav-bar .van-icon {
    color: #fff;
}
.van-nav-bar__text {
    color: #FFF;
}
.van-nav-bar__title.van-ellipsis {
    font-family:"楷体";
    font-size: 40px;
    height: 30px; 
    color: #FFF;
}
   .van-nav-bar {
    padding: 50px;
 }
   .boxadd {
    width:90%;
    height: 550px;
    border:2px solid white;
    border-radius:20px;
    box-shadow:0px 10px 20px 20px #e3ecec;
    margin: 20px auto;
  }
  .van-uploader {
    position: absolute;
    bottom: 0px;
  }
</style>
