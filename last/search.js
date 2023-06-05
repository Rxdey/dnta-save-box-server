import cheerio from 'cheerio';
import request from '../utils/request.js';
import Source from '../source/index.js';

const search = async (req, { sendErrorResponse, sendSuccessResponse }) => {
    const { query, cookies } = req;
    const { searchKey } = query;
    if (!searchKey) {
        return sendErrorResponse({ msg: '参数错误' });
    }
    const res = await searchAction(Source.get(1), searchKey);
    return sendSuccessResponse({ data: res });
};

/** 漫画猫搜索 */
const searchAction = async (source, searchKey) => {
    const { name, apis: { search } } = source;
    const res = await request({ url: `${search.url}${encodeURIComponent(searchKey)}`});
    const $ = cheerio.load(res);
    const searchRes = $('.comic-main-section .row').children().map((i, el) => {
        const a = $(el).find('a').eq(0);
        const b = $(el).find('a').eq(2);
        return {
            detailUrl: $(a).attr('href'),
            name: $(a).attr('title'),
            cover: $(a).find('img').attr('src'),
            author: $(b).text(),
            animateId: $(a).attr('href').match(/manga\/(.*)?.html/)[1]
        }
    });
    return searchRes.toArray();
}

export default search;