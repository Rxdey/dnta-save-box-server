import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';
import { deleteFileAndRecord } from './del.js';

const batchDel = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { ids, is_show = 0, del = 0 } = body;
    if (!ids.length) return sendErrorResponse({ msg: '更新失败，未查询到ID' });
    try {
        if (!del) {
            // 批量切换显隐
            const record = await select.querySql(`UPDATE favorite SET is_show = ${is_show ? 1 : 0} WHERE id IN (${ids.join(',')}) AND uid=${uid};`);
            return sendSuccessResponse({ data: record, msg: record ? '更新成功' : '未查询到数据' });
        }
        // 物理删除
        const errList = [];
        for (let id of ids) {
           const res = await deleteFileAndRecord(id, uid);
           if (!res) errList.push(id);
        }
        return errList.length ? sendErrorResponse({ msg: '部分未删除成功', data: errList }) : sendSuccessResponse({ data: errList, msg: '删除成功'})
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '更新失败' });
    }
};

export default batchDel;