<template>
  <el-dialog :title="dialogTitle" width="80%" @close="handleClose">
    <el-steps :active="active" finish-status="success">
      <el-step title="步骤 1" description="填写申请信息"></el-step>
      <el-step title="步骤 2" description="选择审批人/抄送人"></el-step>
      <el-step title="步骤 3" description="发起审批"></el-step>
    </el-steps>
    <br />
    <br />
    <br />
    <el-row :gutter="20">
      <el-col :span="8">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="流程名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="申请人">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="申请理由">
            <el-input type="textarea" v-model="form.desc"></el-input>
          </el-form-item>
        </el-form>
      </el-col>

      <el-col :span="8">
        <!-- <el-radio v-model="radio" label="1">会签（所有人都同意即可）</el-radio>
        <el-radio v-model="radio" label="2">或签（任意一个同意即可）</el-radio> -->
        <el-form-item label="选择审批模板">
          <el-select
            v-model="value"
            filterable
            placeholder="选择审批模板..."
            @change="handleChangeModel"
          >
            <el-option
              v-for="item in approval_model"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option> </el-select
        ></el-form-item>

        <el-select
          v-model="current_value"
          filterable
          v-for="item2 in current_approval_model"
          :key="item2.value"
          :label="item2.label"
          :value="item2.value"
        >
          <el-option
            v-for="item3 in current_approval_model"
            :key="item3.value"
            :label="item3.label"
            :value="item3.value"
          >
          </el-option>
        </el-select>
      </el-col>
      <el-col :span="8">
        <el-upload
          class="upload-demo"
          ref="upload"
          action="https://jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          ><br />
        </el-upload>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      current_approval_model: [
        {
          value: "fly",
          label: "飞流",
        },
      ],
      current_value: "",
      approval_model: [
        {
          value: "default",
          label: "默认模板",
          child_node: [
            {
              value: "fly",
              label: "飞流",
            },
          ],
        },
        {
          value: "level_2",
          label: "二级审批",
          child_node: [
            {
              label: "飞流",
            },
            {
              label: "飞流",
            },
          ],
        },
        {
          value: "level_3",
          label: "三级审批",
          child_node: [
            {
              label: "飞流",
            },
            {
              label: "飞流",
            },
            {
              label: "飞流",
            },
          ],
        },
      ],
      options: [
        {
          value: "Fly",
          label: "飞流",
        },
        {
          value: "Fly2",
          label: "飞流2",
        },
        {
          value: "Fly3",
          label: "飞流2",
        },
      ],
      value: "Fly",
      active: 0,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "food2.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
    };
  },

  methods: {
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    onSubmit() {
      console.log("submit!");
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleChangeModel(value) {
      this.current_approval_model = [];
      console.log("当前模板=" + value);
      this.approval_model.forEach((item) => {
        console.log("当前模板子节点=" + item.child_node[0].value);
        if (item.value == value) {
          console.log("item.value=" + item.value);
          this.current_approval_model = item.child_node;
          console.log(
            "this.current_approval_model=" +
              JSON.stringify(this.current_approval_model)
          );
        }
      });
    },
  },
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>