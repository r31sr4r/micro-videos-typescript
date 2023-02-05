import { migrator } from '@fc/micro-videos/@seedwork/infra';
import { getConnectionToken } from '@nestjs/sequelize';
import { Test, TestingModule } from '@nestjs/testing';
import { Umzug } from 'umzug';
import { MigrationModule } from '../src/database/migration/migration.module';

describe('Migration e2e test', () => {
    let umzug: Umzug;
    const totalMigration = 1;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [MigrationModule],
        }).compile();

        const sequelize = moduleFixture.get(getConnectionToken());

        umzug = migrator(sequelize, { logger: undefined });
    });

    test('up command', async () => {
        await umzug.down({ to: 0 as any });
        const result = await umzug.up();
        expect(result).toHaveLength(totalMigration);
    });

    test('down command', async () => {
        await umzug.up();
        const result = await umzug.down({ to: 0 as any });
        expect(result).toHaveLength(totalMigration);
    });
});
