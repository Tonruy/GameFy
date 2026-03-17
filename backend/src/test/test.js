const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/games', () => ({
  getTrendingGamesService: jest.fn(),
  searchGameService: jest.fn(),
  getGameByIdService: jest.fn(),
  getNewGamesService: jest.fn(),
  getSimilarGamesService: jest.fn()
}));

jest.mock('../services/catalog', () => ({
  getGenresService: jest.fn(),
  getPlatformsService: jest.fn()
}));

jest.mock('../services/auth', () => ({
  registerService: jest.fn(),
  loginService: jest.fn()
}));

jest.mock('../models/User', () => ({
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  find: jest.fn()
}));

jest.mock('../services/igdb', () => ({
  executeIgdbQuery: jest.fn()
}));

const app = require('../app');

const gamesService = require('../services/games');
const catalogService = require('../services/catalog');
const authService = require('../services/auth');
const User = require('../models/User');
const { executeIgdbQuery } = require('../services/igdb');

const buildSelectMock = (value) => ({
  select: jest.fn().mockResolvedValue(value)
});

const createAccessToken = (payload = { userId: 'user-1', role: 'user' }) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN, { expiresIn: '15m' });
};

const createRefreshToken = (payload = { userId: 'user-1', role: 'user' }) => {
  return jwt.sign(payload, process.env.SECRET_TOKEN_REFRESH, { expiresIn: '60m' });
};

beforeAll(() => {
  process.env.SECRET_TOKEN = 'test-secret-token';
  process.env.SECRET_TOKEN_REFRESH = 'test-secret-refresh-token';
  process.env.EXPIRES_TOKEN = '15m';
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Health endpoint', () => {
  test('GET /health -> returns ok true', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});

describe('Games endpoints', () => {
  test('GET /api/games/trending -> returns trending games', async () => {
    gamesService.getTrendingGamesService.mockResolvedValue([{ gameId: 1, name: 'Game A' }]);

    const response = await request(app).get('/api/games/trending');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ gameId: 1, name: 'Game A' }]);
  });

  test('GET /api/games/new -> returns new games', async () => {
    gamesService.getNewGamesService.mockResolvedValue([{ gameId: 2, name: 'Game B' }]);

    const response = await request(app).get('/api/games/new');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ gameId: 2, name: 'Game B' }]);
  });

  test('GET /api/games/search -> returns 400 when missing searchQuery', async () => {
    const response = await request(app).get('/api/games/search');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing the parameter' });
  });

  test('GET /api/games/search?searchQuery=zelda -> returns games list', async () => {
    gamesService.searchGameService.mockResolvedValue([{ gameId: 3, name: 'Zelda' }]);

    const response = await request(app).get('/api/games/search?searchQuery=zelda');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ gameId: 3, name: 'Zelda' }]);
    expect(gamesService.searchGameService).toHaveBeenCalledWith('zelda');
  });

  test('GET /api/games/:gameId -> returns game detail', async () => {
    gamesService.getGameByIdService.mockResolvedValue({ gameId: 10, name: 'Game Detail' });

    const response = await request(app).get('/api/games/10');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ gameId: 10, name: 'Game Detail' });
    expect(gamesService.getGameByIdService).toHaveBeenCalledWith('10');
  });

  test('GET /api/games/:gameId/similar -> returns similar games', async () => {
    gamesService.getSimilarGamesService.mockResolvedValue([{ gameId: 21, name: 'Similar Game' }]);

    const response = await request(app).get('/api/games/20/similar');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ gameId: 21, name: 'Similar Game' }]);
    expect(gamesService.getSimilarGamesService).toHaveBeenCalledWith('20');
  });
});

describe('Catalog endpoints', () => {
  test('GET /api/catalog/genres -> returns genres list', async () => {
    catalogService.getGenresService.mockResolvedValue([{ genreId: 1, name: 'RPG' }]);

    const response = await request(app).get('/api/catalog/genres');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ genreId: 1, name: 'RPG' }]);
  });

  test('GET /api/catalog/platforms -> returns platforms list', async () => {
    catalogService.getPlatformsService.mockResolvedValue([{ platformId: 6, name: 'PC' }]);

    const response = await request(app).get('/api/catalog/platforms');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ platformId: 6, name: 'PC' }]);
  });
});

describe('Auth endpoints', () => {
  test('POST /api/auth/register -> returns 400 when service returns an error', async () => {
    authService.registerService.mockResolvedValue({ errorMessage: 'Invalid email format' });

    const response = await request(app).post('/api/auth/register').send({
      email: 'bad-email',
      username: 'testUser',
      password: '12345678'
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ errorMessage: 'Invalid email format' });
  });

  test('POST /api/auth/register -> creates user', async () => {
    authService.registerService.mockResolvedValue({ userId: '507f1f77bcf86cd799439011' });

    const response = await request(app).post('/api/auth/register').send({
      email: 'test@test.com',
      username: 'testUser',
      password: '12345678'
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ userId: '507f1f77bcf86cd799439011' });

    expect(authService.registerService).toHaveBeenCalledWith(
      'test@test.com',
      'testUser',
      '12345678'
    );
  });

  test('POST /api/auth/login -> returns 401 when service returns an error', async () => {
    authService.loginService.mockResolvedValue({ errorMessage: 'Invalid credentials' });

    const response = await request(app).post('/api/auth/login').send({
      identifier: 'test',
      password: 'wrong'
    });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ errorMessage: 'Invalid credentials' });
  });

  test('POST /api/auth/login -> returns token and refreshToken', async () => {
    authService.loginService.mockResolvedValue({
      token: 'access-token',
      refreshToken: 'refresh-token'
    });

    const response = await request(app).post('/api/auth/login').send({
      identifier: 'test',
      password: '12345678'
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      token: 'access-token',
      refreshToken: 'refresh-token'
    });

    expect(authService.loginService).toHaveBeenCalledWith('test', '12345678');
  });

  test('POST /api/auth/refresh -> returns 404 (not implemented)', async () => {
    const response = await request(app).post('/api/auth/refresh').send({
      refreshToken: 'anything'
    });

    expect(response.status).toBe(404);
  });
});

describe('Users endpoints', () => {
  test('GET /api/users/me -> returns 401 when token is missing', async () => {
    const response = await request(app).get('/api/users/me');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Access denied' });
  });

  test('GET /api/users/me -> returns profile data', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findById.mockReturnValue(
      buildSelectMock({
        _id: 'user-1',
        email: 'test@test.com',
        username: 'tester',
        role: 'user'
      })
    );

    const response = await request(app).get('/api/users/me').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('tester');
  });

  test('PATCH /api/users/me -> returns 400 when body is empty', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });

    const response = await request(app).patch('/api/users/me').set('auth-token', token).send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Missing fields to update' });
  });

  test('PATCH /api/users/me -> updates profile', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue(
      buildSelectMock({
        _id: 'user-1',
        avatarUrl: 'https://avatar.com/image.jpg',
        bio: 'Junior dev'
      })
    );

    const response = await request(app).patch('/api/users/me').set('auth-token', token).send({
      avatarUrl: 'https://avatar.com/image.jpg',
      bio: 'Junior dev'
    });

    expect(response.status).toBe(200);
    expect(response.body.bio).toBe('Junior dev');
  });

  test('GET /api/users/me/favorites -> returns favorites cards', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findById.mockReturnValue(buildSelectMock({ favorites: [10, 11] }));
    executeIgdbQuery.mockResolvedValue([
      { id: 10, name: 'Game 10', cover: { url: '//image10.jpg' } },
      { id: 11, name: 'Game 11', cover: { url: '//image11.jpg' } }
    ]);

    const response = await request(app).get('/api/users/me/favorites').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0]).toHaveProperty('id', 10);
  });

  test('POST /api/users/me/favorites/:gameId -> adds favorite', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue(buildSelectMock({ _id: 'user-1' }));

    const response = await request(app).post('/api/users/me/favorites/30').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Game added to favorites' });
  });

  test('DELETE /api/users/me/favorites/:gameId -> removes favorite', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue(buildSelectMock({ _id: 'user-1' }));

    const response = await request(app).delete('/api/users/me/favorites/30').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Game removed from favorites' });
  });

  test('GET /api/users/me/wishlist -> returns wishlist cards', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findById.mockReturnValue(buildSelectMock({ wishlist: [40] }));
    executeIgdbQuery.mockResolvedValue([{ id: 40, name: 'Game 40', cover: { url: '//image40.jpg' } }]);

    const response = await request(app).get('/api/users/me/wishlist').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('id', 40);
  });

  test('POST /api/users/me/wishlist/:gameId -> adds wishlist', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue(buildSelectMock({ _id: 'user-1' }));

    const response = await request(app).post('/api/users/me/wishlist/50').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Game added to wishlist' });
  });

  test('DELETE /api/users/me/wishlist/:gameId -> removes wishlist', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });
    User.findByIdAndUpdate.mockReturnValue(buildSelectMock({ _id: 'user-1' }));

    const response = await request(app).delete('/api/users/me/wishlist/50').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Game removed from wishlist' });
  });

  test('GET /api/users/:id -> returns 401 for user role', async () => {
    const token = createAccessToken({ userId: 'user-1', role: 'user' });

    const response = await request(app).get('/api/users/user-2').set('auth-token', token);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Not allowed' });
  });

  test('GET /api/users/:id -> returns user data for admin', async () => {
    const token = createAccessToken({ userId: 'admin-1', role: 'admin' });
    User.findById.mockReturnValue(
      buildSelectMock({
        _id: 'user-2',
        email: 'user2@test.com',
        username: 'user2'
      })
    );

    const response = await request(app).get('/api/users/user-2').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'user2');
  });

  test('GET /api/users -> returns users list for admin', async () => {
    const token = createAccessToken({ userId: 'admin-1', role: 'admin' });
    User.find.mockReturnValue(
      buildSelectMock([
        { _id: 'user-1', username: 'tester1' },
        { _id: 'user-2', username: 'tester2' }
      ])
    );

    const response = await request(app).get('/api/users').set('auth-token', token);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });
});
