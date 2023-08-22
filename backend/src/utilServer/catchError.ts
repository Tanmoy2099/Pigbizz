class AppError extends Error {
    status: string
    isOperational?: boolean
    
    constructor(public errCode: number, message: string) {
        super(message)
        this.status = String(errCode).startsWith('4') ? "fail" : "error";
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }

}

export { AppError }