import path from 'path';
import { dateformat } from '../../utils/index.js';
import { getAllFile, output } from '../../utils/video.js';

const __dirname = path.resolve();

function replaceFileExtension(filePath, newExtension) {
    const regex = /\.[^.]+$/; // 匹配最后一个点号及其后面的所有字符
    const newFilePath = filePath.replace(regex, `.${newExtension}`);
    return newFilePath;
  }
/**
 * 获取本地视频
 * @returns 
 */
const getVideos = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    // const { id: uid } = auth;
    if (query.nsfw != 1) return sendSuccessResponse({ data: [] })
    const dir = path.resolve(__dirname, output);
    const res = getAllFile(dir, '', []).map((item, i) => ({
        content: item,
        create_date: dateformat(),
        id: i,
        is_show: 1,
        origin: "http://192.168.101.2:7888",
        path: output + item,
        cover: replaceFileExtension(output + item, 'jpg'),
        preview_img: null,
        title: item,
        type: "video",
        uid: 1,
        update_date: dateformat(),
    }));
    return sendSuccessResponse({ data: { list: res.reverse() } });
};

export default getVideos;