import path from 'path';
import fs from 'fs';
import superagent from 'superagent';

export interface Analyzer {
    analyze: (html: string, filePath: string) => string;
}

export default class Crowler {
    private filePath: string = path.resolve(__dirname, '../../data/course.json');

    constructor(private url: string, private analyzer: Analyzer) {
        this.initProcess();
    }

    private async initProcess() {
        const html: string = await this.getRawHtml();
        const fileContent: string = this.analyzer.analyze(html, this.filePath);
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