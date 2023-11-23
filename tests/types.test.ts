import { parseCrochetPattern } from '$lib/types';

describe('parseCrochetPattern', () => {
	test('should parse "24 sc" correctly', () => {
		const result = parseCrochetPattern('24 sc');
		expect(result.total_stitches).toBe(24);
		expect(result.rows[0].length).toBe(24);

		expect(result.rows[0][0].key).toBe('sc');
		expect(result.rows[0][0].num_stitches).toBe(1);
	});

	test('should parse "[2 sc, inc] x 6" correctly', () => {
		const result = parseCrochetPattern('[2 sc, inc] x 6');
		expect(result.total_stitches).toBe(24);
		expect(result.rows.length).toBe(6);

		expect(result.rows[0][0].key).toBe('sc');
		expect(result.rows[0][0].num_stitches).toBe(1);

		expect(result.rows[0][1].key).toBe('sc');

		expect(result.rows[0][2].key).toBe('inc');
		expect(result.rows[0][2].num_stitches).toBe(2);
	});

	test('should parse "6 inc" correctly', () => {
		const result = parseCrochetPattern('6 inc');
		expect(result.total_stitches).toBe(12);
		expect(result.rows[0].length).toBe(6);
	});

	test('should parse "[sc, dec] x 8" correctly', () => {
		const result = parseCrochetPattern('[sc, dec] x 8');
		expect(result.total_stitches).toBe(16);
		expect(result.rows.length).toBe(8);
	});
});
