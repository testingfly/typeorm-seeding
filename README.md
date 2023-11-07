# TypeORM Database Seeding Guide

Seeding your database is a crucial step in the application development process. It not only simplifies prototyping but also eases the transition to a production environment. Whether you're in the early stages of ideation or have a fully-fledged application, database seeding can be a game-changer. In this guide, we will walk you through how to seed your database using TypeORM and TypeORM Seeding, focusing on creating random data and establishing relationships.

**Published on:** October 19, 2022

**Estimated Reading Time:** 6 minutes

## Table of Contents
- [TypeORM Database Seeding Guide](#typeorm-database-seeding-guide)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Setting Up the Project](#setting-up-the-project)
    - [Project Structure](#project-structure)
    - [Installing Dependencies](#installing-dependencies)
    - [Configuring Your Project](#configuring-your-project)
  - [Understanding Factories](#understanding-factories)
  - [Creating a Seeder](#creating-a-seeder)
  - [Seeding the Database](#seeding-the-database)
  - [Usage](#usage)
  - [License](#license)

## Introduction

Seeding your database is an essential step in the application development process. It not only facilitates prototyping but also streamlines the transition to a production environment. Whether you're in the early stages of ideation or have a fully-fledged application, database seeding can be a game-changer. In this tutorial, we'll walk you through how to seed your database using TypeORM and TypeORM Seeding, focusing on creating random data and establishing relationships.

## Setting Up the Project

### Project Structure

A well-organized project structure is essential for efficient development and maintenance. To set up your project for TypeORM Seeding, consider a structure like this:

```
my-project/
|-- src/
|   |-- db/
|   |   |-- entities/
|   |   |   |-- user.ts
|   |   |   |-- post.ts
|   |   |-- seeding/
|   |   |   |-- factories/
|   |   |   |   |-- user.factory.ts
|   |   |   |   |-- post.factory.ts
|   |   |   |-- seeds/
|   |   |   |   |-- initialSeed.ts
|   |   |-- dev.db
|   |-- seed.ts
|-- tsconfig.json
|-- package.json
```

- **src:** This directory contains your application's source code. The db folder inside src is where you define your database entities and the database seeding-related code.

- **db/entities:** Here, you define your TypeORM entities like User and Post. These entities represent your database tables and define their properties and relationships.

- **db/seeding:** This is where you organize your database seeding code.

  - **factories:** In the factories directory, you define factories for generating random data for your entities. For each entity, create a corresponding factory file.

  - **seeds:** The seeds directory is where you define the seeders responsible for populating your database with data.

- **package.json:** The package.json file is where you manage your project's dependencies and scripts.

### Installing Dependencies

To start setting up your project, you need to install the necessary dependencies. As mentioned earlier, you will require two crucial packages: `typeorm-seeding` and `faker`. Here's how to install them:

```bash
npm i typeorm-extension @faker-js/faker typeorm reflect-metadata sqlite
```

### Configuring Your Project

After setting up the directory structure and installing the required dependencies, it's crucial to configure your project properly. Key configuration steps include:

1. Defining your entities in the `db/entities` directory.

2. Creating factories for your entities in the `db/seeding/factories` directory.

3. Defining seeders in the `db/seeding/seeds` directory.

4. Creating a script in your `package.json` to execute the database seeding process.

With these project setup steps, you're well on your way to efficiently seeding your database using TypeORM Seeding. A well-structured project and the right dependencies are the foundation for creating a robust and testable database seeding process, ultimately leading to a more robust and production-ready application.

## Understanding Factories

Before we dive into seeding, let's understand the concept of factories. Factories are essential for generating data to populate your application. For each entity in your application, you define a factory. Each factory is responsible for generating data corresponding to the properties of the entity.

For instance, if you have the following entities:

```typescript
// @/src/db/entities/user.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { Post } from "./post";
 
@Entity()
export class User {
  @PrimaryGeneratedColumn()
    id?: string;
 
  @Column()
    userName?: string;
 
  @OneToMany(() => Post, (post) => post.author)
    posts?: Post[];
}

// @/src/db/entities/post.ts
import typeorm, {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user";
 
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
    id?: string;
 
  @Column()
    title!: string;
 
  @Column()
    content!: string;
 
  @ManyToOne(() => User, (user) => user.posts)
    author!: typeorm.Relation<User>;
}
```

For the User entity, you might define a factory like this:

```typescript
// @/src/db/seeding/factories/user.factory.ts
import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { User } from "../../entities/user";
 
export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.userName = faker.internet.userName();
  return user;
});
```

And for the Post entity:

```typescript
// @/src/db/seeding/factories/post.factory.ts
import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { Post } from "../../entities/post";
 
export const PostsFactory = setSeederFactory(Post, (faker: Faker) => {
  const post = new Post();
  post.title = faker.lorem.sentence();
  post.content = faker.lorem.sentence();
  return post;
});
```

With these factories defined, you can generate random data for your entities.

## Creating a Seeder

Now, let's create a seeder, which is responsible for executing the database seeding. The seeder class name should match the name of the seed class (not the filename). Here's a basic structure for a seeder:

```typescript
// @/src/db/seeding/seeds/initialSeed.ts
import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { User } from "../../entities/user";
import { Post } from "../../entities/post";
import { faker } from '@faker-js/faker';
 
export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const postsRepository = dataSource.getRepository(Post);
 
    const userFactory = factoryManager.get(User);
    const posts

Factory = factoryManager.get(Post);
 
    const users = await userFactory.saveMany(10);
 
    const posts = await Promise.all(
      Array(17)
        .fill("")
        .map(async () => {
          const made = await postsFactory.make({
            author: faker.helpers.arrayElement(users),
          });
          return made;
        }),
    );
    await postsRepository.save(posts);
  }
}
```

## Seeding the Database

Now, let's seed the database. First, create users and specify how many you want to insert:

```typescript
// @/src/seed.ts
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
 
dataSource.initialize().then async () {
  await dataSource.synchronize(true);
  await runSeeders(dataSource);
  process.exit();
});
```

## Usage

To seed your database, execute the following command:

```bash
npm run seed
```

And that's it! Your database is now populated with random data. This is a powerful way to test your application and ensure it's ready for production.

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to contribute, report issues, or suggest improvements to this database seeding guide. Happy coding!