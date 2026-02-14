import { Controller, Get } from '@nestjs/common';
import { Public } from './common/decorators';

@Public() // Accessible to anyone
@Controller()
export class AppController {

  @Get()
  getHello() {
    return 'Server is running';
  }
}
