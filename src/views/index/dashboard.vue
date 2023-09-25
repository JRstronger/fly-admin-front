<template>
  <div class="dashboardContainer">
    <el-row :gutter="20">
      <!-- 左边图表 -->
      <el-col :span="6" class="LeftContainer">
        <el-col :span="50">
          <p class="MiddleContainerTopTitleName">
            {{ realDate }}{{ currentDayOfWeek }}
          </p>
          <dv-decoration-8 class="LeftContainer0" />
        </el-col>
        <el-col :span="50" class="LeftContainer1"
          ><dv-border-box-11 title="dv-border-box-11" class="LeftContainer1"
            >dv-border-box-11</dv-border-box-11
          ></el-col
        >
        <el-col :span="50" class="LeftContainer1">
          <dv-border-box-10 class="LeftContainer1"
            >dv-border-box-10</dv-border-box-10
          >
        </el-col>
        <el-col :span="50" class="LeftContainer1"
          ><dv-border-box-10 class="LeftContainer1"
            >dv-border-box-10</dv-border-box-10
          ></el-col
        >
        <el-col :span="50" class="LeftContainer1"
          ><dv-border-box-10 class="LeftContainer1"
            >dv-border-box-10</dv-border-box-10
          ></el-col
        >
      </el-col>
      <!-- 中间图表 -->
      <el-col :span="12" class="MiddleContainer">
        <el-col :span="150" class="MiddleContainerTopTitle">
          <H1 class="MiddleContainerTopTitleName">飞流工作室·仪表盘</H1>
          <dv-decoration-5 class="MiddleContainerTopTitleBottom" />
        </el-col>
        <el-col :span="150">
          <el-col :span="5" class="MiddleContainer1DataItemList">
            <dv-border-box-12>
              <h1 class="itemNumber">12</h1>
              <h3 class="itemText">今日接收总数</h3>
            </dv-border-box-12>
          </el-col>
          <el-col :span="5" class="MiddleContainer1DataItemList">
            <dv-border-box-12>
              <h1 class="itemNumber">12</h1>
              <h3 class="itemText">今日制备总数</h3></dv-border-box-12
            >
          </el-col>
          <el-col :span="5" class="MiddleContainer1DataItemList">
            <dv-border-box-12>
              <h1 class="itemNumber">12</h1>
              <h3 class="itemText">今日存储总数</h3></dv-border-box-12
            >
          </el-col>
          <el-col :span="5" class="MiddleContainer1DataItemList">
            <dv-border-box-12>
              <h1 class="itemNumber">12</h1>
              <h3 class="itemText">今日废弃总数</h3></dv-border-box-12
            >
          </el-col>
        </el-col>
      </el-col>

      <!-- 右边图表 -->
      <el-col :span="6" class="RightContainer">
        <el-col :span="50">
          <dv-decoration-8 :reverse="true" class="LeftContainer0" />
        </el-col>
        <el-col :span="50">
          <dv-border-box-13 class="LeftContainer1"> </dv-border-box-13>
          <dv-border-box-13 class="LeftContainer1"> </dv-border-box-13>
          <dv-border-box-13 class="LeftContainer1"> </dv-border-box-13>
          <dv-border-box-13 class="LeftContainer1"> </dv-border-box-13>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
const realDate = ref(new Date());

// 在组件挂载时启动定时任务
onMounted(() => {
  // 每一秒钟更新 realDate 的值
  const timerId = setInterval(() => {
    realDate.value = formatDate(new Date());
    currentDayOfWeek.value = getDayOfWeek(new Date());
  }, 1000);

  // 在组件销毁时停止定时任务
  onUnmounted(() => {
    clearInterval(timerId);
  });
});
//格式化日期时间
const formatDate = (date) => {
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

// 获取星期几函数
const getDayOfWeek = (date) => {
  const dayOfWeek = date.getDay();
  const weekdays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return weekdays[dayOfWeek];
};
const currentDayOfWeek = ref(getDayOfWeek(new Date()));
</script>
<style lang="scss">
.dashboardContainer {
  width: 100%;
  height: 100%;
  color: #c0d3ff;
  background-color: black;
  font-family: DingTalkJinBuTi;
}

.LeftContainer,
.MiddleContainer,
.RightContainer {
  height: 910px;
  border: 1px solid #333131;
}
.LeftContainer0 {
  height: 30px;
  margin-top: 40px;
}
.LeftContainer1 {
  height: 200px;
  margin-top: 10px;
}
.MiddleContainer {
  align-content: center;
}
.MiddleContainerTopTitle {
  height: 60px;
  margin-top: 30px;
}
.MiddleContainerTopTitleName {
  text-align: center;
  font-size: 20px;
  font-family: DingTalkJinBuTi;
  background-image: -webkit-linear-gradient(left, rgb(39, 39, 196), white);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.MiddleContainerTopTitleBottom {
  height: 30px;
}
.MiddleContainer1DataItemList {
  margin-left: 30px;
  width: 300px;
  float: left;
  height: 100px;
}
.MiddleContainer1DataItemList .itemNumber {
  padding-left: 10px;
  font-size: 30px;
  padding-top: 20px;
}
.MiddleContainer1DataItemList .itemText {
  padding-top: 10px;
  padding-left: 10px;
}
.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
