import path from "path";
import nodeWindow from "node-windows";
const Service = nodeWindow.Service;

let svc = new Service({
  name: "DNTA_SAVE_BOX", //名称
  description: "DNTA 收藏工具服务", //描述
  script: path.resolve("./app.js"), //node执行入口文件
  nodeOptions: ["--harmony", "--max_old_space_size=4096"],
});

svc.on("install", function () {
  svc.start();
  if(svc.exists){
    console.log('服务安装成功')
  }
});

svc.install();