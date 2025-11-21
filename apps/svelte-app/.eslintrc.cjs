module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:svelte/recommended',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'build'],
	overrides: [
		{
			files: ['*.svelte'],
			parser: 'svelte-eslint-parser',
			parserOptions: {
				parser: {
					ts: '@typescript-eslint/parser',
					js: 'espree',
					typescript: '@typescript-eslint/parser',
				},
			},
		},
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['svelte'],
	rules: {
		'@typescript-eslint/consistent-type-imports': [
			'error',
			{ prefer: 'type-imports', fixStyle: 'inline-type-imports' },
		],
		'sort-imports': [
			'error',
			{
				ignoreCase: false,
				ignoreDeclarationSort: true,
				ignoreMemberSort: false,
				memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
				allowSeparatedGroups: true,
			},
		],
	},
};
