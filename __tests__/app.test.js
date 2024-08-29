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
                article_img_url: expect.any(String),
                comment_count: expect.any(Number)
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
    test('returns array of objects with correct properties in default order', () => {
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
    test('returns array of objects with correct properties in given order', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(Array.isArray(articles)).toBe(true);

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('created_at', {descending: false});

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
    test('returns array of objects with correct properties by given column', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(Array.isArray(articles)).toBe(true);

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('article_id', {descending: true});

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
    test('returns array of article objects which match given topic', () => {
        return request(app)
        .get('/api/articles?topic=mitch')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(Array.isArray(articles)).toBe(true);

            expect(articles.length > 0).toBe(true);

            for(article of articles) {
                expect(article.topic).toBe('mitch');
            }
        });
    });
    test('returns empty array when given topic that no articles are under', () => {
        return request(app)
        .get('/api/articles?topic=AHHHHH')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(articles).toEqual([]);
        });
    });
    test('returns array of article objects of a certain topic with correct properties in given order by given column', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&topic=mitch')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(Array.isArray(articles)).toBe(true);

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('article_id', {descending: false});

            for(article of articles) {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: 'mitch',
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number)
                });
            }
        });
    });
    test('returns array of objects with correct properties in given order by given column', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(Array.isArray(articles)).toBe(true);

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('article_id', {descending: false});

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
    test('returns 400 error if given column is invalid', () => {
        return request(app)
        .get('/api/articles?sort_by=i_am_not_a_column')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
    test('returns 400 error if given order is invalid', () => {
        return request(app)
        .get('/api/articles?order=random')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
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
                    article_id: 1,
                });
            }
        });
    });
    test('returns empty array when given article ID exists but has no associated comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then((response) => {
            const comments = response.body.comments;

            expect(comments).toEqual([]);
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

describe('POST /api/articles/:article_id/comments', () => {
    test('returns the newly added comment object', () => {
        const newComment = {
            username: 'lurker',
            body: 'I dislike this article.',
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('Accept', 'application/json')
        .expect(201)
        .then((response) => {
            const responseComment = response.body.comment;

            expect(responseComment.author).toEqual(newComment.username);
            expect(responseComment.body).toEqual(newComment.body);
        });
    });
    test('new comment is added to the comments table', () => {
        const newComment = {
            username: 'lurker',
            body: 'I dislike this article.',
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('Accept', 'application/json')
        .expect(201)
        .then(() => {
            return request(app)
            .get('/api/articles/1/comments')
            .expect(200)
            .then((response) => {
                const latestComment = response.body.comments[0];

                expect(latestComment.author).toEqual(newComment.username);
                expect(latestComment.body).toEqual(newComment.body);
            });
        });
    });
    test('returns 201 and adds comment to table despite unnecessary fields', () => {
        const newComment = {
            username: 'lurker',
            body: 'I dislike this article.',
            age: 22,
            necessary: false,
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('Accept', 'application/json')
        .expect(201)
        .then((response) => {
            const responseComment = response.body.comment;

            expect(responseComment.author).toEqual(newComment.username);
            expect(responseComment.body).toEqual(newComment.body);
        });
    });
    test('returns 404 error message if given correctly formatted article ID that does not exist', () => {
        const newComment = {
            username: 'lurker',
            body: 'I dislike this article.',
        };

        return request(app)
        .post('/api/articles/16756/comments')
        .send(newComment)
        .set('Accept', 'application/json')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found');
        });
    });
    test('returns 404 error message if given username does not exist', () => {
        const newComment = {
            username: 'idonotexist',
            body: 'I wish I existed!',
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('Accept', 'application/json')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found');
        });
    });
    test('returns 400 error message if given article ID has invalid format', () => {
        const newComment = {
            username: 'lurker',
            body: 'I dislike this article.',
        };

        return request(app)
        .post('/api/articles/AUUUUGHHHH/comments')
        .send(newComment)
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
    test('returns 400 error message if request body has missing fields', () => {
        const newComment = {
            body: 'Where is my username???'
        };

        return request(app)
        .post('/api/articles/1/comments')
        .send(newComment)
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
});


describe('PATCH /api/article/:article_id', () => {
    test('responds with updated article object', () => {
        const articleUpdate = { inc_votes: 150 };

        return request(app)
        .patch('/api/articles/1')
        .send(articleUpdate)
        .expect(200)
        .then((response) => {
            const responseArticle = response.body.article;
            expect(responseArticle).toEqual({
                article_id: 1,
                title: "Living in the shadow of a great man",
                topic: "mitch",
                author: "butter_bridge",
                body: "I find this existence challenging",
                created_at: "2020-07-09T20:11:00.000Z",
                votes: 250,
                article_img_url:
                "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
            });
        });
    });
    test('article has its vote count increased by given value', () => {
        const articleUpdate = { inc_votes: 150 };

        return request(app)
        .patch('/api/articles/1')
        .send(articleUpdate)
        .expect(200)
        .then(() => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const article = response.body.article;

                expect(article.votes).toBe(250);
            });
        });
    });
    test('article has its vote count decreased by given value', () => {
        const articleUpdate = { inc_votes: -100 };

        return request(app)
        .patch('/api/articles/1')
        .send(articleUpdate)
        .expect(200)
        .then(() => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const article = response.body.article;

                expect(article.votes).toBe(0);
            });
        });
    });
    test('returns 200 and article vote count unchanged when inc_votes is not in the body', () => {
        const articleUpdate = {};

        return request(app)
        .patch('/api/articles/1')
        .send(articleUpdate)
        .expect(200)
        .then(() => {
            return request(app)
            .get('/api/articles/1')
            .expect(200)
            .then((response) => {
                const article = response.body.article;

                expect(article.votes).toBe(100);
            });
        });
    });
    test('returns 400 error message if body contains invalid inc_votes property', () => {
        const articleUpdate = { inc_votes: 'AHHHH' };

        return request(app)
        .patch('/api/articles/1')
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
    test('returns 404 error message if given correctly formatted article ID that does not exist', () => {
        const articleUpdate = { inc_votes: 150 };

        return request(app)
        .patch('/api/articles/1322334432')
        .send(articleUpdate)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found');
        });
    });
    test('returns 400 error message if given article ID has invalid format', () => {
        const articleUpdate = { inc_votes: 150 };

        return request(app)
        .patch('/api/articles/AUUGGGHHH')
        .send(articleUpdate)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
});


describe('DELETE /api/comments/:comment_id', () => {
    test('responds with 204 and no content', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then((response) => {
            expect(response.body).toEqual({});
        });
    });
    test('deletes comment from comments table', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(() => {
            return request(app)
            .get('/api/articles/9/comments')
            .expect(200)
            .then((response) => {
                const comments = response.body.comments;

                for(comment of comments) {
                    expect(comment).not.toEqual({
                        comment_id: 1,
                        body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
                        votes: 16,
                        author: "butter_bridge",
                        article_id: 9,
                        created_at: 1586179020000,
                    });
                }
            });
        });
    });
    test('returns 404 error message if given correctly formatted comment ID that does not exist', () => {
        return request(app)
        .delete('/api/comments/1322334432')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found');
        });
    });
    test('returns 400 error message if given comment ID has invalid format', () => {
        return request(app)
        .delete('/api/comments/AHHHH')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
});


describe('GET /api/users', () => {
    test('returns array of objects with correct properties', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((response) => {
            const users = response.body.users;

            expect(Array.isArray(users)).toBe(true);

            for(user of users) {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                });
            }
        });
    });
});
