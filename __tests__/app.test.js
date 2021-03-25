const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

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
  })

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        // expect(createMessage).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '2',
          quantity: 10,
        });
      });
  });

  it('ASYNC/AWAIT: creates a new order in our database and sends a text message', async () => {
    const res = await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 5 });

    expect(res.body).toEqual({
      id: '2',
      quantity: 5,
    });
  });

  it('gets a single order by id', () => {
    return request(app)
      .get('/api/v1/orders/1')
      .then((res) => {
        expect(res.body).toEqual([{
          id: '1',
          quantity: 5,
        }]);
      });
  });
})
