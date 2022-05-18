<template>
  <div>
    <van-dialog
      v-model="showDialog"
      title="上传背景图片"
      show-cancel-button
      :before-close="beforeClose"
    >
      <div style="margin:0.3rem auto;width:2rem;">
        <van-uploader
          v-model="fileList"
          class="uploadImg"
          :max-count="1"
          :after-read="afterRead"
        />
      </div>
    </van-dialog>
    <!-- 点击背景图片弹出动作面板组件 -->
    <van-action-sheet
      v-model="show"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @cancel="show=false"
      @select="onSelect"
    />
    <!-- 主页背景图片 -->
    <div
      class="head"
      v-bind:style="{background: 'url('+ img +')'}"
      @click="show=true"
    >
      <!-- 加号点击发布 -->
      <van-row>
        <van-col
          offset="22"
          style="margin-top:0.28rem"
        >
          <router-link :to="{path:'issue'}">
            <img
              src="../assets/plus.png"
              alt=""
              class="plus_img"
            >
          </router-link>
        </van-col>
      </van-row>
    </div>
    <!-- 动态内容 -->
    <div
      class="container"
      v-for="(item,index) in dynamic"
      :key="item.id"
    >
      <!-- 今日心情展示 -->
      <img
        class="emoImg"
        src="../assets/happy.png"
        v-if="item.comment_state===2"
      >
      <img
        class="emoImg"
        src="../assets/sad.png"
        v-if="item.comment_state===1"
      >
      <img
        class="emoImg"
        src="../assets/angry.png"
        v-if="item.comment_state===3"
      >

      <div class="dd">
        <!-- 动态列表头像 -->
        <van-image
          width="1.5rem"
          height="1.5rem"
          :src="item.user_chart"
          fit="cover"
          round
          @click="otherHome(item.userid,item.user_chart,item.comment_name)"
        />
        <!-- 用户名字 -->
        <div class="text">
          <div class="name">{{item.comment_name}}</div>
        </div>
      </div>
      <!-- 动态内容 -->
      <div class="status_detail">
        <div class="content">{{item.comment_article}}</div>
        <div class="content_img">
          <van-image
            width="350"
            height="200"
            :src="item.comment_chart"
            fit="cover"
            v-if="item.comment_chart!=null"
            @click="imgPreview(item.comment_chart)"
          />
        </div>
      </div>
      <!-- 点赞评论区 -->

      <van-row
        type="flex"
        justify="end"
        style="margin-top:0.2rem"
      >
        <van-col span="4">
          <van-checkbox
            v-model="checked"
            :id="item.id"
            @click="clickBox(item.id)"
          >
            <template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? activeIcon : inactiveIcon"
              />
            </template>
          </van-checkbox>
          <div style="margin-left: 0.4rem;margin-top: -0.28rem;font-size:0.35rem;">{{num[index]}}</div>
        </van-col>
      </van-row>

      <!-- 点赞信息展示 -->
      <div class="show_nickName">{{msg[index]}}觉得很赞</div>
      <!-- 评论输入框 -->

      <!-- 评论信息展示 -->
      <article_comment
        :id="item.userid"
        :content="item.comment_article"
        :userName="item.comment_name"
      />

    </div>
  </div>
</template>

<script>
import article_comment from "../view/article-component/article_comment";
import { ImagePreview } from "vant";
import { Notify } from "vant";
var bgUrl = localStorage.getItem("bgImg");
export default {
  name: "ImagePreview",
  components: {
    article_comment,
    [Notify.Component.name]: Notify.Component,
  },
  data() {
    return {
      id: "1",
      fileList: [],
      showDialog: false,
      checked: false,
      activeIcon: require("../assets/heart1.png"),
      inactiveIcon: require("../assets/heart.png"),
      img: bgUrl,
      num: [],
      show: false,
      msg: [],
      actions: [{ name: "预览图片" }, { name: "更换图片" }],
      dynamic: [],
      list: [],
      code: "3c02886544873ffbad01a7a0f6da76b8",
    };
  },
  created() {
    this.gainMessage();
    this.showDynamic();
  },
  methods: {
    // 获取用户的基本信息
    async gainMessage() {
      const code = this.code;
      const { data: res } = await this.$http.get(
        "/api/dingding/form?code=" + code
      );
      if (res.code == 200) {
        sessionStorage.setItem("user_name", res.data.user_name);
        window.sessionStorage.setItem("data", JSON.stringify(res.data));
      }
    },
    // 跳转他人的主页
    otherHome(userid, img, username) {
      this.$router.push({
        path: "/other",
        name: "other",
        params: { userid: userid, img: img, username: username },
      });
    },
    // 获取所有动态列表
    async showDynamic() {
      const { data: res } = await this.$http.get("/api/friend/all");
      if (res.code == 200) {
        var str = "";
        this.dynamic = res.data.res1;
        const wqlist = this.wq(res.data.res2);
        for (let i = 0; i < wqlist.length; i++) {
          for (let j = 0; j < wqlist[i].length; j++) {
            str += wqlist[i][j] + "、";
          }
          str = str.substring(0, str.length - 1);
          this.msg.push(str);
          str = "";
        }
      } else {
        Notify({ type: "danger", message: "获取动态信息失败！" });
      }
    },
    wq(data) {
      let name1 = [];
      const nameList = [];
      Object.keys(data).forEach((key) => {
        for (let i = 0; i < data[key].length; i++) {
          this.num.push(data[key].length);
          name1.push(data[key][i].praise_name);
        }
        nameList.push(name1);
        name1 = [];
      });
      return nameList;
    },
    // 预览背景图片
    onSelect(item) {
      this.show = false;
      if (item.name == "预览图片") {
        ImagePreview([this.img]);
      } else {
        this.showDialog = true;
      }
    },
    // 点赞
    async clickBox(id) {
      const userDataStr = sessionStorage.getItem("data");
      const userData = JSON.parse(userDataStr);
      if (this.checked == true) {
        const { data: res } = await this.$http.post("/api/friend/praise", {
          comment_id: id,
          praise_name: userData.user_name,
        });
      }
    },
    // 上传图片至服务器
    afterRead(file) {
      file.status = "uoloading";
      file.message = "上传中...";
      let formData = new FormData();
      formData.append("file", file.file);
      this.$http.post("/api/file/photo", formData).then((res) => {
        if (res.status == 200) {
          window.localStorage.setItem("bgImg", res.data.fileUrl);
        } else {
          Notify({ type: "danger", message: "图片失败！" });
        }
      });
    },
    beforeClose(action, done) {
      if (action === "confirm") {
        setTimeout(done, 1000);
      } else {
        done();
      }
    },
    imgPreview(img) {
      ImagePreview([img]);
    },
  },
};
</script>

<style scoped>
.head {
  height: 5rem;
  background-size: cover !important;
}

.plus_img {
  width: 0.6rem;
  height: 0.6rem;
}

.link {
  color: black;
  float: right;
}

.container {
  border-radius: 0.15rem;
  padding: 0.45rem;
  background: #f4f7fb;
  margin: 0.72rem auto !important;
  width: 8.5rem;
  box-shadow: -0.2px 1px 1px 1px #e5e5e5;
  overflow: auto;
}

.emoImg {
  width: 1rem;
  position: absolute;
  right: 0.8rem;
}

.dd {
  display: flex;
}

.text {
  font-size: 0.45rem;
  line-height: 0.6rem;
  margin-left: 0.22rem;
  margin-top: 0.45rem;
}

.text .name {
  color: cornflowerblue;
}

.content {
  font-size: 0.4rem;
  text-align: left;
  padding-top: 0.5rem;
  /* overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical; */
}

.content_img {
  overflow: hidden;
  margin-top: 0.4rem;
  text-align: center;
}

.show_nickName {
  /* overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical; */
  margin-top: 0.2rem;
}

.img-icon {
  height: 100%;
  /* position: absolute;
  right: 3.6rem;*/
}

.comment .comment_img {
  width: 0.44rem;
}

/* .publish-wrap {
  padding-top: 0.45rem;
} */
</style>
