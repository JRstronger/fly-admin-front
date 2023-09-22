import requestUtil from "@/util/request";

// 获取部门结构树列表
export const getDeptTreeList = () => requestUtil.get("sys/dept/treeList");


// 根据id删除部门
export const deleteDeptById = (id) => requestUtil.get("sys/dept/delete/" + id);


// 根据id查询部门
export const selectDeptById = (id) => requestUtil.get("sys/dept/" + id);


// 根据id保存、创建部门信息
export const addDeptById = (form_value) => requestUtil.post("sys/dept/save", form_value);


//检查部门名称、部门编码、职位名称、职位编码
export const checkValueExist = (name, value) => requestUtil.get("sys/dept/checkValueExist/name/" + name + "/value/" + value);



//================================================================================================


// 获取职位列表（不分页）
export const getPositionListNoPage = () => requestUtil.get("sys/dept/positionList");

// 获取分页职位列表
export const getPositionList = (queryForm_value) => requestUtil.post("sys/dept/positionList", queryForm_value);


// 根据id删除职位
export const deletePositionById = (id) => requestUtil.get("sys/dept/deletePosition/" + id);


// 根据id查询职位
export const selectPositionById = (id) => requestUtil.get("sys/dept/position/" + id);


// 根据id保存、创建职位信息
export const savePositionById = (form_value) => requestUtil.post("sys/dept/savePosition", form_value);


// 根据id更新职位状态
export const updatePositionStatus = (row_id, row_status) => requestUtil.get("sys/dept/updatePositionStatus/" + row_id + "/status/" + row_status);

