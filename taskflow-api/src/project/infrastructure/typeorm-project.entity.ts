import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TypeOrmProject {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Index()
    projectName: string;

    @Column('simple-array', { default: '' })
    members: string[];
}
