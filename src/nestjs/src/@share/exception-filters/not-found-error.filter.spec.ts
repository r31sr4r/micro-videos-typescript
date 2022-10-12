import { Controller, Get, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundErrorFilter } from './not-found-error.filter';
import request from 'supertest';
import { NotFoundError } from '@fc/micro-videos/@seedwork/domain';

@Controller('stub')
class StubController {
    @Get()
    index() {
        throw new NotFoundError('Fake not found error message');
    }
}

describe('NotFoundErrorFilter Unit Tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
          controllers: [StubController],
      }).compile();
      app = moduleFixture.createNestApplication();
      app.useGlobalFilters(new NotFoundErrorFilter());
      await app.init();
  });

  it('should catch EntityValidationError', async () => {
      return request(app.getHttpServer())
          .get('/stub')
          .expect(404)
          .expect({
              statusCode: 404,
              error: 'Not Found',
              message: 'Fake not found error message',
          });
  });
});
