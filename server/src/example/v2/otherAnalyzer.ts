import { Analyzer } from './crowler';

export default class OtherAnalyzer implements Analyzer {
    public analyze(html: string, filePath: string): string {
        return html;
    }
}
