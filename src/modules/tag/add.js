import { dateformat } from '../../utils/index.js';
import select from '../../db/query.js';

/**
 * 添加标签
 */
const add = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { name } = body;
    if (!name) return sendErrorResponse({ msg: '参数错误' });
    try {
        const setData = {
            uid,
            name,
            create_date: dateformat(),
            update_date: dateformat()
        };
        const res = await select.insert({
            database: 'tag',
            set: setData
        });
        return sendSuccessResponse({ msg: '已添加', data: res });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '添加失败' });
    }
};

export default add;