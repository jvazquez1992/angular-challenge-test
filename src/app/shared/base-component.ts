import { Subject } from "rxjs";

export class BaseComponent{
    public unsusbscribe$ = new Subject<void>();
    public unsubscribe(){
        try{
            this.unsusbscribe$.next();
            this.unsusbscribe$.complete();
            this.unsusbscribe$.unsubscribe();
        }catch(error){
            console.error('Unsusbcribe '+error);
        }
    }
}