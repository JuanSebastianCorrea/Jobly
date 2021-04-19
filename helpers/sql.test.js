const { sqlForPartialUpdate } = require('./sql');
const { BadRequestError } = require('../expressError');

describe('sqlForPartialUpdate', function() {
	test('returns correct SQL query setCols and its values for updating 2 fields', function() {
		let data = { firstName: 'John', lastName: 'Smith' };
		let jsToSql = {
			firstName: 'first_name',
			lastName: 'last_name'
		};

		expect(sqlForPartialUpdate(data, jsToSql)).toEqual({
			setCols: '"first_name"=$1, "last_name"=$2',
			values: [ 'John', 'Smith' ]
		});
	});

	test('returns correct SQL query setCols and its values for updating 1 field', function() {
		let data = { firstName: 'John' };
		let jsToSql = {
			firstName: 'first_name',
			lastName: 'last_name'
		};

		expect(sqlForPartialUpdate(data, jsToSql)).toEqual({
			setCols: '"first_name"=$1',
			values: [ 'John' ]
		});
	});
});
