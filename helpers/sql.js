const { BadRequestError } = require('../expressError');

/* 
*   dataToUpdate:
*   { keyName : 'valueName', ... }
*   
*   jsToSql is an object where keys are in JS camelCase and values are the snake_case version of the SQL colName,
*   it helps to identify the columns that need to be updated 
*   
*   This returns 2 parts of the the SQL query: 
*   setCols : ' "first_name"=$1 ', ' "age"=$2 '
*   values : ['value1', 'value2', ...]
*/

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
	const keys = Object.keys(dataToUpdate);
	if (keys.length === 0) throw new BadRequestError('No data');

	// {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
	const cols = keys.map((colName, idx) => `"${jsToSql[colName] || colName}"=$${idx + 1}`);

	return {
		setCols: cols.join(', '),
		values: Object.values(dataToUpdate)
	};
}

module.exports = { sqlForPartialUpdate };
