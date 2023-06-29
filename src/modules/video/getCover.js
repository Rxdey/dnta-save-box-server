import path from 'path';
import fs from 'fs';
import { dateformat } from '../../utils/index.js';
import { getAllFile, batchExtractVideoCovers } from '../../utils/video.js';
import { VIDEO_SOURCE, VIDEO_RESULT } from '../../conf/index.js';

const __dirname = path.resolve();

/**
 * 获取本地视频封面
 * @returns 
 */
const getCover = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const dir = path.resolve(__dirname, VIDEO_SOURCE);
    const allFile = getAllFile(dir, '', []);
    batchExtractVideoCovers({
        inputPaths: allFile.map(item => VIDEO_SOURCE + item),
        outputDir: VIDEO_RESULT,
    });
    return sendSuccessResponse({ data: 1 });
};

export default getCover;