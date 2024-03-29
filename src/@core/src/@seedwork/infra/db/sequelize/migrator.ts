import { join } from 'path';
import { Sequelize } from 'sequelize';
import { SequelizeStorage, Umzug, UmzugOptions } from 'umzug';

export const migrator = (
	sequelize: Sequelize,
	options?: Partial<UmzugOptions>
) =>
	new Umzug({
		migrations: {
			glob: [
				'*/infra/db/sequelize/migrations/*.{js,ts}',
				{
					cwd: join(__dirname, '../../../..'),
					ignore: ['**/*.d.ts', '**/index.ts', '**/index.js'],
				},
			],
		},
		context: sequelize,
		storage: new SequelizeStorage({ sequelize }),
		logger: console,
		...(options || {}),
	});
