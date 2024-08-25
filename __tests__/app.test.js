const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const request = require('supertest');

beforeEach(() => seed(testData));

afterAll(() => {
    return db.end();
});

describe('GET /api/topics', () => {
    test('returns array of objects with correct properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const topics = response.body.topics;

            expect(Array.isArray(topics)).toBe(true);

            for(topic of topics) {
                expect(topic).toMatchObject({
                    slug: expect.any(String),
                    description: expect.any(String)
                });
            }
        });
    });
});


describe('GET /api', () => {
    test('returns contents of endpoints.json', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then((response) => {
            expect(response.body).toEqual(endpoints);
        });
    });
});