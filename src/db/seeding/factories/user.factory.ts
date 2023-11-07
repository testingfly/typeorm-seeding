import { Faker } from "@faker-js/faker";
import { setSeederFactory } from "typeorm-extension";
import { User } from "../../entities/user";

export const UsersFactory = setSeederFactory(User, (faker: Faker) => {
  const user = new User();
  user.userName = faker.internet.userName();
  return user;
});