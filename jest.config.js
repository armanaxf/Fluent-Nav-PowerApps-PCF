module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '^scheduler$': '<rootDir>/node_modules/scheduler',
    },
    moduleDirectories: ['node_modules', 'src'],
    transformIgnorePatterns: [
        '/node_modules/(?!(@fluentui|@griffel|@vanilla-extract|react-context-selector))'
    ],
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': ['ts-jest', {
            tsconfig: 'tsconfig.json',
            isolatedModules: true,
        }],
    },
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
