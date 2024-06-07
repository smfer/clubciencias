export class ApiError extends Error {
    public status : number
    public code : string

    constructor(option : {status:number,code:string,error:string}) {
        super(option.error)
       this.status = option.status
       this.code = option.code
    }
}
