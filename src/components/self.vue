<template>
  <div class="all">
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="isLoading"
      success-text="刷新成功"
      @refresh="onRefresh"
    >

      <div
        class="headpic"
        :style="{'background-image':'url('+require('../assets/wallhaven-g7mqkl_1920x1080.png')+')'}"
        @click="show = true"
        :data="form"
        :key="form.id"
      >

        <!-- 背景图片 -->
        <p>我的动态
          <van-icon
            name="replay"
            @click="clickchange"
          />
        </p>
        <!-- 头像 -->
        <div class="touxiang">
          <van-image
            round
            width="1.5rem"
            height="1.5rem"
            :src="form.userid"
          />
          <p>{{form.user_name}}</p>
        </div>
      </div>

      <div class="nav">
        <button @click="lookcomment">查看所有评论
          <van-icon name="chat-o" />
        </button>
      </div>
      <!-- 点击切换图片 -->
      <van-action-sheet
        v-model="show"
        :actions="actions"
        cancel-text="取消"
        close-on-click-action
        @cancel="onCancel"
      />

      <div
        class="container"
        :data="friendform"
        v-for="item in friendform"
        :key="item.id"
      >
        <div class="garbage">
          <van-icon
            name="delete-o"
            size="0.6rem"
            @click="deletes(item)"
          />
        </div>
        <div class="xinqing">
          <van-image
            width="1.5rem"
            height="1.5rem"
            src="https://gitee.com/zj095/cloudimg/raw/master/202111111025466.png"
            v-if="item.comment_state == 1"
          />
          <van-image
            width="1.5rem"
            height="1.5rem"
            src="https://gitee.com/zj095/cloudimg/raw/master/202111081114359.png"
            v-if="item.comment_state == 2"
          />
          <van-image
            width="1.5rem"
            height="1.5rem"
            src="https://gitee.com/zj095/cloudimg/raw/master/202111081649792.png"
            v-if="item.comment_state == 3"
          />
        </div>
        <div class="tell">
          <div class="dynamic">{{item.comment_article}}</div>
          <div class="tell-pic">
            <!-- 图片 -->
            <van-grid
              :border="false"
              :column-num="1"
            >
              <van-grid-item>
                <van-image :src="item.comment_chart" />
              </van-grid-item>
            </van-grid>
            <!-- 点赞 -->
            <div class="like">
              <img
                src="https://gitee.com/zj095/cloudimg/raw/master/202111081227936.png"
                alt=""
              >
              <p
                v-for="(item,index) in  item.dianzanren"
                :key="index"
              >{{item}}</p>
            </div>
            <!-- 评论 -->
            <div class="comment">
              <div
                class="othercomment"

              >
                <div>
                  <van-icon
                    name="chat-o"
                    size="0.6rem"
                  /> {{item.comment_name}}:{{item.pinglun}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
      <br>
      <br>
      <br>
    </van-pull-refresh>
  </div>
</template>

<script>
import { Toast } from "vant";
import { ImagePreview } from "vant";
import { Popup } from "vant";

export default {
  created() {
    // this.getuserlist();
    this.getuserlist1();
  },
  components: {
    [ImagePreview.Component.name]: ImagePreview.Component,
  },
  data() {
    return {
      dianzanren: [],
      idid: [],
      dynamic: [],
      form: [
        {
          userid: "",
        },
      ],
      friendform: [],
      show: false,
      count: 0,
      isLoading: false,
      actions: [{ name: "从相册选择" }],
    };
  },

  methods: {


    async getuserlist1() {

      //获取名字
      var user_name = sessionStorage.getItem("user_name", this.user_name);

      this.form.user_name = user_name;
      // 获取头像

       var imformation = JSON.parse(sessionStorage.getItem("data"));

      const { data: res0 } = await this.$http.get(
        "/api/dingding/photo?userid=" + imformation.userid
      );

      if (res0.code == 200) {

        // 赋值

        this.form.userid = res0.data;

      }
      if (res0.code == 100) {
        this.$message.error("获取失败！");
      }
      // 展示动态
      const { data: res1 } = await this.$http.get(
        "/api/friend/other?userid=" + imformation.userid
      );

      for (var i = 0; i < res1.data.res1.length; i++) {

        this.idid.push(res1.data.res1[i].id);
        this.dynamic.push(res1.data.res1[i].comment_article);
      }

      if (res1.code == 200) {

        // 赋值
        this.friendform = res1.data.res1;
        const { data: res2 } = await this.$http.post("/api/friend/creply", {
          comment_userid: imformation.userid,
          user_article: this.dynamic,
        });

        if (res2.code == 200) {

          for (var i = 0; i < res2.data.length; i++) {
            this.friendform[i]["comment_name"] = res2.data[i].comment_name;
            this.friendform[i]["pinglun"] = res2.data[i].comment_article;
          }

        }
        if (res2.code == 100) {
          this.$message.error("查看失败！");
        }
      }
      if (res1.code == 100) {
        this.$message.error("展示失败！");
      }
      // 展示赞的人
      for (var k = 0; k < this.idid.length; k++) {
        const { data: res3 } = await this.$http.get(
          "/api/friend/getpraise?comment_id=" + this.idid[k]
        );

        if (res3.code == 200) {

          for (var i = 0; i < this.friendform.length; i++) {
            for (var j = 0; j < res3.data.length; j++) {
              this.dianzanren.push(res3.data[i].praise_name);
              this.friendform[i]["dianzanren"] = this.dianzanren;
              this.dianzanren.push(res3.data[i].praise_name);
            }
          }
        }
      }
    },
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        this.count++;
      }, 1000);
    },
    onCancel() {
      this.$Toast("取消");
    },
    lookcomment() {
      this.$router.push("/survey");
    },
    clickchange() {
      this.$router.push("/myhelp");
    },
    deletes(item) {
      this.$dialog
        .alert({
          message: "确认删除该动态？", //改变弹出框的内容
          showCancelButton: true, //展示取消按钮
        })
        .then(async () => {
          const { data: res4 } = await this.$http.post("/api/friend/deletec", {
            id: item.id,
          });
          this.getuserlist();
          this.getuserlist1();
        })
        .catch(() => {
        });
    },
  },
};
</script>

<style scoped>
.all {

  background-color: #fff;
}
.headpic p {
  color: #fff;
  text-align: center;
  font-size: 30px;

}

.headpic {

  background-size: 100% 100%;

  box-sizing: border-box;

  height: 6.5rem;

  margin-top: -0.78rem;
}
.bgc {
  height: 100%;
  width: 100%;
}
.touxiang {
  margin-top: 183px;
  margin-left: 0.4rem;
}
.touxiang p {
  color: #fff;
  font-size: 0.5rem;
  margin-left: -5.5rem;
  margin-top: -1.15rem !important;
}
.nav {
  margin: 12px;
}
.nav button {
  border: 0;
  margin-left: 3.3rem;
}
.dynamic {
  margin-left: 12px;
  font-size: 20px;
}
.xinqing {

  text-align: center;
}
.like {
  display: flex;
  align-items: center;
  margin-left: 5px;
}
.like img {
  height: 0.63rem;
}
.like p {
  font-size: -1.44444rem;
  margin-left: 10px;
}
.container {
  border: 2px solid white;
  margin-bottom: 20px !important;
  margin: 0 auto;
  height: 100%;
  width: 92%;
  background-color: #fff;
  border-radius: 0.29333rem;
  box-shadow: 5px 35px 75px 75px #e3ecec;
}
.garbage {
  padding-top: 12px;
  margin-left: 8.5rem;
}
.tell p {
  font-size: 25px;
}
.othercomment {
  margin-left: 5px;
  padding-bottom: 7px;
  margin-bottom: 10px;
}
</style>
