module.exports = {
  env: { browser: true, es2020: true, node: true },
  globals: { window: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:storybook/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', 'import', 'unused-imports', 'no-relative-import-paths', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {},
      node: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
      },
    },
  },
  parserOptions: {
    project: './tsconfig.json',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // prettier 에러
    'prettier/prettier': 'error',
    // JSX 안에서 HTML 엔티티(escape sequence)를 사용하면 에러
    'react/no-unescaped-entities': [
      'error',
      {
        forbid: [
          {
            char: '>',
            alternatives: ['&gt;'],
          },
          {
            char: '}',
            alternatives: ['&#125;'],
          },
        ],
      },
    ],
    // JSX 안에서 {''} 이런식으로 사용하면 에러
    'react/jsx-curly-brace-presence': 'error',
    // prop types 를 강제하는 규칙
    'react/prop-types': 'off',
    // JSX 존재한다면 React를 import하도록 강제하는 규칙
    'react/react-in-jsx-scope': 'off',
    // 무의미한 Fragment 를 막는 규칙 <>{foo}</> 이건 가능
    'react/jsx-no-useless-fragment': ['off', { allowExpressions: true }],
    // JSX 네이밍 규칙 강제
    'react/jsx-pascal-case': [
      'error',
      {
        allowAllCaps: false,
        allowNamespace: true,
        allowLeadingUnderscore: false,
      },
    ],
    // JSX props 불필요한 스페이싱을 막는 규칙
    'react/jsx-props-no-multi-spaces': 'error',
    // jsx를 사용했는데 확장자가 .jsx가 아니면 에러를 내는 규칙
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx', '.jsx'] }],
    // 셀프 클로징 가능한 상태일 때 셀프 클로징을 강제하는 규칙
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    // JSX Props 정렬하는 규칙
    'react/jsx-sort-props': [
      'error',
      {
        callbacksLast: true,
        shorthandFirst: true,
        noSortAlphabetically: true,
        multiline: 'last',
        reservedFirst: ['key'],
      },
    ],
    'no-unused-vars': [
      'error',
      {
        // args prefix _ 사용시 에러 무시
        argsIgnorePattern: '^_',
        args: 'after-used',
        // catch 문 error prefix ignore 사용시 에러 무시
        caughtErrorsIgnorePattern: '^ignore',
        // ..rest 사용시 siblings 사용하지 않아도 에러 무시
        ignoreRestSiblings: true,
      },
    ],
    // 정의되지 않은 변수 사용 방지 규칙
    'no-undef': 'error',
    // 변수 및 함수를 정의 전에 사용할 수 있게 해주는 규칙
    'no-use-before-define': ['error', { variables: false, functions: false }],
    // foo['bar'] 대신 foo.bar 사용 강제 규칙
    'dot-notation': 'error',
    // 한 줄당 글자 제한하는 규칙, 주석 제외
    'max-len': ['error', { code: 100, ignoreComments: true, ignoreStrings: true }],
    // dependencies인 모듈이 devDependencies에 있는 경우 에러 발생시키는 규칙
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    // import 시에 파일의 확장자를 쓰지 않도록 강제하는 규칙
    'import/extensions': ['error', { json: 'always' }],
    'import/no-unresolved': 'error',
    // import 구문 중괄호 사이의 member 모듈 알파벳 순으로 정렬하는 규칙
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    'unused-imports/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    // import 순서
    'import/order': [
      'error',
      {
        warnOnUnassignedImports: true,
        pathGroupsExcludedImportTypes: ['type'],
        groups: [
          // 내장 모듈
          'builtin',
          // npm을 통해 설치된 외부 모듈
          'external',
          // 프로젝트 내부에서 설정한 경로 별칭을 사용하는 모듈
          'internal',
          // 상위 디렉토리에 있는 모듈
          'parent',
          // 같은 디렉토리에 있는 모듈
          'sibling',
          // 같은 디렉토리의 index 파일
          'index',
          // 타입 모듈
          'type',
        ],
        pathGroups: [
          {
            pattern: 'next',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'react',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@tanstack/*',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '{react*,*/react}',
            group: 'external',
            position: 'before',
          },
          {
            pattern: 'lodash-es',
            group: 'external',
            position: 'before',
          },
          {
            pattern: '@/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '**/*.+(css|sass|less|scss|style|svg)',
            patternOptions: { dot: true, nocomment: true },
            group: 'unknown',
            position: 'after',
          },
        ],
        alphabetize: {
          // 알파벳 순서대로 정렬
          order: 'asc',
          // 대소문자 구분 없이 정렬
          caseInsensitive: true,
        },
        // 임포트 그룹 사이 개행 여부
        'newlines-between': 'never',
      },
    ],
    // 같은 폴더인 경우를 제외하고 import 경로는 항상 절대 경로를 사용
    'no-relative-import-paths/no-relative-import-paths': [
      'warn',
      { allowSameFolder: true, rootDir: 'src', prefix: '@' },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        // 빈 함수 사용 금지하는 옵션
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
      },
    },
  ],
};
