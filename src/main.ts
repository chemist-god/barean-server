import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const rawPort = process.env.PORT ?? '5000';
  if (!/^\d+$/.test(rawPort) || Number(rawPort) < 1 || Number(rawPort) > 65535)
    throw new Error('PORT must be an integer from 1 to 65535');
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });
  await app.listen(Number(rawPort), process.env.HOST ?? '127.0.0.1');
}
void bootstrap().catch((error: unknown) => {
  console.error(
    'Backend startup failed:',
    error instanceof Error ? error.message : 'Unknown startup error',
  );
  process.exitCode = 1;
});
