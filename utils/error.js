class CustomError extends Error {
    constructor(message, statusCode, error){
        super();
        this.message = message;
        this.statusCode = statusCode;
        this.error = error;
    }
}

module.exports = CustomError;