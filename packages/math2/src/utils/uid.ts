const uidCaches=Object.create(null)
export const uid=(type:string)=>{
    if(uidCaches[type]===undefined){
        uidCaches[type]=-1
    }
    return ++uidCaches[type]
}