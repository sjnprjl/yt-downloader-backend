import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { YtModule } from './yt/yt.module';

@Module({
  imports: [YtModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
