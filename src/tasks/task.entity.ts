import { TaskStatus } from 'src/tasks/task.model';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: 'OPEN',
  })
  status: TaskStatus;
}
