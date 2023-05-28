import { RestrictIpMiddleware } from './restrict-ip.middleware';

describe('RestrictIpMiddleware', () => {
  it('should be defined', () => {
    expect(new RestrictIpMiddleware()).toBeDefined();
  });
});
