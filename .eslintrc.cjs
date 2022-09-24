/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	extends: [
		'plugin:vue/vue3-essential',
		'eslint:recommended',
		'@vue/eslint-config-typescript',
		'@vue/eslint-config-prettier',
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	plugins: ['vue'],
	rules: {
		'comma-dangle': [
			'error',
			{
				arrays: 'only-multiline',
				objects: 'always-multiline',
				imports: 'always-multiline',
			},
		],
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-tabs': 'off',
	},
};
