import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';

import router from './router';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(
    cookieSession({
        name: 'session',
        keys: ['test-session'],
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    })
);

// app.use((req: Request, res: Response, next: NextFunction) => {
//     req.teacherName = 'jay';
//     next();
// });

app.use(router);

app.listen(7001, () => {
    console.log('server is running');
});

/*
import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
    res.send('hello world');
});

app.get('/getData', (req: Request, res: Response) => {
    res.send('bye world');
});

app.listen(7001, () => {
    console.log('server is running');
});
*/

/*
import MyCrowler, { MyAnalyzer } from './v3';

const secret = 'secretKey';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const myAnalyzer = MyAnalyzer.getInstance();
new MyCrowler(url, myAnalyzer);
*/

/*
import MyCrowler, { MyAnalyzer, OtherAnalyzer } from './v2';

const secret = 'secretKey';
const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;

const myAnalyzer = new MyAnalyzer();
// const myOtherAnalyzer = new OtherAnalyzer();

new MyCrowler(url, myAnalyzer);
// new MyCrowler(url, myOtherAnalyzer);
*/

/*
import MyCrowler from './v1';
new MyCrowler();
*/
