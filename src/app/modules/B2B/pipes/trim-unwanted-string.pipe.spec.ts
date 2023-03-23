import { TrimUnwantedStringPipe } from './trim-unwanted-string.pipe';

describe('TrimUnwantedStringPipe', () => {
  it('create an instance', () => {
    const pipe = new TrimUnwantedStringPipe();
    expect(pipe).toBeTruthy();
  });
});
