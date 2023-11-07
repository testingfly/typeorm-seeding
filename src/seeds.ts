import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { runSeeders, SeederOptions } from "typeorm-extension";
import { User } from "./db/entities/user";
import { Post } from "./db/entities/post";
import { UsersFactory } from "./db/seeding/factories/user.factory";
import { PostsFactory } from "./db/seeding/factories/post.factory";
import { MainSeeder } from "./db/seeding/seeds/initialSeed";

const options: DataSourceOptions & SeederOptions = {
  type: "sqlite", // Use SQLite instead of MySQL
  database: "src/db/dev.db", // SQLite database file path

  entities: [User, Post],

  // Additional config options brought by typeorm-extension
  factories: [UsersFactory, PostsFactory],
  seeds: [MainSeeder],
};

const dataSource = new DataSource(options);

dataSource.initialize().then(async () => {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
