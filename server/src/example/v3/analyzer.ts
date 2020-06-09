import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { Analyzer } from './crowler';

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

export default class MyAnalyzer implements Analyzer {
    private static instance: MyAnalyzer;

    private constructor() {}

    static getInstance() {
        if (!MyAnalyzer.instance) {
            MyAnalyzer.instance = new MyAnalyzer();
        }
        return MyAnalyzer.instance;
    }

    public analyze(html: string, filePath: string): string {
        const courseInfo = this.getCourseInfo(html);
        const result = this.generateJsonContent(courseInfo, filePath);
        return JSON.stringify(result);
    }

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

    private generateJsonContent(
        courseInfo: Content,
        filePath: string
    ): OutputContent {
        let fileContent: OutputContent = {};
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseInfo.time] = courseInfo.data;
        return fileContent;
    }
}
