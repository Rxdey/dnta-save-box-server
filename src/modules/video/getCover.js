import path from 'path';
import fs from 'fs';
import { dateformat } from '../../utils/index.js';
import { getAllFile, source, batchExtractVideoCovers, output } from '../../utils/video.js';

const __dirname = path.resolve();

/**
 * 获取本地视频封面
 * @returns 
 */
const getCover = async ({ query, auth }, { sendErrorResponse, sendSuccessResponse }) => {
    const dir = path.resolve(__dirname, source);
    const allFile = getAllFile(dir, '', []);
    batchExtractVideoCovers({
        inputPaths: allFile.map(item => source + item),
        outputDir: output,
    });
    return sendSuccessResponse({ data: 1 });
};

export default getCover;