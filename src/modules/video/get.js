import path from 'path';
import fs from 'fs';
import { dateformat } from '../../utils/index.js';

const __dirname = path.resolve();

// 遍历文件
const getAllFile = (baseDir, currentDir = '', list = []) => {
    if (!baseDir) return;
    if (!currentDir) currentDir = baseDir;
    fs.readdirSync(baseDir).reverse().forEach(file => {
        // 获取子文件/文件夹
        const childFile = path.join(baseDir, file);
        const isFile = fs.statSync(childFile).isFile();
        // 如果是文件夹，递归
        if (!isFile) {
            getAllFile(childFile, currentDir, list);
            return;
        }
        // 非js文件不处理
        // if (!(/\.js$/i.test(file))) return;
        const filePath = childFile.replace(currentDir, '').replace(/\\/g, '/');
        // console.log(filePath);
        list.push(filePath);
    });
    return list;
};

const getVideos = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    // const { id: uid } = auth;
    const dir = path.resolve(__dirname, './download/video');
    const res = getAllFile(dir, '', []).map((item, i) => ({
        content: item,
        create_date: dateformat(),
        id: i,
        is_show: 1,
        origin: "http://192.168.101.2:7888",
        path: `./download/video/${item}`,
        preview_img: null,
        title: item,
        type: "video",
        uid: 1,
        update_date: dateformat(),
    }));
    return sendSuccessResponse({ data: res });
};

export default getVideos;