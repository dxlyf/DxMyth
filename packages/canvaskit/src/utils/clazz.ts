
export function mixinClass(base: {new(...args: any[]): any}, ...mixin: {new(...args: any[]): any}[]) {
    Object.assign(base.prototype, ...mixin.map(d=>d.prototype));
    return base
}
// 继承
export const inherit = (child: any, parent: any, copyStatic: boolean = false) => {
    if (Object.create) {
        child.prototype = Object.create(parent.prototype);
    } else {
        const F: any = function () { };
        F.prototype = parent.prototype;
        child.prototype = new F();
    }
    child.prototype.constructor = child;
    if (copyStatic && Object.setPrototypeOf) {
        Object.setPrototypeOf(child, parent);
    }
}
export type ClazzType<T, P = any> = new (...args: P extends Array<any> ? P : [P]) => T;
export interface RegisterClassType {
  type?: string
  subType?: string
}

const containerKey = '__clz__isContainer'
class EmptyBaseClass{}
export const mixinRegisterClass =(Base: any=EmptyBaseClass) => {
    const registeredClasses = new Map<string, any>();
    const getCreate = (type: string) => {
        let obj = registeredClasses.get(type)
        if (!obj) {
            obj = {
                [containerKey]: true
            }
            registeredClasses.set(type, obj)
        }
        return obj
    }
    return class extends Base {
        static registerClass(clazz: any) {
            const mainType = clazz.type || clazz.prototype.type
            const subType = clazz.subType || clazz.prototype.subType
            if (mainType) {
                if (subType) {
                    getCreate(mainType)[subType] = clazz
                } else {
                    registeredClasses.set(mainType, clazz)
                }
            }
        }
        static getClass<T>(mainType: string, subType?: string):T|null {
            const clz = registeredClasses.get(mainType);
            if (clz && clz[containerKey]) {
                if (subType) {
                    return clz[subType]
                } else {
                    return null
                }
            }
            return clz
        }
        static hasClass(mainType: string, subType?: string): boolean {
            const clz = registeredClasses.get(mainType);
            if (clz && clz[containerKey]) {
                if (subType) {
                    return subType in clz
                } else {
                    return true
                }
            }
            return false
        }
        constructor(...args: any[]) {
            super(...args)
        }
    }
}


