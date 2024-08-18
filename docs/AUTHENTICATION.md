# Authentication
Documentation of authentication API.

## 1. Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Query Parameters**:
    - `username` (required) - account username
    - `password` (required) - account password
- **Response**:
    - **200 OK**
    - **Response Body**:
    ```json
    {
        "token": "YOUR_JWT_TOKEN"
    }
    ```

## 2. Validate User Token
- **URL**: `/auth/verify-token`
- **Method**: `POST`
- **Headers**:
    - `Authorization: Bearer YOUR_JWT_TOKEN`
- **Response**:
    - **200 OK**
    - **Response Body**:
    ```json
    {
        "message": "Token is valid."
    }
    ```
    - **401 Unauthorized** - if the token is invalid.

[__Go Back Home__](../README.md)