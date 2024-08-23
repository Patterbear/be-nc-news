const { topicData, articleData, userData, commentData } = require('../db/data/test-data/index');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const request = require('supertest');

beforeEach(() => {
    return seed({ topicData, userData, articleData, commentData });
});

afterAll(() => {
    return db.end();
});

describe('GET /api/topics', () => {
    test('returns array of objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const topics = JSON.parse(response.text).topics;
            
            expect(Array.isArray(topics)).toBe(true);

            for(topic of topics) {
                expect(typeof topic).toBe('object');
            }
        });
    });
    test('array objects contain correct properties', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
            const topics = JSON.parse(response.text).topics;

            for(topic of topics) {
                expect(topic.hasOwnProperty('slug')).toBe(true);
                expect(topic.hasOwnProperty('description')).toBe(true);
            }
        });
    });
});