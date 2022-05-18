<template>
  <div>
    <van-nav-bar
      title="今日分享"
      left-text="取消"
      right-text="发表"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    >
    </van-nav-bar>

    <van-field
      v-model="message"
      class="text"
      rows="5"
      autosize
      type="textarea"
      maxlength="100"
      placeholder="分享新鲜事儿"
      show-word-limit
      border
      clearable
      min-height="200"
      :disabled="disabled"
    />
    <van-uploader
      class="img_upload"
      v-model="fileList"
      :max-count="1"
      :after-read="afterRead"
      :disabled="disabled"
    />
    <div class="emo">
      <div style="font-size:0.5rem;color: dodgerblue;margin-top: 0.5rem;">今日心情</div>
      <van-radio-group
        v-model="radio"
        class="radio"
        icon-size="20"
        checked-color="orange"
        :disabled="disabled"
      >
        <van-radio name="2" @click="radio === 2">
          <template>
            <img
              class="img-icon"
              src="../assets/happy.png"
              style="width: 2rem;"
            />
          </template>
        </van-radio>
        <van-radio name="3" @click="radio === 3">
          <template>
            <img
              class="img-icon"
              src="../assets/angry.png"
              style="width: 2rem;"
            />
          </template>
        </van-radio>
        <van-radio name="1" @click="radio === 1">
          <template>
            <img
              class="img-icon"
              src="../assets/sad.png"
              style="width: 2rem;"
            />
          </template>
        </van-radio>
      </van-radio-group>
    </div>
  </div>
</template>

<script>
import { Notify } from "vant";
export default {
  components: {
    [Notify.Component.name]: Notify.Component,
  },
  data() {
    return {
      disabled: false,
      message: "",
      fileList: [],
      radio: "",
      issue: {
        name: "",
        status: "",
        content: "",
        photo: "",
        uploadImg: "",
      },
    };
  },
  created() {
    this.userState();
  },
  methods: {
    async userState() {
      const userDataStr = sessionStorage.getItem("data");
      const userData = JSON.parse(userDataStr);
      const userId = userData.userid;
      const {data:res} = await this.$http.get('/api/friend/commstate?userid='+userId)
      if(res.code == 200) {
        if(res.data[0].state == 1) {
          Notify({ type: "danger", message: "您的账号已被禁用，无法发表动态！" });
          this.disabled = true;
        }
        else {
          this.onClickRight()
        }
      }
    },
    onClickLeft() {
      //Toast('返回');
      this.$router.push("/homepage");
    },
    afterRead(file) {
      file.status = "uoloading";
      file.message = "上传中...";
      let formData = new FormData();
      formData.append("file", file.file);
      this.$http.post("/api/file/photo", formData).then((res) => {
        this.uploadImg = res.data.fileUrl;
      });
    },
    async onClickRight() {
      const inputValue = this.message.trim();
      const userDataStr = sessionStorage.getItem("data");
      const userData = JSON.parse(userDataStr);
      const userName = userData.user_name;
      const userId = userData.userid;
      this.issue.content = inputValue;
      const { data: res } = await this.$http.post("/api/friend/psend", {
        comment_name: userName,
        comment_article: inputValue,
        userid: userId,
        comment_state: this.radio,
        comment_chart: this.uploadImg
      });
      if(res.code == 200) {
        this.$router.push("/homepage");
      }
    },
  },
};
</script>

<style scoped>
.img_upload {
  margin-left: 0.2rem;
  margin-top: 0.2rem;
}

.van-radio-group {
  margin-top: 0.8rem;
}

.van-radio-group .van-radio {
  padding: 0.4rem;
}

.emo .radio {
  display: flex;
}
</style>