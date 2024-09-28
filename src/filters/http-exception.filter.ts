import { ArgumentsHost, Catch, ExceptionFilter, HttpException, LoggerService } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    constructor(private logger: LoggerService){}
    catch(exception: HttpException, host: ArgumentsHost) {
        this.logger.error(exception.message, exception.stack)

        const ctx = host.switchToHttp()
        const request = ctx.getRequest()
        const response = ctx.getResponse()
        console.log("🚀 ~ HttpExceptionFilter ~ response:", response)
        const status = exception.getStatus()
        console.log("🚀 ~ HttpExceptionFilter ~ status:", status)

        response.status(status).json({
            code: status,
            timeStamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: exception.message || exception.name
        })
    }
    
}