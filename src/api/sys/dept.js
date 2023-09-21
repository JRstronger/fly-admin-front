import requestUtil from "@/util/request";

// 获取部门结构树列表
export const getDeptTreeList = () => requestUtil.get("sys/dept/treeList");


// 根据id删除部门
export const deleteDeptById = () => requestUtil.get("sys/dept/delete/" + id);


// 根据id查询部门
export const selectDeptById = (id) => requestUtil.get("sys/dept/" + id);


// 根据id保存、创建部门信息
export const addById = (form_value) => requestUtil.post("sys/dept/save", form_value);