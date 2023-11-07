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