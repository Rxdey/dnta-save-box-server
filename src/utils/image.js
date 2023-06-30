import gm from 'gm';
import path from 'path';
import fs from 'fs';
import { IMAGE_PATH, THUMBNAIL_PATH, REPLACE_PATH } from '../conf/index.js';
import { isExists, createDirectoryIfNotExists } from './index.js';

// 支持缩略图的格式
// webp动态图报错，gif转换耗时太长
export const thumbnailExtname = ['.jpg', '.jpeg', '.png'];
const __dirname = path.resolve();
const errorPath = path.resolve(__dirname, `${IMAGE_PATH}/404.png`);

const getThumbnailSize = async (filePath = '', w = 400, h = 400) => {
    return new Promise((resolve, reject) => {
        gm(filePath).size((err, size) => {
            if (err) {
                reject(err);
                return;
            }
            const { width, height } = size;
            let thumbnailWidth = width;
            let thumbnailHeight = height;

            // 判断是否需要调整缩略图大小
            if (width > w || height > h) {
                // 缩放图片到最大边长为 200
                if (width > height) {
                    thumbnailHeight = Math.round((height / width) * h);
                    thumbnailWidth = w;
                } else {
                    thumbnailWidth = Math.round((width / height) * w);
                    thumbnailHeight = h;
                }
            }
            resolve({ width: thumbnailWidth, height: thumbnailHeight });
        });
    });
};
/**
 * 生成缩略图
 * 图片存在则在./download/image/thumbnail下生成同名文件
 */
export const createThumbnail = async (url = '', force = false, outPutPath = '', w = 400, h = 400) => {
    if (!thumbnailExtname.includes(path.extname(url))) {
        console.log('跳过处理: ', url);
        return;
    }
    let filePath = path.resolve(__dirname, url);
    // 不存在则使用错误图片
    const exists = await isExists(filePath);
    if (!url || !exists) {
        filePath = errorPath;
    }
    // 目录规划失误，需要判断一下
    const replacePath = REPLACE_PATH(url);
    const outPath = outPutPath ? outPutPath : path.resolve(__dirname, `${THUMBNAIL_PATH}${url.replace(replacePath, '')}`);
    await createDirectoryIfNotExists(path.dirname(outPath));
    const isOut = await isExists(outPath) ;
    if ( isOut && !force) {
        console.log('缩略图已存在，请勿重复生成');
        return;
    }
    try {
        const { width, height } = await getThumbnailSize(filePath, w, h);
        gm(filePath).resize(width, height).write(outPath, err => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('缩略图生成成功:', outPath);
        });
    } catch (error) {
        console.error('图片处理失败', error);
    }
};
