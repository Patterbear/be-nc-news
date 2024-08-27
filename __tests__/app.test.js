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


describe('GET /api/articles/:article_id', () => {
    test('returns correct article object with correct properties', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const article = response.body.article;

            expect(typeof article).toBe('object');

            expect(article).toMatchObject({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            });

            expect(article.article_id).toBe(1);
        });
    });
    test('returns 404 error message if given correctly formatted ID that does not exist', () => {
        return request(app)
        .get('/api/articles/32446254')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('not found');
        });
    });
    test('returns 400 error message if given ID has invalid format', () => {
        return request(app)
        .get('/api/articles/AHHHH')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toEqual('bad request');
        });
    });
});


describe('GET /api/articles', () => {
    test('returns array of objects with correct properties in descending order of creation', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(Array.isArray(articles)).toBe(true);

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('created_at', {descending: true});

            for(article of articles) {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                });
            }
        });
    });
});


describe('GET /api/articles/:article_id/comments', () => {
    test('returns array of comment objects with the given article ID and the correct properties', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments

            expect(Array.isArray(comments)).toBe(true);

            expect(comments).toBeSortedBy('created_at', {descending: true});

            for(comment of comments) {
                expect(comment).toMatchObject({
                    comment_id: expect.any(Number),
                    votes: expect.any(Number),
                    created_at: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    article_id: expect.any(Number),
                });

                expect(comment.article_id).toBe(1);
            }
        });
    });
    test('returns 404 error message if given correctly formatted article ID that does not exist', () => {
        return request(app)
        .get('/api/articles/32446254/comments')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('not found');
        });
    });
    test('returns 400 error message if given article ID has invalid format', () => {
        return request(app)
        .get('/api/articles/AHHHH/comments')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toEqual('bad request');
        });
    });
});