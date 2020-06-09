import { Request, Response } from 'express';

import { controller, post, get } from "../decorator";
import { ResponseResult } from "../utils/interface";

export interface BodyRequest extends Request {
    body: { [key: string]: string | undefined };
}


@controller()
export class LoginController {
    static isLogin(req: BodyRequest): boolean {
        return !!req.session?.login;
    }

    @post('/login')
    login(req: BodyRequest, res: Response): void {
        const { password, username } = req.body;
        const ret: ResponseResult = {
            success: true,
            message: '登录成功',
        }
        if (LoginController.isLogin(req)) {
            ret.message = '用户已登录';
            res.json(ret);
        }
        else if ('123' === password && 'jay' === username && req.session) {
            req.session.login = true;
            res.json(ret);
        }
        else {
            ret.success = false;
            ret.message = '用户名或密码不正确';
            res.json(ret);
        }
    }

    @get('/logout')
    logout(req: BodyRequest, res: Response): void {
        if (req.session) {
            req.session.login = undefined;
        }
        const ret: ResponseResult = {
            success: true,
            message: '退出成功',
        }
        res.json(ret);
    }


    home(req: BodyRequest, res: Response): void {
        const ret: ResponseResult = {
            success: true,
            data: `
                <html>
                    <body>
                        <form method="post" action="/login">
                            <input type="password" name="password" />
                            <button>登陆</button>
                        </form>
                    </body>
                 </html>
            `,
        }
        if (LoginController.isLogin(req)) {
            ret.data = `
                <html>
                    <body>
                        <a href='/getData'>爬取内容</a>
                        <a href='/showData'>展示内容</a>
                        <a href='/logout'>退出</a>
                    </body>
                </html>
            `;
            res.json(ret);
        }
        else {
            res.json(ret);
        }
    }
}