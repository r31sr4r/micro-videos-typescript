import { migrator } from './migrator';
import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
	dialect: 'sqlite',
	host: ':memory:',
	logging: true,
});

migrator(sequelize).runAsCLI();