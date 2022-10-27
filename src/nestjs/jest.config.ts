export default {
    displayName: {
        name: 'nestjs',
        color: 'magentaBright',
    },
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: 'src',
    testRegex: '.*\\..*spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': '@swc/jest',
    },
    collectCoverageFrom: ['**/*.(t|j)s'],
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: 'v8',
    coverageDirectory: '../__coverage',
    testEnvironment: 'node',
    moduleNameMapper: {
        '@fc/micro\\-videos/(.*)$':
            '<rootDir>/../../../node_modules/@fc/micro-videos/dist/$1',
        // '#seedwork/domain':
        //     '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/domain/index.js',
        '#seedwork/(.*)$':
            '<rootDir>/../../../node_modules/@fc/micro-videos/dist/@seedwork/$1',
        // '#category/domain':
        //     '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/domain/index.js',
        '#category/(.*)$':
            '<rootDir>/../../../node_modules/@fc/micro-videos/dist/category/$1',
    },
    setupFilesAfterEnv: ['../../@core/src/@seedwork/domain/tests/jest.ts'],
    // An object that configures minimum threshold enforcement for coverage results
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
};
