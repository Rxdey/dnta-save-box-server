import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';

/**
 * 重设全部排序字段值
 * @param {*} param0 
 * @param {*} param1 
 * @returns 
 */
const updateSort = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;

    try {
        const initSql = 'SET @row_number := 0;';
        const updateSql = `UPDATE favorite SET sort = (@row_number := @row_number + 1) * 100 WHERE uid = ${uid} ORDER BY sort DESC;`;
        await select.querySql(initSql);
        const record = await select.querySql(updateSql);
        return sendSuccessResponse({ data: record, msg: '更新成功' });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '更新失败' });
    }
};

export default updateSort;