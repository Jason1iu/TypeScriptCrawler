import path from 'path';
import fs from 'fs';
import { controller, get, use } from "../decorator";
import { BodyRequest } from "./LoginController";
import { Response, Request, NextFunction } from "express";
import CourseAnalyzer from "../utils/CourseAnalyzer";
import Crowler from "../utils/crowler";
import { ResponseResult } from "../utils/interface";

const checkLogin = (req: Request, res: Response, next: NextFunction): void => {
    const isLogin = !!req.session?.login;
    if (isLogin) {
        next();
    }
    else {
        res.json({
            success: false,
            message: '请先登录',
        } as ResponseResult);
    }
}


@controller()
export class CrowlerController {

    @get('/getData')
    @use(checkLogin)
    getData(_req: BodyRequest, res: Response): void {
        const ret: ResponseResult = {
            success: true,
        }
        try {
            const secret = 'x3b174jsx';
            const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
            const analyzer = CourseAnalyzer.getInstance();
            new Crowler(url, analyzer);
            res.json(ret);
        } catch (e) {
            ret.success = false;
            ret.message = '获取数据出错';
            res.json(ret);
        }
    }

    @get('/showData')
    @use(checkLogin)
    showData(_req: BodyRequest, res: Response): void {
        const ret: ResponseResult = {
            success: true,
        }
        try {
            const position = path.resolve(__dirname, '../../data/course.json');
            const result = fs.readFileSync(position, 'utf8');
            ret.data = JSON.parse(result);
            res.json(ret);
        }
        catch (e) {
            ret.success = false;
            ret.message = '显示解析数据出错';
            res.json(ret);
        }
    }
}