import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'

import { AppModule } from './app/app.module'
import { system } from './helpers'

async function bootstrap() {
  // Initialize system (config, db) before starting server
  await system()

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  // Register cookie plugin
  await app.register(fastifyCookie)

  // Enable CORS for development (localhost cross-port communication)
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Accept-Language'],
  })

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = parseInt(process.env['PORT'] || '3003', 10)
  await app.listen(port, '0.0.0.0')

  Logger.log(`🚀 Shared API is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
