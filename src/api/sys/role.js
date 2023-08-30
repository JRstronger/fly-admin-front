import requestUtil from "@/util/request";


// 获取角色列表
export const getRoleListAll = () => requestUtil.get("sys/role/listAll");

// 获取角色列表
export const getRoleList = (queryForm_value) => requestUtil.post("sys/role/list", queryForm_value);

//用户角色授权
export const grantRole = (form_value_id, form_value_checkedRoles) => requestUtil.post("sys/user/grantRole/" + form_value_id, form_value_checkedRoles);

//根据id删除角色
export const deleteByIds = (ids) => requestUtil.post("sys/role/delete", ids);

//根据id重置密码
export const resetPassword = (id) => requestUtil.get("sys/role/resetPassword/" + id);

//更新角色状态
export const updateStatus = (row_id, row_status) => requestUtil.get("sys/role/updateStatus/" + row_id + "/status/" + row_status);