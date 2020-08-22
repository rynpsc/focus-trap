import pkg from './package.json';

export default {
    input: 'src/index.js',
    output: [
		{
			format: 'es',
			sourcemap: true,
			file: pkg.module,
		},
		{
			format: 'cjs',
			sourcemap: true,
			file: pkg.main,
		},
	],
};
