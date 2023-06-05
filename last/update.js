import { dateformat } from '../utils/index.js';
import select from '../db/query.js';

const update = async ({ body, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: userId } = auth;
    const { source, animateId, lastChapterId, lastChapterName, lastChapter, lastPage } = body;
    if ( !source || !animateId) return sendErrorResponse({ msg: '参数错误' });

    try {
        // 查询订阅记录
        const collect = await select.find({
            database: 'collection',
            where: {
                userId,
                animateId,
                source,
            }
        });
        // 不存在记录 新增一条 （暂时不考虑 爬的数据存在不完整情况）
        // if (!collect.length) {

        // } else {
            const sets = {};
            if (lastChapter) sets['lastChapter'] = lastChapter;
            if (lastChapterId) sets['lastChapterId'] = lastChapterId;
            if (lastPage) sets['lastPage'] = lastPage;
            if (lastChapterName) sets['lastChapterName'] = lastChapterName;
            sets['updateDate'] = dateformat();
            // 查询订阅记录
            const record = await select.update({
                database: 'collection',
                set: sets,
                where: {
                    userId,
                    animateId,
                    source
                }
            });
            if (!record) return sendErrorResponse({ msg: '记录不存在' });
        // }
        return sendSuccessResponse({ msg: '更新成功' });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default update;