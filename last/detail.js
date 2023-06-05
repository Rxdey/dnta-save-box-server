import cheerio from 'cheerio';
import request from '../utils/request.js';
import Source from '../source/index.js';

const detail = async (req, { sendErrorResponse, sendSuccessResponse }) => {
    const { query, cookies } = req;
    const { animateId } = query;
    if (!animateId) {
        return sendErrorResponse({ msg: '参数错误' });
    }
    const res = await detailAction(Source.get(1), animateId);
    return sendSuccessResponse({ data: res });
};

const detailAction = async (source, animateId) => {
    const { name, apis: { detail } } = source;
    const url = `${detail.url + animateId}.html`;
    const res = await request({ url });
    const $ = cheerio.load(res);
    const chapterList = $('.links-of-books').eq(0).find('li').map((i, el) => {
        const chapter = $(el).find('a').text();
        const chapterUrl = $(el).find('a').attr('href');
        const chapterId = $(el).find('a').attr('href').match(/\d\/(.*)?.html/)[1];
        return { chapter, chapterUrl, chapterId, animateId }
    }).toArray().reverse();
    const chapterDetail = {
        name: $('.comic-title').text(),
        desc: $('.comic_story').text(),
        cover: $('.img-round').attr('src'),
        author: $('.pub-duration').find('a').text(),
        state: $('.comic-pub-state').text(),
        chapterList
    };
    return chapterDetail;
}

export default detail;