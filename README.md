
# API Documentation

### Base URL
```
https://api.example.com/api/v1
```

## Authentication
Our API uses [ Bearer Token ] for authentication. To authenticate, include your API key in the header of each request:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## Error Response Format
```json
{
    "error": "<ERROR_DESCRIPTION>"
}
```

## Common Error Codes
- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Missing or invalid API key
- **404 Not Found**: Requested resource does not exist
- **500 Internal Server Error**: An unexpected error occurred

## Endpoints
- [Authentication](./docs/AUTHENTICATION.md)

## Versioning
- Current Version: `v1`