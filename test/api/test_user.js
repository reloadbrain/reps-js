'use strict';
/* jshint node: true */
/* jshint esversion: 6 */

const Code = require('code');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

const beforeEach = lab.beforeEach;
const describe = lab.describe;
const expect = Code.expect;
const it = lab.it;

var construct = require('./construct');
require('../../models');
var server = require('../../app.js');


describe('Create user', () => {
  beforeEach((done) => {
    construct.fixtures('./fixtures/users.yaml', done);
  });

  it('can create a new user', (done) => {
    const reqData = {
      method: 'post',
      url: '/user/',
      payload: {
        email: "new@example.com",
        password: "password",
        first_name: "First",
        last_name: "Last"
      }
    };

    server.inject(reqData, (response) => {
      expect(response.statusCode).to.equal(201);
      expect(
        response.headers['content-type'].split(';')[0]
      ).to.equal('application/json');
      expect(response.result.email).to.equal("new@example.com");
      expect(response.result.first_name).to.equal("First");
      expect(response.result.last_name).to.equal("Last");
      expect(response.result.token).to.not.equal(undefined);

      done();
    });
  });

  it('cannot create a pre-existing user', (done) => {
    const reqData = {
      method: 'post',
      url: '/user/',
      payload: {
        email: "test@example.com",
        password: "password",
        first_name: "First",
        last_name: "Last"
      }
    };

    server.inject(reqData, (response) => {
      expect(response.statusCode).to.equal(400);
      expect(
        response.headers['content-type'].split(';')[0]
      ).to.equal('application/json');
      expect(response.result.email).to.equal("Already exists");

      done();
    });
  });
});


describe('Login user', () => {
  beforeEach((done) => {
    construct.fixtures('./fixtures/users.yaml', done);
  });

  it('can get a token for an existing user', (done) => {
    const req = {
      url: '/token?email=test@example.com&password=password'
    };

    server.inject(req, (response) => {
      const tokenParts = response.result.token.split('.');
      expect(response.statusCode).to.equal(200);
      expect(tokenParts[0]).to.equal('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9');
      done();
    });
  });
});