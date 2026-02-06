module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/**/*.ts'],
    format: ['progress'],
  },
  postgres: {
    requireModule: ['ts-node/register'],
    require: ['features/step_definitions/**/*.ts'],
    format: ['progress'],
    tags: '@critical',
    worldParameters: { persistence: 'postgres' },
  },
};
