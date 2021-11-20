import pkg from './package.json';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

let output = [{
	format: 'es',
	file: pkg.module,
	sourcemap: true,
}];

if (process.env.BUILD === 'production') {
	output = [ ...output, ...[
		{
			format: 'cjs',
			file: pkg.main,
			sourcemap: true,
		},

		{
			format: 'umd',
			file: pkg.unpkg,
			name: 'FocusTrap',
			sourcemap: true,
			plugins: [ terser() ],
		},
	]];
}

export default {
	input: 'src/index.ts',
	output: output,
	plugins: [
		typescript({
			declaration: false,
			declarationDir: null,
		}),
	],
};
