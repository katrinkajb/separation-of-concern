const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');
jest.mock('../lib/utils/twilio.js');
const twilio = require('../lib/utils/twilio.js');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  // to run same setup before each test
  let order;
  beforeEach(async() => {
    order = await Order.insert({quantity: 5})

    twilio.sendSms.mockClear();
  })

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '2',
          quantity: 10,
        });
      });
  });

// Same test, different way of doing it
  // it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
  //   const res = await request(app)
  //     .post('/api/v1/orders')
  //     .send({ quantity: 5 });

  //   expect(res.body).toEqual({
  //     id: '2',
  //     quantity: 5,
  //   });
  // });

  it('gets all orders', async () => {
    return request(app)
      .get('/api/v1/orders')
      .then((res) => {
        expect(res.body).toEqual([{
          id: '1',
          quantity: 5,
        }]);
      });
  });

  it('gets a single order by id', async () => {
    return request(app)
      .get('/api/v1/orders/1')
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 5,
        });
      });
  });

  it('updates an order in our database and sends a text message', () => {
    return request(app)
      .put('/api/v1/orders/1')
      .send({ quantity: 10 })
      .then((res) => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 10,
        });
      });
  });

  it('deletes a single order by id', async () => {
    return request(app)
      .delete('/api/v1/orders/1')
      .then((res) => {
        expect(twilio.sendSms).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 5,
        });
      });
  });

})
