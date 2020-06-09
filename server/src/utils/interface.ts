export interface ResponseResult {
    success: boolean;
    message?: string;
    data?: any;
}

export interface Course {
    title: string;
    count: number;
}

export interface CourseResult {
    time: number;
    data: Course[];
}

export interface DataContent {
    [propName: number]: Course[];
}