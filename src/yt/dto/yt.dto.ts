import { IsBoolean, IsUrl } from 'class-validator';

export class DownloadYoutubeVideoDto {
  @IsUrl()
  videoUrl: string;

  @IsBoolean()
  isAudioOnly: boolean;
}
