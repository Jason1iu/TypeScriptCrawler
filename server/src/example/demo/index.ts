import 'reflect-metadata';

function classMetaData(target: typeof People) {
    for (const propKey in target.prototype) {
        const data = Reflect.getMetadata('metaKey', target.prototype, propKey);
        console.log(data);
    }
}

//装饰器执行顺序例子
function setMetaData(metaKey: string, metaValue: any) {
    return function (target: People, key: string) {
        Reflect.defineMetadata(metaKey, metaValue, target, key);
    }
}

@classMetaData
class People {
    @setMetaData('metaKey', 'jay')
    getName() {

    }

    @setMetaData('metaKey', 29)
    getAge() {

    }
}



//reflect-metadata例子
// class People {
//     @Reflect.metadata('metaKey', 'jay')
//     getName() {

//     }
// }

// class User extends People { }
// // console.log(Reflect.getMetadataKeys(People.prototype, 'getName'));
// // console.log(Reflect.getMetadataKeys(User.prototype, 'getName'));

// console.log(Reflect.getOwnMetadataKeys(People.prototype, 'getName'));
// console.log(Reflect.getOwnMetadataKeys(User.prototype, 'getName'));



// 方法装饰器的例子

// function catchError(errMsg: string) {
//     return function (target: any, key: string, descriptor: PropertyDescriptor) {
//         const fn = descriptor.value;
//         descriptor.value = function () {
//             try {
//                 fn();
//             }
//             catch (e) {
//                 console.log(errMsg);
//             }
//         }
//     }
// }

// const userInfo: any = undefined;

// class Test {
//     @catchError('userInfo.name 不存在')
//     getName() {
//         return userInfo.name;
//     }

//     @catchError('userInfo.age 不存在')
//     getAge() {
//         return userInfo.age;
//     }
// }

// const test = new Test();
// test.getName();
// test.getAge();