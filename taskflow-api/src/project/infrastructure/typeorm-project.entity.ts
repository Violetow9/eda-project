import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity()
export class TypeOrmProject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  projectName: string;
}
