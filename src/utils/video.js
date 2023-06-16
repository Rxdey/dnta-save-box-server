import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
// import urlencode from 'urlencode';

const __dirname = path.resolve();

const ffmpegPath = path.join(__dirname, '../ffmpeg/bin/ffmpeg.exe');
const ffprobePath = path.join(__dirname, '../ffmpeg/bin/ffprobe.exe');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export const source = './download/video/source';
export const output = './download/video/result';

function moveFile(sourcePath, targetPath) {
  return fs.renameSync(sourcePath, targetPath);
}

function createDirectoryIfNotExists(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
  }
}
// 获取文件名
export function getFileNameWithoutExtension(filePath) {
  const { name } = path.parse(filePath);
  return name;
}

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
    const filePath = childFile.replace(currentDir, '').replace(/\\/g, '/');
    // console.log(filePath);
    list.push(filePath);
  });
  return list;
};

// 批量截取视频封面
export function batchExtractVideoCovers({
  inputPaths, outputDir, time = '0'
}) {
  inputPaths.forEach((inputPath, i) => {
    // const name = getFileNameWithoutExtension(inputPath);
    const name = `${new Date().getTime()}_${i}`;
    const outPath = path.resolve(__dirname, `${outputDir}/${name}`);
    createDirectoryIfNotExists(outPath);
    // const outputPath = `${outputDir}/cover_${Date.now()}.jpg`;
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
        // moveFile(path.join(__dirname, inputPath), `${outPath}/${path.basename(inputPath)}`);
      })
      .on('error', (error) => {
        console.error(`截取视频 ${inputPath} 的封面时出错`);
        console.error(error);
      });
  });
};

