<template>
  <div class="article-comments">
    <div class="ipt">
      <van-cell-group>
        <van-field
          clearable
          placeholder="说点什么吧..."
          v-model="message"
          autosize
          type="textarea"
          rows="1"
        >
          <van-button
            slot="button"
            size="small"
            type="info"
            round
            @click="onAddComment()"
          >发布</van-button>
        </van-field>
      </van-cell-group>
    </div>
    <!-- 评论列表 -->
    <div class="show_comment">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell v-for="(item,index) in commentList" :key="index">
          <!-- <van-image
          slot="icon"
          round
          width="1rem"
          height="1rem"
          style="margin-right: 10px;"
          :src="commentList.avarImg"
        /> -->
          <div
            class="text"
            slot="title"
          >
            <div style="color: #466b9d;">{{item.comment_name}}：</div>
            <div style="color: #363636;">{{item.comment_article}}</div>
          </div>
          <div slot="label">
            <van-button
              size="mini"
              type="default"
              @click="show=true"
            >回复</van-button>
          </div>

        </van-cell>
      </van-list>
    </div>
    <van-popup
      v-model="show"
      position="bottom"
      :style="{ height: '1.2rem' }"
    >
      <van-cell-group>
        <van-field
          clearable
          placeholder="说点什么吧..."
          v-model="message1"
          autosize
          type="textarea"
          rows="1"
        >
          <van-button
            slot="button"
            size="small"
            type="info"
            round
            @click="replyComment()"
          >发布</van-button>
        </van-field>
      </van-cell-group>
    </van-popup>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <!-- <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容">
        <van-button slot="button" size="mini" type="info">发布</van-button>
      </van-field>
    </van-cell-group> -->
    <!-- /发布评论 -->
  </div>
</template>

<script>

export default {
  name: "ArticleComment",
  props: ["id", "content","userName"],
  data() {
    return {
      show: false,
      // showList:"1",
      list: [], // 评论列表
      postList: [], //发表新的评论
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束,
      message: "",
      message1: "",
      userid: "",
      commentList: [],
    };
  },
  created() {
    this.showComment();
  },
  methods: {
    async showComment() {
      const { data: res } = await this.$http.post("/api/friend/creply", {
        comment_userid: this.id,
        user_article: this.content,
      });
      if (res.code == 200) {
        for(let i = 0; i < res.data.length; i++) {
          this.commentList.push(res.data[i])
        }
        
      }
      
    },
    onLoad() {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }
        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 12) {
          this.finished = true;
        }
      }, 500);
    },
    async onAddComment() {
      const inputComment = this.message.trim();
      const userDataStr = sessionStorage.getItem("data");
      const userData = JSON.parse(userDataStr);
      const { data: res } = await this.$http.post("/api/friend/creplys", {
        comment_name: userData.user_name,
        comment_article: inputComment,
        userid: userData.userid,
        comment_userid: this.id,
        user_name: this.userName,
        user_article: this.content,
      });
      console.log(res);
      if(res.code == 200) {
        this.message = "";
        this.commentList.push({comment_name:userData.user_name,comment_article:inputComment})
        
      }
    },
    async replyComment() {
      const inputComment = this.message1.trim();
      const userDataStr = sessionStorage.getItem("data");
      const userData = JSON.parse(userDataStr);
      console.log(this.content);
      const { data: res } = await this.$http.post("/api/friend/creplys", {
        comment_name: userData.user_name,
        comment_article: inputComment,
        userid: userData.userid,
        comment_userid: this.id,
        user_name: this.userName,
        user_article: this.content,
      });

      console.log(res);
      if(res.code == 200) {
        this.message1 = "";
        this.commentList.push({comment_name:userData.user_name,comment_article:inputComment})
        
      }
    },
  },
};
</script>

<style scoped>
/* .publish-wrap {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
  } */
.ipt {
  padding-top: 0.45rem;
}

.text {
  display: flex;
}

.show_comment {
  padding-top: 0.45rem;
}
</style>
