import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: 'http://localhost:3000', // TODO: get from global .env and expose on docker-compose.dev.yml
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    // credentials: true,
  });

  await app.listen(process.env.APP_PORT);
}
bootstrap();
