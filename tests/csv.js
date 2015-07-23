'use strict';

var test = require('tape');
var csv = require('../lib/csv');

var sampleResults = [
  {
    ACCOUNT_ID: '2',
    PARENT_ACCOUNT_ID: '',
    NAME: 'Mathematics',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '3',
    PARENT_ACCOUNT_ID: '',
    NAME: 'English',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '4',
    PARENT_ACCOUNT_ID: '',
    NAME: 'Science',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '26',
    PARENT_ACCOUNT_ID: '',
    NAME: 'Religious Studies',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '27',
    PARENT_ACCOUNT_ID: '',
    NAME: 'PDHPE',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '28',
    PARENT_ACCOUNT_ID: '',
    NAME: 'Languages',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '29',
    PARENT_ACCOUNT_ID: '',
    NAME: 'Learning Support',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '30',
    PARENT_ACCOUNT_ID: '',
    NAME: 'HSIE',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '31',
    PARENT_ACCOUNT_ID: '',
    NAME: 'TAS',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '32',
    PARENT_ACCOUNT_ID: '',
    NAME: 'CAPA',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '33',
    PARENT_ACCOUNT_ID: '',
    NAME: 'ConnectED',
    STATUS: 'active'
  },
  {
    ACCOUNT_ID: '35',
    PARENT_ACCOUNT_ID: '',
    NAME: 'History',
    STATUS: 'active'
  }
];

test('it should write the results to csv', function (t) {
  t.plan(1);
  csv.make('sub-accounts', sampleResults)
    .then(function (results) {
      t.equal(typeof results.path, 'string', 'wrote to csv');
    }, function (error) {
      t.equal(error, null);
    });
});
