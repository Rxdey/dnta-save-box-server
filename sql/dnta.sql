/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost:3306
 Source Schema         : dnta

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 15/06/2023 11:40:17
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for favorite
-- ----------------------------
DROP TABLE IF EXISTS `favorite`;
CREATE TABLE `favorite`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL,
  `tid` int(11) NULL DEFAULT NULL COMMENT '分类id，空为默认',
  `type` enum('img','url','text') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '\'img\',\'url\',\'text\'',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '详细内容',
  `origin` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '来源地址',
  `title` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '标题',
  `desc_txt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '描述',
  `path` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '图片本地路径',
  `preview_img` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '预览图 头图 之类的',
  `is_show` int(1) NOT NULL DEFAULT 1 COMMENT '显示/隐藏',
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  `nsfw` int(1) NOT NULL DEFAULT 0,
  `sort` int(20) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 31 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS `tag`;
CREATE TABLE `tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '用户id',
  `pid` int(11) NULL DEFAULT NULL COMMENT '父级id(先创建备用)',
  `name` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `desc` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '描述',
  `color` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '主题色彩',
  `index` int(5) NULL DEFAULT 0 COMMENT '排序',
  `create_date` datetime NOT NULL,
  `update_date` datetime NOT NULL,
  `nsfw` int(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `create_date` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  `nick_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `avatar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
