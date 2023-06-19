import { testBlocks, mockRxApi } from '@soda/ocelloids-test';

import type { SignedBlockExtended } from '@polkadot/api-derive/types';
import { AnyNumber } from '@polkadot/types-codec/types';

import { blocks, blocksInRange } from './blocks.js';
import { Observable, map, of } from 'rxjs';

describe('blocks reactive operator', () => {
  describe('blocks', () => {
    it('should emit the latest new block', done => {
      const testPipe = blocks()(mockRxApi);
      let index = 0;
      testPipe.subscribe({
        next: (result: SignedBlockExtended) => {
          expect(result).toBeDefined();
          expect(result.block.header.number).toEqual(testBlocks[index].block.header.number);
          expect(result.block.hash).toEqual(testBlocks[index].block.hash);
          index++;
        },
        complete: () => {
          expect(index).toBe(10);
          done();
        },
      });
    });

    it('should emit the latest finalized block', done => {
      const testPipe = blocks(true)(mockRxApi);
      let index = 0;
      testPipe.subscribe({
        next: (result: SignedBlockExtended) => {
          expect(result).toBeDefined();
          expect(result.block.header.number).toEqual(testBlocks[index].block.header.number);
          expect(result.block.hash).toEqual(testBlocks[index].block.hash);
          index++;
        },
        complete: () => {
          expect(index).toBe(10);
          done();
        },
      });
    });
  });

  describe('blocksInRange', () => {
    it('should stream blocks in defined range', (done) => {
      const testPipe = blocksInRange(15950017, 3)(mockRxApi);
      let index = 0;

      testPipe.subscribe({
        next: (result: SignedBlockExtended) => {
          expect(result).toBeDefined();
          expect(result.block.header.number).toEqual(testBlocks[index].block.header.number);
          expect(result.block.hash).toEqual(testBlocks[index].block.hash);
          index++;
        },
        complete: () => {
          done();
        },
      });
    });

    it('should catch error from API', (done) => {
      let spy: jest.SpyInstance<Observable<unknown>, [blockNumber: AnyNumber], any>;

      // Mock rx api implementation for getBlockByNumber() to throw on second block
      const testPipe = mockRxApi.pipe(
        map(api => {
          spy = jest.spyOn(api.derive.chain, 'getBlockByNumber')
            .mockImplementationOnce(() => of(testBlocks[0]))
            .mockImplementationOnce(() => {throw Error('Mock error');});
          return api;
        }),
        blocksInRange(15950017, 3)
      );

      testPipe.subscribe({
        next: (result) => {
          // Only the first block will be emitted to next()
          expect(result.block.header.number.toNumber()).toBe(15950017);
        },
        error: (err: Error) => {
          expect(err.message).toBe('Mock error');
          expect(spy).toBeCalledTimes(2);
          done();
        },
      });
    });
  });
});