const testData = require('../db/data/test-data/index');
const endpoints = require('../endpoints');
const app = require('../app');
const seed = require('../db/seeds/seed');
const db = require('../db/connection');
const request = require('supertest');
const articles = require('../db/data/test-data/articles');

beforeEach(() => seed(testData));

afterAll(() => {
    return db.end();
});

describe('GET /api/topics', () => {
    test('returns array of topic objects with correct properties', () => {
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
                article_id: 1,
                body: expect.any(String),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String)
            });
        });
    });
    test('returns correct article object with comment_count property', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
            const article = response.body.article;

            expect(article.hasOwnProperty('comment_count'));
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
    test('returns array of article objects with correct properties in default order', () => {
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
    test('returns array of article objects in given order', () => {
        return request(app)
        .get('/api/articles?order=asc')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('created_at', {descending: false});
        });
    });
    test('returns array of article objects sorted by given column', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('article_id', {descending: true});
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
    test('returns empty array when given existing topic that no articles are under', () => {
        return request(app)
        .get('/api/articles?topic=paper')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(articles).toEqual([]);
        });
    });
    test('returns array of article objects of a certain topic in given order by given column', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc&topic=mitch')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('article_id', {descending: false});

            for(article of articles) {
                expect(article.topic).toBe('mitch');
            }
        });
    });
    test('returns array of article objects in given order by given column', () => {
        return request(app)
        .get('/api/articles?sort_by=article_id&order=asc')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(articles.length > 0).toBe(true);

            expect(articles).toBeSortedBy('article_id', {descending: false});
        });
    });
    test('returns array of article objects whose length is determined in the query', () => {
        return request(app)
        .get('/api/articles?limit=3')
        .expect(200)
        .then((response) => {
            const articles = response.body.articles;

            expect(articles.length).toBe(3);
        });
    });
    test('returns chosen page of article objects whose length is determined in the query', () => {
        return request(app)
        .get('/api/articles?limit=5&p=2')
        .expect(200)
        .then((response) => {
            const firstArticle = response.body.articles[0];

            expect(firstArticle.article_id).toBe(5);
        });
    });
    test('returns total number of articles matching the query despite limit', () => {
        return request(app)
        .get('/api/articles?topic=mitch&limit=1')
        .expect(200)
        .then((response) => {
            expect(response.body.total_count).toBe(12);
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
    test('returns 404 error if given topic does not exist', () => {
        return request(app)
        .get('/api/articles?topic=AHHHHH')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found');
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
    test('returns chosen page of comment objects whose length is determined in the query', () => {
        return request(app)
        .get('/api/articles/1/comments?limit=2&p=2')
        .expect(200)
        .then((response) => {
            expect(response.body.comments.length).toBe(2);

            const firstComment = response.body.comments[0];

            expect(firstComment.comment_id).toBe(18);
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
    test('returns array of user objects with correct properties', () => {
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


describe('GET /api/users/:username', () => {
    test('returns correct article object with correct properties', () => {
        return request(app)
        .get('/api/users/icellusedkars')
        .expect(200)
        .then((response) => {
            const user = response.body.user;

            expect(typeof user).toBe('object');

            expect(user).toMatchObject({
                username: 'icellusedkars',
                name: 'sam',
                avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
            });
        });
    });
    test('returns 404 error message if given username that does not exist', () => {
        return request(app)
        .get('/api/users/idonotexist')
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toEqual('not found');
        });
    });
});


describe('PATCH /api/comment/:comment_id', () => {
    test('responds with updated comment object', () => {
        const commentUpdate = { inc_votes: 4 };

        return request(app)
        .patch('/api/comments/1')
        .send(commentUpdate)
        .expect(200)
        .then((response) => {
            const responseComment = response.body.comment;
            expect(responseComment).toEqual({
                comment_id: 1,
                body: expect.any(String),
                votes: 20,
                author: expect.any(String),
                article_id: 9,
                created_at: expect.any(String)
            });
        });
    });
    test('comment has its vote count increased by given value', () => {
        const commentUpdate = { inc_votes: 4 };

        return request(app)
        .patch('/api/comments/1')
        .send(commentUpdate)
        .expect(200)
        .then((response) => {
            const responseComment = response.body.comment;

            expect(responseComment.votes).toBe(20);
        });
    });
    test('comment has its vote count decreased by given value', () => {
        const commentUpdate = { inc_votes: -6 };

        return request(app)
        .patch('/api/comments/1')
        .send(commentUpdate)
        .expect(200)
        .then((response) => {
            const responseComment = response.body.comment;
            
            expect(responseComment.votes).toBe(10);
        });
    });
    test('returns 200 and comment vote count unchanged when inc_votes is not in the body', () => {
        const commentUpdate = {};

        return request(app)
        .patch('/api/comments/1')
        .send(commentUpdate)
        .expect(200)
        .then((response) => {
            const responseComment = response.body.comment;
            
            expect(responseComment.votes).toBe(16);
        });
    });
    test('returns 400 error message if body contains invalid inc_votes property', () => {
        const commentUpdate = { inc_votes: 'AHHHH' };

        return request(app)
        .patch('/api/comments/1')
        .send(commentUpdate)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
    test('returns 404 error message if given correctly formatted article ID that does not exist', () => {
        const commentUpdate = { inc_votes: 4 };

        return request(app)
        .patch('/api/comments/1365464')
        .send(commentUpdate)
        .expect(404)
        .then((response) => {
            expect(response.body.msg).toBe('not found');
        });
    });
    test('returns 400 error message if given comment ID has invalid format', () => {
        const commentUpdate = { inc_votes: 4 };

        return request(app)
        .patch('/api/comments/AAAAAAAAAAAAAAAAAAAAH')
        .send(commentUpdate)
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
});


describe('POST /api/articles', () => {
    test('returns the newly added article object', () => {
        const newArticle = {
            author: 'lurker',
            title: 'Destroying Southprogrammers',
            body: 'Too long have we been pestered by Southcoders. I propose we eliminate them using cats.',
            topic: 'cats',
            article_img_url: 'https://ih1.redbubble.net/image.2452438684.2919/st,small,507x507-pad,600x600,f8f8f8.jpg'
        };

        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .set('Accept', 'application/json')
        .expect(201)
        .then((response) => {
            const responseArticle = response.body.article;

            expect(responseArticle).toMatchObject({
                article_id: expect.any(Number),
                author: 'lurker',
                title: 'Destroying Southprogrammers',
                body: 'Too long have we been pestered by Southcoders. I propose we eliminate them using cats.',
                topic: 'cats',
                article_img_url: 'https://ih1.redbubble.net/image.2452438684.2919/st,small,507x507-pad,600x600,f8f8f8.jpg',
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0
            });
        });
    });
    test('new article is added to the articles table', () => {
        const newArticle = {
            author: 'lurker',
            title: 'Destroying Southprogrammers',
            body: 'Too long have we been pestered by Southcoders. I propose we eliminate them using cats.',
            topic: 'cats',
            article_img_url: 'https://ih1.redbubble.net/image.2452438684.2919/st,small,507x507-pad,600x600,f8f8f8.jpg'
        };

        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .set('Accept', 'application/json')
        .expect(201)
        .then(() => {
            return request(app)
            .get('/api/articles')
            .expect(200)
            .then((response) => {
                const latestArticle = response.body.articles[0];

                expect(latestArticle).toMatchObject({
                    article_id: expect.any(Number),
                    author: 'lurker',
                    title: 'Destroying Southprogrammers',
                    topic: 'cats',
                    article_img_url: 'https://ih1.redbubble.net/image.2452438684.2919/st,small,507x507-pad,600x600,f8f8f8.jpg',
                    votes: 0,
                    created_at: expect.any(String),
                    comment_count: 0
                });
            });
        });
    });
    test('returns 201 and adds article to table with default article_img_url as one is not provided', () => {
        const newArticle = {
            author: 'lurker',
            title: 'Destroying Southprogrammers',
            body: 'Too long have we been pestered by Southcoders. I propose we eliminate them using cats.',
            topic: 'cats'
        };

        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .set('Accept', 'application/json')
        .expect(201)
        .then((response) => {
            const responseArticle = response.body.article;

            expect(responseArticle).toMatchObject({
                article_id: expect.any(Number),
                author: 'lurker',
                title: 'Destroying Southprogrammers',
                body: 'Too long have we been pestered by Southcoders. I propose we eliminate them using cats.',
                topic: 'cats',
                article_img_url: 'https://pix4free.org/assets/library/2021-08-07/originals/default.jpg',
                votes: 0,
                created_at: expect.any(String),
                comment_count: 0
            });
        });
    });
    test('returns 400 if given article has missing fields', () => {
        const newArticle = {};

        return request(app)
        .post('/api/articles')
        .send(newArticle)
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
});


describe('POST /api/topics', () => {
    test('returns the newly added topic object', () => {
        const newTopic = {
            description: 'everything cinema',
            slug: 'film'
          }

        return request(app)
        .post('/api/topics')
        .send(newTopic)
        .set('Accept', 'application/json')
        .expect(201)
        .then((response) => {
            const responseTopic = response.body.topic;

            expect(responseTopic).toMatchObject({
                description: 'everything cinema',
                slug: 'film'
            });
        });
    });
    test('new topic is added to the topics table', () => {
        const newTopic = {
            description: 'everything cinema',
            slug: 'film'
          }

        return request(app)
        .post('/api/topics')
        .send(newTopic)
        .set('Accept', 'application/json')
        .expect(201)
        .then(() => {
            return request(app)
            .get('/api/topics')
            .expect(200)
            .then((response) => {
                const latestTopic = response.body.topics.at(-1);

                expect(latestTopic).toMatchObject({
                    description: 'everything cinema',
                    slug: 'film'
                });
            });
        });
    });
    test('returns 400 if given topic has missing fields', () => {
        const newTopic = {};

        return request(app)
        .post('/api/topics')
        .send(newTopic)
        .set('Accept', 'application/json')
        .expect(400)
        .then((response) => {
            expect(response.body.msg).toBe('bad request');
        });
    });
});