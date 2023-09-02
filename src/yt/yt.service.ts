import { BadRequestException, Injectable } from '@nestjs/common';
import { spawn } from 'node:child_process';
import { YtVideo } from './types/yt-video.type';
import { DownloadYoutubeVideoDto } from './dto/yt.dto';
import { Response } from 'express';
import { v4 as uuid } from 'uuid';
import { ytResponseStatus } from 'src/utils';

@Injectable()
export class YtService {
  async getMetadata(url: string): Promise<YtVideo> {
    const yt = spawn('yt-dlp', ['-s', '--dump-json', url]);
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      yt.stdout.on('data', (data: Buffer) => {
        chunks.push(data);
      });

      yt.stderr.on('data', (err: Buffer) => {
        const messageStatus = ytResponseStatus(err.toString());
        if (messageStatus === 'error') {
          reject(
            new BadRequestException('Could not find metadata for provided url'),
          );
        }
      });

      yt.on('exit', () => {
        const json = Buffer.concat(chunks).toString();
        try {
          const parsedJson = JSON.parse(json);
          resolve({ ...parsedJson, id: uuid() });
        } catch (err) {
          reject(new BadRequestException('could not parse json'));
        }
      });
    });
  }

  async getEstimatedFileSize(url: string, format: string) {
    const ytDlpArgs = ['-O', '%(filesize,filesize_approx)s', '-f', format, url];
    const ytDlp = spawn('yt-dlp', ytDlpArgs);

    return new Promise((resolve, reject) => {
      let fileSize = '';
      ytDlp.stdout.on('data', (data: Buffer) => {
        fileSize += data.toString();
      });

      ytDlp.stdout.on('end', () => {
        resolve({ fileSize: Number(fileSize) });
      });

      ytDlp.stderr.on('data', (err: Buffer) => {
        if (ytResponseStatus(err.toString()) === 'error')
          reject('Could not get file size for the given url');
      });
    });
  }

  getFormat(isAudioOnly: boolean) {
    return !isAudioOnly ? 'b' : 'ba[ext=m4a]/ba[ext=mp3]';
  }

  async downloadVideo(response: Response, option: DownloadYoutubeVideoDto) {
    const ytDlpArgs = [
      '-o',
      '-',
      option.videoUrl,
      '-f',
      this.getFormat(option.isAudioOnly),
    ];

    const ytDlpProcess = spawn('yt-dlp', ytDlpArgs);
    ytDlpProcess.stdout.pipe(response);
    ytDlpProcess.stdout.on('close', () => {
      console.log(`[stdout]`, 'closed');
      ytDlpProcess.kill();
    });
    ytDlpProcess.on('close', (code) => {
      console.log('yt-dlp process closed with code', code);
      ytDlpProcess.kill();
    });
    ytDlpProcess.on('error', (err: Buffer) => {
      console.log('yt-dlp process error', err.toString());
      ytDlpProcess.kill();
    });
    ytDlpProcess.on('disconnect', () => {
      console.log('Got disconnected');
    });
    response.on('close', () => {
      console.log('response is closed');
      ytDlpProcess.stdout.unpipe();
      ytDlpProcess.kill();
    });
  }
}
