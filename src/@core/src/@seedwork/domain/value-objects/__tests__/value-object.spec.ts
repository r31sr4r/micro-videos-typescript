import ValueObject from '../value-object';

class StubValueObject extends ValueObject {}

describe('ValueObject Unit Tests', () => {
	it('should set value', () => {
		let vo = new StubValueObject('string value');
		expect(vo.value).toBe('string value');

		vo = new StubValueObject({ prop1: 'value1' });
		expect(vo.value).toStrictEqual({ prop1: 'value1' });
	});

	describe('should convert to a string', () => {
		const date = new Date();
		let arrange = [
			{ received: '', expected: '' },
			{ received: 'fake test', expected: 'fake test' },
			{ received: 0, expected: '0' },
			{ received: 1, expected: '1' },
			{ received: 5, expected: '5' },
			{ received: true, expected: 'true' },
			{ received: false, expected: 'false' },
			{ received: date, expected: date.toString() },
			{
				received: { prop1: 'value1' },
				expected: JSON.stringify({ prop1: 'value1' }),
			},
		];

		test.each(arrange)(
			'should convert $received to $expected',
			({ received, expected }) => {
				let vo = new StubValueObject(received);
				expect(vo.toString()).toBe(expected);
			}
		);
	});

	it('should be a imutable object', () => {
		const obj = {
			prop1: 'value1',
			deep: { prop2: 'value2', prop3: new Date() },
		};

		const vo = new StubValueObject(obj);

		expect(() => {
			(vo as any).value.prop1 = 'value2';
		}).toThrow(
			new Error(
				"Cannot assign to read only property 'prop1' of object '#<Object>'"
			)
		);

		expect(() => {
			(vo as any).value.deep.prop2 = 'value2';
		}).toThrow(
			new Error(
				"Cannot assign to read only property 'prop2' of object '#<Object>'"
			)
		);

		expect(vo.value.deep.prop3).toBeInstanceOf(Date);
	});

	describe('should compare two value objects and return true if equal', () => {
		const arrange = [
			{ received: '', expected: '' },
			{ received: 'fake test', expected: 'fake test' },
			{ received: 0, expected: 0 },
			{ received: 1, expected: 1 },
			{ received: 5, expected: 5 },
			{ received: true, expected: true },
			{ received: false, expected: false },
		];

		test.each(arrange)(
			'should compare $received to $expected',
			({ received, expected }) => {
				const vo1 = new StubValueObject(received);
				const vo2 = new StubValueObject(expected);

				expect(vo1.equals(vo2)).toBeTruthy();
			}
		);			
	});

	describe('should compare two value objects and return false if not equal', () => {
		const arrange = [
			{ received: '', expected: ' ' },
			{ received: 'fake test', expected: 'fake test 2' },
			{ received: 0, expected: 1 },
			{ received: 1, expected: 2 },
			{ received: 5, expected: 6 },
			{ received: true, expected: false },
			{ received: false, expected: true },
		];

		test.each(arrange)(
			'should compare $received to $expected',
			({ received, expected }) => {
				const vo1 = new StubValueObject(received);
				const vo2 = new StubValueObject(expected);

				expect(vo1.equals(vo2)).toBeFalsy();
			}
		);
	});
});
