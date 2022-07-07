import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv'
import configuration from '@config/configuration';
dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Restfull API ')
    .setDescription('Task backend')
    .setVersion('1.0')
    .addTag('Basic')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
