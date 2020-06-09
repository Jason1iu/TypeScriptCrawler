import fs from 'fs';
import cheerio from 'cheerio';
import { Analyzer } from './crowler'
import { Course, CourseResult, DataContent } from './interface';

export default class CourseAnalyzer implements Analyzer {
    private static instance: CourseAnalyzer;

    private constructor() {

    }

    static getInstance(): CourseAnalyzer {
        if (!CourseAnalyzer.instance) {
            CourseAnalyzer.instance = new CourseAnalyzer();
        }
        return CourseAnalyzer.instance;
    }

    public analyze(html: string, filePath: string): string {
        const courseInfos = this.getCourseInfo(html);
        const fileContent = this.generateJsonContent(courseInfos, filePath);
        return JSON.stringify(fileContent);
    }

    private getCourseInfo(html: string): CourseResult {
        const $ = cheerio.load(html);
        const coutseItems: Cheerio = $('.course-item');
        const courseInfos: Course[] = [];
        coutseItems.map((_index: number, element: CheerioElement) => {
            const descs = $(element).find('.course-desc');
            const title = descs.eq(0).text();
            const count = parseInt(descs.eq(1).text().split('：')[1], 10);
            courseInfos.push({ title, count });
        });

        const result: CourseResult = {
            time: new Date().getTime(),
            data: courseInfos,
        }

        return result;
    }

    private generateJsonContent(courseInfos: CourseResult, filePath: string): DataContent {
        let fileContent: DataContent = {};
        if (fs.existsSync(filePath)) {
            fileContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
        fileContent[courseInfos.time] = courseInfos.data;
        return fileContent;
    }
}