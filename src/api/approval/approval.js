import requestUtil from "@/util/request";


// 创建审批流程
export const GetApprovalList = (params) => requestUtil.post("approval/list", params);


// 创建审批流程
export const AddApproveProcess = (params) => requestUtil.post("approval/create", params);

//根据流程process_id获取审批流程步骤节点列表

export const GetStepListByProcessId = (params) => requestUtil.get("approval/steps/" + params);