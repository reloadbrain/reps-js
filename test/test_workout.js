'use strict';
/* jshint node: true */
/* jshint esversion: 6 */

const Fixtures = require('sequelize-fixtures');

const Code = require('code');
const Lab = require('lab');
const Shot = require('shot');

const lab = exports.lab = Lab.script();

const before = lab.before;
const describe = lab.describe;
const expect = Code.expect;
const it = lab.it;

var models = require('../models');
var server = require('../app.js');

const headers = {
  Authorization: 'Bearer ' +
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20' +
    'iLCJzY29wZSI6WyJhbGwiXSwiaWQiOjcsImlhdCI6MTQ1NDc1NTU3MH0.EzQTjkaQ0SfT5_8' +
    'SxuYAW9pVg9ZbWUrMEfOI79T0YZQ'
};


describe('Workout list', () => {
  before((done) => {
    Fixtures.loadFile('./fixtures/workouts.yaml', models).then(() => {
      done();
    });
  });

  it('retrieves a list of workouts from the API', (done) => {
    const reqData = {
      method: 'get',
      url: '/workouts/',
      headers: headers
    };

    server.inject(reqData, (response) => {
      expect(response.statusCode).to.equal(200);
      expect(
        response.headers['content-type'].split(';')[0]
      ).to.equal('application/json');
      expect(response.result.length).to.equal(1);
      expect(response.result[0].workout_date).to.equal('2016-01-10');

      done();
    });
  });

  it('retrieves a workout from a given URL', (done) => {
    const reqData = {
      method: 'get',
      url: '/workouts/1',
      headers: headers
    };

    server.inject(reqData, (response) => {
      expect(response.statusCode).to.equal(200);
      expect(
        response.headers['content-type'].split(';')[0]
      ).to.equal('application/json');

      expect(response.result.workout_date).to.equal('2016-01-10');
      expect(response.result.location.name).to.equal('Test Location');

      done();
    });
  });

  it('does not allow a user  another user\'s workouts', (done) => {
    const reqData = {
      method: 'get',
      url: '/workouts/2',
      headers: headers
    };

    server.inject(reqData, (response) => {
      expect(response.statusCode).to.equal(404);

      done();
    });
  });
});
