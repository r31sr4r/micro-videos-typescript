import { ClassSerializerInterceptor, INestApplication } from '@nestjs/common';
import { WrapperDataInterceptor } from './@share/interceptors/wrapper-data.interceptor';
import { Reflector } from '@nestjs/core';

export function applyGlobalConfig(app: INestApplication) {
    app.useGlobalInterceptors(
        new WrapperDataInterceptor(),
        new ClassSerializerInterceptor(app.get(Reflector)),
    );
}
