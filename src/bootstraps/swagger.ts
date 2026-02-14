import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";


// export function setupApp(app: INestApplication) {
//   app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
// }


export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Swagger API')
    .setVersion('1.0')
    .addGlobalResponse({
      status: 500,
      description: 'Internal server error',
    })
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'JWT-Auth')
    .addSecurityRequirements('JWT-Auth') // Applied to everything by default
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json'
  });
}
