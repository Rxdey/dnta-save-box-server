import { dateformat, cleanObj } from '../../utils/index.js';
import select, { parseWhereObject } from '../../db/query.js';

const all = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { nsfw = 0 } = query;
    try {
        const where = cleanObj({ uid, nsfw });
        if (nsfw == 1) delete where.nsfw;
        // 查询用户全部标签
        // const record = await select.find({
        //     database: 'tag',
        //     where: where,
        // });
        const record = await select.querySql(`SELECT t.*, (SELECT COUNT(*) FROM favorite WHERE tid = t.id) AS favorite_count FROM tag AS t WHERE ${parseWhereObject(where)};`);
        
        return sendSuccessResponse({ data: record });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default all;