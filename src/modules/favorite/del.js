import fs from 'fs';
import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';

const delFile = (path = '') => {
    if (!path) return false;
    try {
        console.log(`正在删除：${path}`);
        fs.unlinkSync(path);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export const deleteFileAndRecord = async (id, uid) => {
    const res = await select.find({
        database: 'favorite',
        where: {
            uid,
            id
        },
    });
    if (!res && !res[0]) return false;
    const { type, path } = res[0];
    if (type === 'img' && path) {
        if (!delFile(path)) return false;
    }
    // 删除数据
    const record = await select.delete({
        database: 'favorite',
        where: {
            uid,
            id
        },
    });
    return record;
};

const del = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { id } = body;
    if (!id) return sendErrorResponse({ msg: '操作失败，未查询到ID' });

    try {
        const record = await deleteFileAndRecord(id, uid);
        if (!record) return sendErrorResponse({ msg: '删除失败' })
        return sendSuccessResponse({ data: { row: record.affectedRows }, msg: '已删除' });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '删除失败' });
    }
};

export default del;