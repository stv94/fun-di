import "reflect-metadata";

type Filter<T, U> = T extends U ? never : T;
type NotArray<T> = T extends any[] ? never : T;
type NotEmpty<T> = keyof T extends never ? never : T;

export class Kernel{

    public setBind<U>(fromType: {prototype: U}, toValue: U & NotArray<U> & NotEmpty<U>): InternalKernel<U> {
        let types: [{prototype: any}, any][] = [[fromType, toValue]];
        return new InternalKernel<U>(types);
    }

    public setBindType<U>(from: {prototype: U}, to: new () => U & NotArray<U> & NotEmpty<U>): InternalKernel<U> {
        let obj = new to();
        let types: [{prototype: any}, any][] = [[from, obj]];
        return new InternalKernel<U>(types);
    }
}

class InternalKernel<T>{
    constructor(private types: [{prototype: any}, any][]){}

    public setBind<U>(fromType: {prototype: U}, toValue: U & NotArray<U> & NotEmpty<U> & Filter<U, T>): InternalKernel<T | U> {
        this.types.push([fromType, toValue]);
        return new InternalKernel<T | U>(this.types);
    }

    public setBindType<U>(from: {prototype: U}, to: new (...args: T[]) => U & NotArray<U> & NotEmpty<U> & Filter<U, T>): InternalKernel<T | U> {
        
        const constructorParams : Function[] = Reflect.getMetadata("design:paramtypes", to);
        let constructorArgs: T[] = [];

        if(constructorParams !== undefined){
            constructorParams.forEach(element => {
                let arg = this.get(element);
                constructorArgs.push(<T>arg);
            });
        }

        let obj = new to(...constructorArgs);

        this.types.push([from, obj]);
        return new InternalKernel<T | U>(this.types);
    }
    
    public get(value: {prototype: T}) {
        return this.types.filter(x => x["0"] == value)[0]["1"];
    }
}