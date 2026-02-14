import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AppLoggerMiddleware } from './common/middlewares';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ExceptionsFilter } from './common/filters';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard, RolesGuard } from './common/guards';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { JobCandidateModule } from './modules/job-candidate/job-candidate.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: () => {
        return {
          uri: appConfig.database.dbUrl,
          onConnectionCreate: (connection: Connection) => {
            // Register event listeners here
            return connection;
          },
          // dbName: appConfig.database.dbName,
          // auth: {
          //   username: appConfig.database.dbUser,
          //   password: appConfig.database.dbPass,
          // },
        };
      },
    }),
    UsersModule,
    AuthModule,
    CandidatesModule,
    JobsModule,
    JobCandidateModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_FILTER, useClass: ExceptionsFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
