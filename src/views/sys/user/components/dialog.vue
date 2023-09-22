<template>
  <el-dialog :title="dialogTitle" width="30%" @close="handleClose">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="form.username"
          :disabled="form.id == -1 ? false : 'disabled'"
        />
        <el-alert
          v-if="form.id == -1"
          title="默认初始密码：123456"
          :closable="false"
          style="line-height: 10px"
          type="success"
        >
        </el-alert>
      </el-form-item>

      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="form.phonenumber" max="11" />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="'0'">正常</el-radio>
          <el-radio :label="'1'">禁用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="所属部门" prop="deptId">
        <el-cascader
          :options="deptListOptions"
          :props="parentDeptIdPops"
          filterable
          v-model="form.deptId"
          @change="HandleChangeParentDeptId, initDeptTreeList"
          @click="initDeptTreeList"
          placeholder="请选择所属部门..."
          style="width: 100%"
        />
      </el-form-item>
      <el-form-item label="选择所属岗位">
        <el-select
          v-model="form.positionId"
          @change="HandleChangePositionId"
          placeholder="请选择所属岗位..."
          @click="HandleGetPositionListOption"
          style="width: 100%"
        >
          <el-option
            v-for="item in positionListOptions"
            :props="positionIdPops"
            v-model="item.positionId"
            :key="item.positionId"
            :label="item.positionName"
            :value="item.positionId"
          />
        </el-select>
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
import requestUtil, { getServerUrl } from "@/util/request";
import { ElMessage } from "element-plus";
import { queryUserById, checkUserName, saveUserInfo } from "@/api/sys/user";
import { getDeptTreeList, getPositionListNoPage } from "@/api/sys/dept";
import store from "@/store";

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);

const props = defineProps({
  id: {
    type: Number,
    default: -1,
    required: true,
  },
  dialogTitle: {
    type: String,
    default: "",
    required: true,
  },
  dialogVisible: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const form = ref({
  id: -1,
  username: "",
  password: "123456",
  status: "0",
  phonenumber: "",
  deptId: "",
  positionId: "",
  email: "",
  remark: "",
  updatedBy: currentUser.value.username,
});

const checkUsername = async (rule, value, callback) => {
  if (form.value.id == -1) {
    // const res = await requestUtil.post("sys/user/checkUserName", {
    //   username: form.value.username,
    // });
    const res = await checkUserName(form.value.username);
    if (res.data.code == 500) {
      callback(new Error("用户名已存在！"));
    } else {
      callback();
    }
  } else {
    callback();
  }
};

const rules = ref({
  deptId: [{ required: true, message: "请输入选择所属部门" }],
  positionId: [{ required: true, message: "请输入选择所属岗位" }],
  username: [
    { required: true, message: "请输入用户名" },
    { required: true, validator: checkUsername, trigger: "blur" },
  ],
  email: [
    { required: true, message: "邮箱地址不能为空", trigger: "blur" },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  phonenumber: [
    { required: true, message: "手机号码不能为空", trigger: "blur" },
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
});

const formRef = ref(null);

const initFormData = async (id) => {
  // const res = await requestUtil.get("sys/user/" + id);
  const res = await queryUserById(id);
  form.value = res.data.sysUser;
};

watch(
  () => props.dialogVisible,
  () => {
    let id = props.id;
    console.log("id=" + id);
    if (id != -1) {
      initFormData(id);
      initDeptTreeList();
    } else {
      form.value = {
        id: -1,
        username: "",
        password: "123456",
        status: "0",
        phonenumber: "",
        deptId: "",
        positionId: "",
        email: "",
        remark: "",
        updatedBy: currentUser.value.username,
      };
    }
  }
);

//======部门、岗位组件方法======================================================================

//部门级联选择器
const parentDeptIdPops = {
  checkStrictly: true,
  value: "deptId",
  label: "deptName",
};
//岗位选择器
const positionIdPops = {
  checkStrictly: true,
  value: "positionId",
  label: "positionName",
};

const deptListOptions = ref([]);
const positionListOptions = ref([]);

const HandleChangeParentDeptId = (value) => {
  let selectedDept = 0;
  if (value && value.length > 0) {
    selectedDept = value[value.length - 1]; // 获取最后一个选中的项
    console.log("当前选中的项value：", selectedDept);
  }
  form.value.deptId = selectedDept;
  console.log("当前选中的项对应form.parentDeptId：", form.value.parentDeptId);
};

const HandleChangePositionId = () => {
  console.log("当前选中的项对应 form.value.positionId", form.value.positionId);
};
const emits = defineEmits(["update:modelValue", "initUserList"]);

const handleClose = () => {
  emits("update:modelValue", false);
};
//======接口调用======================================================================

const initDeptTreeList = async () => {
  const res = await getDeptTreeList();
  deptListOptions.value = res.data.treeDept;
};

const HandleGetPositionListOption = async () => {
  const result = await getPositionListNoPage();
  positionListOptions.value = result.data.positionList;
};

const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // let result = await requestUtil.post("sys/user/save", form.value);
      let result = await saveUserInfo(form.value);
      let data = result.data;
      if (data.code == 200) {
        ElMessage.success("执行成功！");
        formRef.value.resetFields();
        emits("initUserList");
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
