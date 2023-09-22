<template>
  <el-dialog
    model-value="dialogVisible"
    :title="dialogTitle"
    width="30%"
    @close="handleClose"
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="上级部门" prop="parentDeptId">
        <el-cascader
          :options="deptListOptions"
          :props="parentDeptIdPops"
          filterable
          v-model="form.parentDeptId"
          @change="HandleChangeParentDeptId"
          @click="getDeptTreeList"
          placeholder="请选择上级部门..."
        />
      </el-form-item>

      <el-form-item label="部门状态" prop="deptStatus" label-width="100px">
        <el-radio-group v-model="form.deptStatus">
          <el-radio :label="'0'">禁用</el-radio>
          <el-radio :label="'1'">启用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="部门名称" prop="deptName">
        <el-input v-model="form.deptName" />
      </el-form-item>

      <el-form-item label="部门编码" prop="deptCode">
        <el-input v-model="form.deptCode" />
      </el-form-item>

      <el-form-item label="部门描述" prop="remark">
        <el-input v-model="form.remark" />
      </el-form-item>
      <el-form-item label="部门主管" prop="deptLeader">
        <el-select
          v-model="form.deptLeader"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="3"
          placeholder="请选择员工..."
          @click="HandleGetUserListOption"
        >
          <el-option
            v-for="item in selectUserListOptions"
            v-model="item.value"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门电话" prop="deptTel">
        <el-input v-model="form.deptTel" />
      </el-form-item>
      <el-form-item label="显示顺序" prop="orderNum">
        <el-input-number
          v-model="form.orderNum"
          :min="1"
          label="显示顺序"
        ></el-input-number>
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
import { ElMessage } from "element-plus";
import { addDeptById, selectDeptById, getDeptTreeList } from "@/api/sys/dept";
import { getUserListOption } from "@/api/sys/user";
import store from "@/store";
//======常量定义======================================================================

//当前登录人信息
const currentUser = ref(store.getters.GET_USERINFO);

const tableData = ref([]);

//组件传参
const props = defineProps({
  deptId: {
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
  tableData: {
    type: Array,
    default: [],
    required: true,
  },
});

const form = ref({
  deptId: -1,
  parentDeptId: 0,
  deptName: "",
  deptCode: "",
  deptLeader: "",
  deptTel: "",
  deptStatus: "1",
  orderNum: 1,
  remark: "",
  updatedBy: currentUser.value.username,
});

const rules = ref({
  parentDeptId: [{ required: true, message: "请选择上级部门" }],
  deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
  deptLeader: [
    { required: true, message: "部门主管不能为空", trigger: "blur" },
  ],
  deptCode: [{ required: true, message: "部门编码不能为空", trigger: "blur" }],
  deptTel: [
    { required: true, message: "部门联系电话不能为空", trigger: "blur" },
  ],
  remark: [{ required: true, message: "部门描述不能为空", trigger: "blur" }],
});

const formRef = ref(null);
const selectUserListOptions = ref([]);

//监听
watch(
  () => props.dialogVisible,
  () => {
    console.log("watch监听props.deptId=" + props.deptId);
    let id = props.deptId;
    tableData.value = props.tableData;
    initDeptTreeList();
    if (id != -1) {
      initFormData(id);
    } else {
      form.value = {
        deptId: -1,
        parentDeptId: 0,
        deptName: "",
        deptCode: "",
        deptLeader: "",
        deptTel: "",
        deptStatus: "1",
        orderNum: 1,
        remark: "",
        updatedBy: currentUser.value.username,
      };
    }
  }
);

//部门级联选择器
const parentDeptIdPops = {
  checkStrictly: true,
  value: "deptId",
  label: "deptName",
};

const deptListOptions = ref([]);
//======组件方法======================================================================

const emits = defineEmits(["update:modelValue", "initDeptTreeList"]);

const HandleChangeParentDeptId = (value) => {
  let selectedDept = 0;
  if (value && value.length > 0) {
    selectedDept = value[value.length - 1]; // 获取最后一个选中的项
    console.log("当前选中的项value：", selectedDept);
  }
  form.value.parentDeptId = selectedDept;
  console.log("当前选中的项对应form.parentDeptId：", form.value.parentDeptId);
};
const handleClose = () => {
  emits("update:modelValue", false);
};

//======接口调用======================================================================

const initDeptTreeList = async () => {
  const res = await getDeptTreeList();
  deptListOptions.value = res.data.treeDept;
};

const HandleGetUserListOption = async () => {
  const result = await getUserListOption();
  selectUserListOptions.value = result.data.userListForOptions;
};

//根据部门id初始化
const initFormData = async (id) => {
  const res = await selectDeptById(id);
  form.value = res.data.sysDept;
};

//保存、创建部门
const handleConfirm = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      let result = await addDeptById(form.value);
      let data = result.data;
      if (data.code == 200) {
        ElMessage.success("执行成功！");
        formRef.value.resetFields();
        emits("initDeptTreeList");
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

<style scoped>
</style>
