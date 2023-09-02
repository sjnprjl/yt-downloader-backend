import { Test, TestingModule } from '@nestjs/testing';
import { YtService } from './yt.service';

describe('YtService', () => {
  let service: YtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YtService],
    }).compile();

    service = module.get<YtService>(YtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
