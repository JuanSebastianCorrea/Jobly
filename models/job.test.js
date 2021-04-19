'use strict';

const db = require('../db.js');
const { BadRequestError, NotFoundError } = require('../expressError');
const Job = require('./job.js');
const { commonBeforeAll, commonBeforeEach, commonAfterEach, commonAfterAll, testJobIds } = require('./_testCommon');

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe('create', function() {
	const newJob = {
		title: 'newJobTitle',
		salary: 333333,
		equity: '0.5',
		companyHandle: 'c1'
	};

	test('works', async function() {
		let job = await Job.create(newJob);
		expect(job).toEqual({ ...newJob, id: expect.any(Number) });
	});
});

/************************************** findAll*/
describe('findAll', function() {
	test('works: no filter', async function() {
		let jobs = await Job.findAll();
		expect(jobs).toEqual([
			{
				id: testJobIds[0],
				title: 'Job1',
				salary: 100,
				equity: '0.1',
				companyHandle: 'c1',
				companyName: 'C1'
			},
			{
				id: testJobIds[1],
				title: 'Job2',
				salary: 200,
				equity: '0.2',
				companyHandle: 'c1',
				companyName: 'C1'
			},
			{
				id: testJobIds[2],
				title: 'Job3',
				salary: 300,
				equity: '0',
				companyHandle: 'c1',
				companyName: 'C1'
			},
			{
				id: testJobIds[3],
				title: 'Job4',
				salary: null,
				equity: null,
				companyHandle: 'c1',
				companyName: 'C1'
			}
		]);
	});

	test('works: filter by minSalary', async function() {
		let jobs = await Job.findAll({ minSalary: 200 });
		expect(jobs).toEqual([
			{
				id: testJobIds[1],
				title: 'Job2',
				salary: 200,
				equity: '0.2',
				companyHandle: 'c1',
				companyName: 'C1'
			},
			{
				id: testJobIds[2],
				title: 'Job3',
				salary: 300,
				equity: '0',
				companyHandle: 'c1',
				companyName: 'C1'
			}
		]);
	});

	test('works: filter by hasEquity', async function() {
		let jobs = await Job.findAll({ hasEquity: true });
		expect(jobs).toEqual([
			{
				id: testJobIds[0],
				title: 'Job1',
				salary: 100,
				equity: '0.1',
				companyHandle: 'c1',
				companyName: 'C1'
			},
			{
				id: testJobIds[1],
				title: 'Job2',
				salary: 200,
				equity: '0.2',
				companyHandle: 'c1',
				companyName: 'C1'
			}
		]);
	});

	test('works: filter by minSalary and hasEquity', async function() {
		let jobs = await Job.findAll({ minSalary: 100, hasEquity: true });
		expect(jobs).toEqual([
			{
				id: testJobIds[0],
				title: 'Job1',
				salary: 100,
				equity: '0.1',
				companyHandle: 'c1',
				companyName: 'C1'
			},
			{
				id: testJobIds[1],
				title: 'Job2',
				salary: 200,
				equity: '0.2',
				companyHandle: 'c1',
				companyName: 'C1'
			}
		]);
	});

	test('works: filter by title', async function() {
		let jobs = await Job.findAll({ titleLike: 'ob1' });
		expect(jobs).toEqual([
			{
				id: testJobIds[0],
				title: 'Job1',
				salary: 100,
				equity: '0.1',
				companyHandle: 'c1',
				companyName: 'C1'
			}
		]);
	});
});

/************************************** get */

describe('get', function() {
	test('works', async function() {
		let job = await Job.get(testJobIds[0]);
		expect(job).toEqual({
			id: testJobIds[0],
			title: 'Job1',
			salary: 100,
			equity: '0.1',
			company: { handle: 'c1', name: 'C1', numEmployees: 1, description: 'Desc1', logoUrl: 'http://c1.img' }
		});
	});

	test('not found if no such job', async function() {
		try {
			await Job.get(0);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});

/************************************** update */

describe('update', function() {
	const updateData = {
		title: 'Jobb1',
		salary: 111,
		equity: '0.9'
	};

	test('works', async function() {
		let job = await Job.update(testJobIds[0], updateData);
		expect(job).toEqual({
			id: testJobIds[0],
			companyHandle: 'c1',
			...updateData
		});
	});

	test('not found if no such job', async function() {
		try {
			await Job.update(0, {
				title: 'test'
			});
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});

	test('bad request with no data', async function() {
		try {
			await Job.update(testJobIds[0], {});
			fail();
		} catch (err) {
			expect(err instanceof BadRequestError).toBeTruthy();
		}
	});
});

/************************************** remove */

describe('remove', function() {
	test('works', async function() {
		await Job.remove(testJobIds[0]);
		const res = await db.query('SELECT id FROM jobs WHERE id=$1', [ testJobIds[0] ]);
		expect(res.rows.length).toEqual(0);
	});

	test('not found if no such job', async function() {
		try {
			await Job.remove(0);
			fail();
		} catch (err) {
			expect(err instanceof NotFoundError).toBeTruthy();
		}
	});
});
