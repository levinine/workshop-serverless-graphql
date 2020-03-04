export function getResponse(statusCode: number, payload: any) {
    let body = payload;
    if (payload instanceof Error) {
        body = {
            error: payload.message,
            stack: payload.stack,
        }
    }
    return {
        statusCode: statusCode,
        body: JSON.stringify(body),
    };
}