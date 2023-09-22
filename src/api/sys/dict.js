import requestUtil from "@/util/request";


// 获取字典类型列表
export const getDictParamList = (queryForm) => requestUtil.post("sys/config/dict/list", queryForm);

// 删除字典
export const deleteDictById = (id) => requestUtil.post("sys/config/dict/delete", id);

//根据类型id查询类型值
export const queryDictById = (id) => requestUtil.get("sys/config/dict/" + id);

//根据类型id查询类型值
export const saveDict = (param) => requestUtil.post("sys/config/dict/saveDict", param);

//校验字典编码唯一性
export const checkDictCode = (param) => requestUtil.get("sys/config/dict/checkDictCode/" + param);