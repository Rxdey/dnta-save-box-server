import path from 'path';
import { dateformat, cleanObj } from '../../utils/index.js';
import select from '../../db/query.js';
import { thumbnailExtname } from '../../utils/image.js';
import { THUMBNAIL_PATH, SYSTEM_URL, STATIC_PATH, REPLACE_PATH } from '../../conf/index.js';

const getAllFavorite = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const { id: uid } = auth;
    const { page = 1, pageSize = 50, tid = null, is_show = 1, nsfw = 0, type, sort = 'DESC' } = query;

    // 分页查询
    const start = (parseInt(page) - 1) * parseInt(pageSize);
    const end = ((parseInt(page) - 1) * parseInt(pageSize)) + parseInt(pageSize);
    try {
        const where = cleanObj({ uid, is_show, tid, nsfw, type });
        if (nsfw == 1) delete where.nsfw;
        const totle = await select.count({
            database: 'favorite',
            where
        });

        const record = await select.find({
            database: 'favorite',
            where,
            limit: {
                start,
                end
            },
            order: [
                { type: sort === 'ASC' ? 'ASC' : 'DESC', key: '`sort`' }
                // { type: 'DESC', key: 'create_date' }
            ]
        });
        const resList = record.map(item => {
            if (item.path && item.type === 'img') {
                const displayUrl = item.path.replace(STATIC_PATH, SYSTEM_URL);
                let thumbnailUrl = displayUrl;
                if (thumbnailExtname.includes(path.extname(item.path))) {
                    const replacePath = REPLACE_PATH(item.path);
                    thumbnailUrl = item.path.replace(replacePath, THUMBNAIL_PATH).replace(STATIC_PATH, SYSTEM_URL);
                }
                return {
                    ...item,
                    thumbnailUrl,
                    displayUrl
                };
            }
            return item;
        });
        return sendSuccessResponse({ data: { list: resList, totle, page, pageSize } });
    } catch (error) {
        console.log(error);
        return sendErrorResponse({ msg: '查询失败' });
    }
};

export default getAllFavorite;