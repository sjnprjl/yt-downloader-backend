import { Test, TestingModule } from '@nestjs/testing';
import { YtController } from './yt.controller';
import { YtService } from './yt.service';

describe('YtController', () => {
  let controller: YtController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YtController],
      providers: [YtService],
    }).compile();

    controller = module.get<YtController>(YtController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
