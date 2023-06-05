import { dateformat } from '../../utils/index.js';
import select from '../../db/query.js';

const all = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    try {
        // 查询用户全部标签
        const record = await select.find({
            database: 'tag',
            where: {
                uid
            },
        });
        return sendSuccessResponse({ data: record });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default all;