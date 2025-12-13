import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import fastifyCookie from '@fastify/cookie'

import { AppModule } from './app/app.module'
import { system } from './helpers'

async function bootstrap() {
  await system()

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())

  await app.register(fastifyCookie)

  const globalPrefix = 'api'
  app.setGlobalPrefix(globalPrefix)
  const port = parseInt(process.env['PORT'] || '3003', 10)
  await app.listen(port, '0.0.0.0')

  Logger.log(`Shared API is running on: http://localhost:${port}/${globalPrefix}`)
}

bootstrap()
