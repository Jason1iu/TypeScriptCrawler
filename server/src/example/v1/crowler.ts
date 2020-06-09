import * as fs from 'fs';
import * as path from 'path';

import * as superagent from 'superagent';
import * as cheerio from 'cheerio';

interface Course {
    title: string;
    count: number;
}

interface Content {
    time: number;
    data: Course[];
}

interface OutputContent {
    [key: number]: Course[];
}

export default class Crowler {
    private secret = 'secretKey';
    private url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;
    private filePath = path.resolve(__dirname, '../../data/course.json');

    private getCourseInfo(html: string): Content {
        const $ = cheerio.load(html);
        const courseItems = $('.course-item');
        const courseInfos: Course[] = [];
        courseItems.map((_index: number, element: CheerioElement) => {
            const desc = $(element).find('.course-desc');
            const title = desc.eq(0).text();
            const count = parseInt(
                desc
                    .eq(1)
                    .text()
                    .split('：')[1],
                10
            );
            courseInfos.push({
                title,
                count
            });
        });
        const result: Content = {
            time: new Date().getTime(),
            data: courseInfos
        };
        return result;
    }

    async getRawHtml(): Promise<string> {
        const result = await superagent.get(this.url);
        return result.text;
    }

    generateJsonContent(courseInfo: Content): OutputContent {
        let fileContent: OutputContent = {};
        if (fs.existsSync(this.filePath)) {
            fileContent = JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
        }
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
    }

    private writeFile(fileContent: string) {
        fs.writeFileSync(this.filePath, fileContent);
    }

    async initCrowlerProcess() {
        const html = await this.getRawHtml();
        const courseInfo = this.getCourseInfo(html);
        const fileContent = this.generateJsonContent(courseInfo);
        this.writeFile(JSON.stringify(fileContent));
    }

    constructor() {
        this.initCrowlerProcess();
    }
}

const crowler = new Crowler();
