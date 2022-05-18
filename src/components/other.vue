<template>
  <div>
    <van-nav-bar
      title="ta的主页"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- <div
      class="bg"
      v-bind:style="{background: 'url('+ bgUrl +')'}"
    ></div> -->
    <div class="head">
      <van-image
        class="img"
        round
        width="1.5rem"
        height="1.5rem"
        :src="avarUrl"
        @click="showAvar()"
      />
      <div class="text">
        <div class="nickname">{{username}}</div>
      </div>
    </div>

    <div
      class="container"
      v-for="(item,index) in dynamic"
    >
      <template v-if="item.comment_state===2">
        <img
          src="../assets/happy.png"
          alt=""
          style="width:1.25rem;padding-left:3.72rem;"
        >
      </template>
      <template v-if="item.comment_state===3">
        <img
          src="../assets/angry.png"
          alt=""
          style="width:1.25rem;padding-left:3.72rem;"
        >
      </template>
      <template v-if="item.comment_state===1">
        <img
          src="../assets/sad.png"
          alt=""
          style="width:1.25rem;padding-left:3.72rem;"
        >
      </template>
      <div class="status_detail">
        <div class="content">{{item.comment_article}}</div>
        <div class="content_img">
          <van-image
            v-if="item.comment_chart!=null"
            width="350"
            height="180"
            :src="item.comment_chart"
            fit="cover"
            @click="imgPreview(item.comment_chart)"
          />
        </div>

      </div>

      <van-row
        type="flex"
        justify="end"
        style="margin-top:0.2rem"
      >
        <van-col span="4">
          <van-checkbox
            v-model="checked"
            @click="clickBox(item.id)"
          >
            <template #icon="props">
              <img
                class="img-icon"
                :src="props.checked ? activeIcon : inactiveIcon"
              />
            </template>
          </van-checkbox>
          <div style="margin-left: 0.4rem;margin-top: -0.3rem;font-size:0.35rem;">{{num[index]}}</div>
        </van-col>
      </van-row>

      <div
        class="show_nickName"
        v-if="likeNum===1"
      >{{msg[index]}}觉得很赞</div>

      <!-- 评论输入框 -->
      <!-- <div class="ipt">
        <van-field
          v-model="message"
          rows="1"
          autosize
          type="textarea"
          placeholder="说点什么吧..."
        />
      </div> -->
      <!-- 评论信息展示 -->
      <article_comment
        :id="userid"
        :content="item.comment_article"
        :userName="username"
      />
    </div>
  </div>
</template>

<script>
import article_comment from "../view/article-component/article_comment";
import { ImagePreview } from "vant";
export default {
  name: "ImagePreview",
  components: {
    article_comment,
  },
  data() {
    return {
      userid: "",
      checked: false,
      activeIcon: require("../assets/heart.png"),
      inactiveIcon: require("../assets/heart1.png"),
      message: "",
      username: "",
      avarUrl: "",
      num: [],
      msg: [],
      likeNum: "0",
      dynamic: [],
    };
  },
  created() {
    this.getParams();
  },
  methods: {
    async getParams() {
      // 取到路由带过来的参数
      var routerId = this.$route.params.userid;
      var routerImg = this.$route.params.img;
      var routerName = this.$route.params.username;
      this.avarUrl = routerImg;
      this.username = routerName;
      // 将数据放在当前组件的数据内
      this.userid = routerId;
      const { data: res } = await this.$http.get(
        "/api/friend/other?userid=" + this.userid
      );
      if (res.code == 200) {
        var str = "";
        this.dynamic = res.data.res1;
        const wqlist = this.wq(res.data.res2);
        for (let i = 0; i < wqlist.length; i++) {
          for (let j = 0; j < wqlist[i].length; j++) {
            if (wqlist[i].length == 0) {
              this.likeNum = 0;
            } else {
              this.likeNum = 1;
              this.num.push(wqlist[i].length);
              str += wqlist[i][j] + "、";
            }
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
          name1.push(data[key][i].praise_name);
        }
        nameList.push(name1);
        name1 = [];
      });
      return nameList;
    },
    onClickLeft() {
      this.$router.push("/homepage");
    },
    imgPreview(img) {
      ImagePreview([img]);
    },
    showAvar() {
      ImagePreview([this.avarUrl]);
    },
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
  },
  watch: {
    $route: "getParams",
  },
};
</script>

<style scoped>
.head {
  display: flex;
  background: black;
}

.head .img {
  margin-top: 2rem;
  margin-left: 0.35rem;
}

.text {
  font-size: 0.45rem;
  line-height: 1.5rem;
  margin-left: 0.22rem;
  margin-top: 2rem;
}

.text .nickname {
  color: #fff;
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

.content {
  font-size: 0.4rem;
  text-align: left;
  padding-top: 0.25rem;
}

.content_img {
  overflow: hidden;
  margin-top: 0.4rem;
  text-align: center;
}

.show_nickName {
  overflow: hidden;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  margin-top: 0.2rem;
}

.img-icon {
  height: 100%;
}

.comment .comment_img {
  width: 0.45rem;
}

.ipt {
  margin-top: 0.5rem;
}

.show_comment {
  padding-top: 0.45rem;
}
</style>