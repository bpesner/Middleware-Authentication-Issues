import {Client, expect} from '@loopback/testlab';
import {AuthenticationApplication} from '../..';
import {setupApplication} from './test-helper';

describe('Auhentication', () => {
  let app: AuthenticationApplication;
  let client: Client;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => {
    await app.stop();
  });

  it('invokes GET /data', async () => {
    await client
      .get('/data')
      .expect(401);
  });

  it('invokes GET /data/1', async () => {
    await client
      .get('/data/1')
      .expect(401)
      .expect('WWW-Authenticate', 'Basic');
  });
});
