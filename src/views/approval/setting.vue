<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    :action="apiUrl"
    multiple
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :limit="10"
    :on-exceed="handleExceed"
    :on-success="handleAvatarSuccess"
  >
    <el-button type="primary">上传附件</el-button>

    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500KB.
      </div>
    </template>
  </el-upload>
  <el-button type="primary" @click="HandleUploadAttachmentFile"
    >提交到服务器</el-button
  >
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { UploadProps, UploadUserFile } from "element-plus";
import requestUtil, { getServerUrl } from "@/util/request";
import { UploadAttachmentFile } from "@/api/approval/approval";

const apiUrl = ref(getServerUrl() + "approval/uploadFile");
const squareUrl22 = ref(getServerUrl() + "image/userAvatar/test_word.pdf");
const squareUrl = ref(getServerUrl() + "image/userAvatar/fly_logo.png");

const fileList = ref([
  {
    id: 0,
    name: "",
    url: "",
  },
]);

const handleAvatarSuccess = (res) => {
  fileList.value[fileList.value.length + 1].id = fileList.value.length + 1;
  fileList.value[fileList.value.length + 1].name =
    getServerUrl() + res.data.src;
  fileList.value[fileList.value.length + 1].url =
    getServerUrl() + res.data.title;
};
//================================================================

const HandleUploadAttachmentFile = async () => {
  console.log("fileList.value===", fileList.value);
  const res = await UploadAttachmentFile(fileList.value);
  if (res.data.code == 200) {
    ElMessage.success("File successfully");
  }
};

//================================================================
const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles);
};

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile);
  window.open(uploadFile.url);
};

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile, uploadFiles) => {
  return ElMessageBox.confirm(
    `Cancel the transfer of ${uploadFile.name} ?`
  ).then(
    () => true,
    () => false
  );
};
</script>
