import { Module } from '@nestjs/common';
import { YtService } from './yt.service';
import { YtController } from './yt.controller';

@Module({
  controllers: [YtController],
  providers: [YtService],
})
export class YtModule {}
