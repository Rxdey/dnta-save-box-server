import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import { createDirectoryIfNotExists, moveFile } from './index.js';
const __dirname = path.resolve();

// 遍历文件
export const getAllFile = (baseDir, currentDir = '', list = [], vidoe = true) => {
  if (!baseDir) return;
  if (!currentDir) currentDir = baseDir;
  fs.readdirSync(baseDir).reverse().forEach(file => {
    // 获取子文件/文件夹
    const childFile = path.join(baseDir, file);
    const isFile = fs.statSync(childFile).isFile();
    // 如果是文件夹，递归
    if (!isFile) {
      getAllFile(childFile, currentDir, list, vidoe);
      return;
    }
    // 排除封面
    if ((/\.jpg$/i.test(file)) && vidoe) return;
    if ((/\.gitkeep$/i.test(file)) && vidoe) return;
    const filePath = childFile.replace(currentDir, '').replace(/\\/g, '/');
    // console.log(filePath);
    list.push(filePath);
  });
  return list;
};

// 批量截取视频封面
export async function batchExtractVideoCovers({
  inputPaths, outputDir, time = '0'
}) {
  for (let i in inputPaths) {
    const inputPath = inputPaths[i];
    const name = `${new Date().getTime()}_${i}`;
    const outPath = path.resolve(__dirname, `${outputDir}/${name}`);
    await createDirectoryIfNotExists(outPath);
    const outputPath = path.resolve(__dirname, `${outPath}/${name}.jpg`);
    ffmpeg(path.resolve(__dirname, inputPath))
      .seekInput(time)
      .screenshots({
        count: 1,
        folder: outPath,
        filename: `${name}.jpg`,
      })
      .on('end', () => {
        console.log(`视频 ${inputPath} 的封面已截取至 ${outputPath}`);
        moveFile(path.join(__dirname, inputPath), `${outPath}/${name}.${inputPath.split('.')[inputPath.split('.').length - 1]}`);
      })
      .on('error', (error) => {
        console.error(`截取视频 ${inputPath} 的封面时出错`);
        console.error(error);
      });
  }
};

