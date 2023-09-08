import requestUtil from "@/util/request";


// 根据用户名获取流程通知
export const GetApprovalNoticeList = (username) => requestUtil.get("approval/noticeList/" + username);

