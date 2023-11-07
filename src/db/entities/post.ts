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