import { BadRequestException } from "./customException.js";

function capitalize(string) {
    try {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    } catch (error) {
        if (error instanceof TypeError) {
            throw new BadRequestException({
                msg: "data validation error",
                data: [
                    'priority must be string'
                ]
            })
        }
    }
}

export default capitalize;