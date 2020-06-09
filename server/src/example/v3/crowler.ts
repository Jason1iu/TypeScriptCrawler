import * as fs from 'fs';
import * as path from 'path';

import * as superagent from 'superagent';

export interface Analyzer {
    //分析器：传一个爬取到的html信息和本地存储json文件，返回对应的json格式的所有数据
    analyze: (html: string, filePath: string) => string;
}

export default class Crowler {
    private filePath = path.resolve(__dirname, '../../data/course.json');

    constructor(private url: string, private analyzer: Analyzer) {
        this.initCrowlerProcess();
    }

    private async initCrowlerProcess() {
        const html = await this.getRawHtml();
        const fileContent = this.analyzer.analyze(html, this.filePath);
        this.writeFile(fileContent);
    }

    private async getRawHtml(): Promise<string> {
        const result = await superagent.get(this.url);
        return result.text;
    }

    private writeFile(fileContent: string) {
        fs.writeFileSync(this.filePath, fileContent);
    }
}
