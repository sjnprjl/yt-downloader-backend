import {
  Body,
  Controller,
  Get,
  Param,
  ParseBoolPipe,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { YtService } from './yt.service';
import { DownloadYoutubeVideoDto } from './dto/yt.dto';
import { Response } from 'express';

@Controller('yt')
export class YtController {
  constructor(private readonly ytService: YtService) {}

  @Post('file-size')
  async getEstimatedFileSize(@Body() body: DownloadYoutubeVideoDto) {
    const format = this.ytService.getFormat(body.isAudioOnly);
    return await this.ytService.getEstimatedFileSize(body.videoUrl, format);
  }

  @Get(':url/metadata')
  async getMetadata(@Param('url') url: string) {
    const { id, thumbnail, title, fileSize } = await this.ytService.getMetadata(
      url,
    );
    return { id, thumbnail, title, url, fileSize };
  }
  @Post('download')
  async downloadVideo(
    @Body() body: DownloadYoutubeVideoDto,
    @Res() response: Response,
  ) {
    console.log({ body });
    this.ytService.downloadVideo(response, body);
  }
}
