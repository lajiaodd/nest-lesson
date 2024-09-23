import { MyLogs } from 'src/my_logs/my_logs.entity';
import { Profile } from 'src/profile/profile.entity';
import { Roles } from 'src/roles/roles.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile

  @OneToMany(() => MyLogs, (my_logs) => my_logs.user)
  my_logs: MyLogs[]

  @ManyToMany(() => Roles, (roles) => roles.user)
  @JoinTable({name: 'user_roles'})
  roles: Roles[]
}