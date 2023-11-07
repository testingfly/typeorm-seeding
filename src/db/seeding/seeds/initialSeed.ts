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
    const postsFactory = factoryManager.get(Post);

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