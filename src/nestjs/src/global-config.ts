import {
    ClassSerializerInterceptor,
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import { WrapperDataInterceptor } from './@share/interceptors/wrapper-data.interceptor';
import { Reflector } from '@nestjs/core';

export function applyGlobalConfig(app: INestApplication) {
    app.useGlobalPipes(new ValidationPipe({
        errorHttpStatusCode: 422,
    }));
    app.useGlobalInterceptors(
        new WrapperDataInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
}
