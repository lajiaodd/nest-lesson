import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WinstonModule, WinstonModuleOptions, utilities } from 'nest-winston';
import { ConfigEnum, LogEnum } from 'src/enum/config.enum';
import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'

function createDailyTransport(level: string, filename: string) {
    return  new DailyRotateFile({
        level: level,
        dirname: 'logs',
        filename: `${filename}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple() 
        )
    })
}

@Module({
    imports: [
        WinstonModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const consoleTransports = new winston.transports.Console({
                    level: 'info',
                    format: winston.format.combine(
                    winston.format.timestamp(),
                    utilities.format.nestLike()
                    )
                })

                const dailyInfoTransport = new DailyRotateFile({
                    level: configService.get(LogEnum.LOG_LEVEL),
                    dirname: 'logs',
                    filename: 'info-%DATE%.log',
                    datePattern: 'YYYY-MM-DD-HH',
                    zippedArchive: true,
                    maxSize: '20m',
                    maxFiles: '14d',
                    format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.simple() 
                    )
                })

                return  {
                    transports: [
                        consoleTransports, ...(configService.get(LogEnum.LOG_ON)?[createDailyTransport(configService.get(LogEnum.LOG_LEVEL), 'info'), createDailyTransport('warn', 'application')] : []) 
                    ]
                } as WinstonModuleOptions
            } 
        })
    ]
})
export class MyLogsModule {}
