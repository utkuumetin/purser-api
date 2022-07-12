import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthDto } from './../src/auth/auth.dto';

describe('Auth (e2e)', () => {
  let app: INestApplication;

  const user: AuthDto = {
    email: 'example@gmail.com',
    password: 'example_password',
  };

  const notExistingUser: AuthDto = {
    email: 'not_existing@gmail.com',
    password: 'example_password',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should signup user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(201);

    expect(response.body.access_token).toBeDefined();
  });

  it('should throw error if user exist when signup', async () => {
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(403);
  });

  it('should signin user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200);

    expect(response.body.access_token).toBeDefined();
  });

  it('should throw error if user doesnt exist when signin', async () => {
    await request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        email: notExistingUser.email,
        password: notExistingUser.password,
      })
      .expect(403);
  });
});
