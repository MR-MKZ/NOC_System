export const messages = {
    LOGIN_SUCCESS: {
        code: 200,
        message: 'ورود با موفقیت انجام شد'
    },
    SERVER_ERROR: {
        code: 500,
        message: 'خطای سرور'
    },
    BAD_REQUEST: {
        code: 400,
        message: 'درخواست نادرست'
    },
    MISSING_USERNAME: {
        code: 400,
        message: 'نام کاربری الزامی است'
    },
    MISSING_PASSWORD: {
        code: 400,
        message: 'رمز عبور الزامی است'
    },
    INVALID_CREDENTIALS: {
        code: 401,
        message: 'نام کاربری یا رمز عبور نادرست است'
    },
    UNAUTHORIZED: {
        code: 401,
        message: 'دسترسی غیرمجاز'
    },
    TOKEN_VALID: {
        code: 200,
        message: 'توکن معتبر است'
    },
    TICKET_CREATED: {
        code: 201,
        message: 'تیکت با موفقیت ایجاد شد'
    },
    TICKET_CLOSED: {
        code: 200,
        message: 'تیکت با موفقیت بسته شد'
    },
    TICKET_NOT_FOUND: {
        code: 404,
        message: 'تیکت پیدا نشد'
    },
    TICKET_FETCH_ERROR: {
        code: 500,
        message: 'خطا در دریافت اطلاعات تیکت'
    },
    ACCESS_DENIED: {
        code: 403,
        message: 'دسترسی غیرمجاز'
    },
    TICKET_UPDATED: {
        code: 200,
        message: 'تیکت با موفقیت آپدیت شد'
    },
    INVALID_STATUS: {
        code: 400, message: "مقدار status یافت نشد"
    },
    MISSING_STATUS: {
        code: 400,
        message: "مقدار status یافت نشد"
    }
    ,
    INVALID_TICKET_ID: {
        code: 400,
        message: "مقدار ticketId یافت نشد"
    },
    MISSING_TICKET_ID: {
        code: 400,
        message: "مقدار ticketId یافت نشد"
    }, MISSING_MESSAGE: {
        code: 400,
        message: "پیام وارد نشده"
    },
    SUCCESS:{
        code:200,
        message:"موفق"
    }
};