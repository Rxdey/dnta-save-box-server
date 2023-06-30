import { createThumbnail } from '../src/utils/image.js';
import { getAllFile } from '../src/utils/video.js';
import path from 'path';


const __dirname = path.resolve();
const dir = path.resolve(__dirname, './download/upload/pic');

const res = getAllFile(dir, '', [], false);

const w = 3000;
const h = 3000;
for (let filePath of res) {
    await createThumbnail(dir + filePath, 1, `./tool/compress/${path.parse(filePath).base}`, w, h);
}

