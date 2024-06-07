export class ValidatorError extends Error {
    public status : number

    constructor(message:string, status:number) {
        super(message);
        this.status = status;
    }
}

export class AuthError extends Error {
    public status : number

    constructor(message:string, status:number) {
        super(message);
        this.status = status;
    }
}

