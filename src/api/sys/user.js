import requestUtil from "@/util/request";

// 获取用户列表
export const getUserList = (params) => requestUtil.post("sys/user/list", params);

// 删除用户
export const deleteUserById = (params) => requestUtil.post("sys/user/delete", params);

//重置密码
export const resetPassword = (params) => requestUtil.get("sys/user/resetPassword/" + params);

//更新状态
export const updateStatus = (row_id, row_status) => requestUtil.get("sys/user/updateStatus/" + row_id + "/status/" + row_status);

//根据id查询用户
export const queryUserById = (id) => requestUtil.get("sys/user/" + id);

//检查用户姓名
export const checkUserName = (username) => requestUtil.post("sys/user/checkUserName", {
    username: username,
});

//保存用户信息
export const saveUserInfo = (params) => requestUtil.post("sys/user/save", params);

//获取用户列表（value、label格式）
export const getUserListOption = (params) => requestUtil.get("sys/user/listForOptions");
