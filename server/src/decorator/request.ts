export enum Methods {
    get = 'get',
    post = 'post',
    put = 'put',
    delete = 'delete',
}

function getResponseDecorator(type: string) {
    return function (path?: string) {
        return function (target: any, key: string) {
            Reflect.defineMetadata('path', path, target, key);
            Reflect.defineMetadata('method', type, target, key);
        }
    }
}

export const get = getResponseDecorator(Methods.get);
export const post = getResponseDecorator(Methods.post);
export const put = getResponseDecorator(Methods.put);
export const del = getResponseDecorator(Methods.delete);