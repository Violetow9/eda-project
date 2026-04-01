import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TypeOrmTask {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    status: string;

    @Column()
    @Index()
    projectId: number;

    @Column({ nullable: true, type: 'varchar' })
    assigneeUserId: string | null;
}
