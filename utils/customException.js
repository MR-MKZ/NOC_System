export class CustomException extends Error {
    constructor(code, error) {
        super(error.msg)

        this.code = code
        if (error?.data)
            this.data = error.data
    }
}

export class BadRequestException extends CustomException {
    constructor(error) {
        super(400, error)
    }
}

export class UnauthorizedException extends CustomException {
    constructor(error) {
        super(401, error)
    }
}

export class ForbiddenException extends CustomException {
    constructor(error) {
        super(403, error)
    }
}

export class NotFoundException extends CustomException {
    constructor(error) {
        super(404, error)
    }
}

export class ServerException extends CustomException {
    constructor(error) {
        super(500, error)
    }
}
