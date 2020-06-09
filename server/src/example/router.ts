import { Router, Request, Response } from 'express';
import MyCrowler, { MyAnalyzer } from './v3';
import fs from 'fs';
import path from 'path';

const router = Router();

interface RequestWithBody extends Request {
    body: {
        [key: string]: string | undefined;
    };
}

// router.get('/', (req: Request, res: Response) => {
//     res.send('hello world!');
// });

router.get('/', (req: RequestWithBody, res: Response) => {
    const isLogin = !!req.session?.login;
    if (isLogin) {
        res.send(`
            <html>
                <body>
                    <a href="/getData">爬取内容</a>
                    <a href="/showData">展示内容</a>
                    <a href="/logout">退出</a>
                </body>
            </html>
        `);
    } else {
        res.send(`
        <html>
            <body>
                <form method="post" action="/login">
                    <input type="password" name="password" />
                    <button>提交</button>
                </form>
            </body>
        </html>
    `);
    }
});

router.post('/login', (req: RequestWithBody, res: Response) => {
    const isLogin = !!req.session?.login;
    if (isLogin) {
        res.send('已经登录');
    } else {
        const { password } = req.body;
        if (password === '123' && !!req.session) {
            req.session.login = true;
            res.send('登录成功');
        } else {
            res.send('登陆失败');
        }
    }
});

router.get('/logout', (req: RequestWithBody, res: Response) => {
    if (!!req.session) {
        req.session.login = undefined;
    }
    res.redirect('/');
});

router.get('/getData', (req: RequestWithBody, res: Response) => {
    const isLogin = !!req.session?.login;
    if (isLogin) {
        const secret = 'secretKey';
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
        const myAnalyzer = MyAnalyzer.getInstance();
        new MyCrowler(url, myAnalyzer);
        res.send('getData success!');
    } else {
        res.send(`请登录`);
    }
});

router.get('/showData', (req: RequestWithBody, res: Response) => {
    const isLogin = !!req.session?.login;
    if (isLogin) {
        try {
            const location = path.resolve(__dirname, '../data/course.json');
            const result = fs.readFileSync(location, 'utf-8');
            res.send(JSON.parse(result));
        } catch (error) {
            res.send(`没有找到数据, ${error}`);
        }
    } else {
        res.send(`请登录`);
    }
});

export default router;
