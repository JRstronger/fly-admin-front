<template>
  <el-dialog
    model-value="childrenDialogVisible"
    :title="childrenDialogTitle"
    width="60%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="字典名称" prop="paramName">
        <el-input v-model="form.paramName" />
      </el-form-item>
      <el-form-item label="字段编码" prop="paramCode">
        <el-input v-model="form.paramCode" />
      </el-form-item>

      <el-form-item label="字段值" prop="paramValue">
        <el-input v-model="form.paramValue" />
      </el-form-item>

      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="4" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import { saveDict, queryDictById, checkDictCode } from "@/api/sys/dict";
import { ElMessage } from "element-plus";
import store from "@/store";
//======常量定义======================================================================

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);

//子字典值
const form = ref({
  id: -1,
  typeId: null,
  paramCode: "",
  paramName: "",
  paramValue: "",
  remark: "",
  updatedBy: currentUser.value.username,
});

const handleCheckDictCode = async (rule, value, callback) => {
  if (form.value.id == -1) {
    const res = await checkDictCode(form.value.paramCode);
    if (res.data.code == 500) {
      callback(new Error("编码已存在！"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const rules = ref({
  paramCode: [
    { required: true, message: "请输入字段编码" },
    { required: true, validator: handleCheckDictCode, trigger: "blur" },
  ],
});

const formRef = ref(null);

//======组件传递属性======================================================================
const props = defineProps({
  id: {
    type: Number,
    default: -1,
    required: true,
  },
  typeId: {
    type: Number,
    default: -1,
    required: true,
  },
  childrenDialogTitle: {
    type: String,
    default: "",
    required: true,
  },
  childrenDialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

watch(
  () => props.childrenDialogVisible,
  () => {
    let id = props.id;
    let typeId = props.typeId;
    console.log("typeId", typeId);
    console.log("id=" + id);
    if (id != -1) {
      initFormData(id);
    } else {
      form.value = {
        id: -1,
        typeId: typeId,
        paramCode: "",
        paramName: "",
        paramValue: "",
        remark: "",
        updatedBy: currentUser.value.username,
      };
    }
  }
);

const handleClose = () => {
  emits("update:modelValue", false);
};

const emits = defineEmits(["update:modelValue", "initChildrenFormData"]);

//======接口调用======================================================================

const initFormData = async (id) => {
  const res = await queryDictById(id);
  form.value = res.data.sysDictParam;
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result = await saveDict(form.value);
      let data = result.data;
      if (data.code == 200) {
        ElMessage.success("执行成功！");
        formRef.value.resetFields();
        emits("initChildrenFormData");
        handleClose();
      } else {
        ElMessage.error(data.msg);
      }
    } else {
      console.log("fail");
    }
  });
};
</script>

<style lang="scss" scoped>
</style>
