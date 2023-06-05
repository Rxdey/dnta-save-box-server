import cheerio from 'cheerio';
import request from '../utils/request.js';
import Source from '../source/index.js';
import LZString from 'lz-string';

const getChapter = async (req, { sendErrorResponse, sendSuccessResponse }) => {
    const { query, cookies } = req;
    const { animateId, chapterId } = query;
    if (!animateId || !chapterId) {
        return sendErrorResponse({ msg: '参数错误' });
    }
    const res = await detailChapter(Source.get(1), query);
    return sendSuccessResponse({ data: res });
};

const cdnImage = (path, asset_domain, asset_key) => {
	// time_exp = Math.round(new Date() / 1000);
	// ks_md5_path = path+asset_key+time_exp;
	// ks_md5 = $.md5(ks_md5_path);
// 	return asset_domain + path + '?_MD=' + ks_md5 + '&_TM=' + time_exp;
	return asset_domain + path;
}

const detailChapter = async (source, { animateId, chapterId }) => {
    const { name, apis: { chapter } } = source;
    const url = `${chapter.url + animateId}/${chapterId}.html`;
    const res = await request({ url });
    const $ = cheerio.load(res);
    const img_data = $.text().match(/let\simg_data\s\=(.*)[\r|\n]?/)[1].replace(/[\s|\"|\']/g, '');
    const img_data_arr = LZString.decompressFromBase64(img_data).split(',');
    const total_page = img_data_arr.length;
    const asset_domain = $(".vg-r-data").data("chapter-domain");
    const asset_key = $(".vg-r-data").data("chapter-key");
    const img_pre = "/uploads/";
    // const chapter_num = $(".vg-r-data").data("chapter_num");
    // const chapter_type = $(".vg-r-data").data("chapter-type");
    // cdnImage(img_pre+img_data_arr[parseInt(page) - 1], asset_domain, asset_key));
    const title = $('.h4.text-center').text().replace(/\[/g, '').split(']')[0]
    return img_data_arr.map((item, i) => ({
        imgUrl: cdnImage(img_pre + item, asset_domain, asset_key),
        animateId,
        chapterId,
        index: i + 1,
        total: total_page,
        title
    }))
}
// LZString.decompressFromBase64(img_data).split(',');

export default getChapter;