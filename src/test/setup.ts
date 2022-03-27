import { truncateDB } from './helpers';

beforeAll(async () => {
  process.env.JWT_KEY = 'secret';
  process.env.NODE_ENV = 'test';
});

beforeEach(async () => {
  jest.clearAllMocks();
  await truncateDB();
});

afterAll(async () => {
  await truncateDB();
});
