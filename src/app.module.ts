import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller';

// Composition root intentionally exposes only health until authentication and
// tenant authorization are implemented. Business modules remain unmounted.
@Module({ controllers: [HealthController] })
export class AppModule {}
