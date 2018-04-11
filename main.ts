import {injectable, Kernel} from "./src"

abstract class IPerson{
    abstract name: string;
}

@injectable
class Human implements IPerson {
    constructor(public name: string){};
}

abstract class IWeapon{
    abstract kill(person: IPerson);
}

@injectable
class FiberWire implements IWeapon {
    kill(person: IPerson) {
        console.log(person.name + " has strangled");
    }
}

@injectable
class Hitman{
    constructor(private person : IPerson, private weapon: IWeapon){}
    public doWork(){
        this.weapon.kill(this.person);
    }
}

var kernel = new Kernel()
.setBind(String, "007")
.setBindType(IWeapon, FiberWire)
.setBindType(IPerson, Human)
//.setBind(IPerson, new Human("008"))
.setBindType(Hitman, Hitman);

let hitman = kernel.get(Hitman);
hitman.doWork();