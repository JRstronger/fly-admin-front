import requestUtil from "@/util/request";


// 获取审批流程列表
export const GetApprovalList = (params) => requestUtil.post("approval/list", params);


// 创建审批流程
export const AddApproveProcess = (params) => requestUtil.post("approval/create", params);

//根据流程process_id获取审批流程步骤节点列表

export const GetStepListByProcessId = (params) => requestUtil.get("approval/steps/" + params);


//根据流程currentStepKeyId(1-同意/2-拒绝/3-退回)当前步骤节点
export const UpdateStepStatusBtn = (stepOpLog) => requestUtil.post("approval/updateStepStatus", stepOpLog);

//上传附件
export const UploadAttachmentFile = (file) => requestUtil.post("approval/updateFile", file);


// 获取审批模板列表
export const GetTemplateList = (params) => requestUtil.post("approval/TemplateList", params);

// 创建审批模板
export const SaveApprovalTemplate = (params) => requestUtil.post("approval/SaveApprovalTemplate", params);


//通过模板key_id获取模板信息
export const GetTemplateInfoByKeyId = (params) => requestUtil.get("approval/templateInfo/" + params);

//通过模板key_id删除模板信息
export const DeleteTemplateByKeyId = (id) => requestUtil.get("approval/template/delete/" + id);
