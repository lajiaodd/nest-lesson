import { Exclude } from 'class-transformer';
import { MyLogs } from 'src/my_logs/my_logs.entity';
import { Profile } from 'src/profile/profile.entity';
import { Roles } from 'src/roles/roles.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany, ManyToMany, JoinTable, AfterInsert, AfterUpdate, AfterRemove } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  username: string;

  @Exclude()
  @Column()
  password: string;

  @OneToOne(() => Profile, profile => profile.user, {cascade: true})
  profile: Profile

  @OneToMany(() => MyLogs, (my_logs) => my_logs.user)
  my_logs: MyLogs[]

  @ManyToMany(() => Roles, (roles) => roles.user)
  @JoinTable({name: 'user_roles'})
  roles: Roles[]

  @AfterInsert()
  afterInster() {
      console.log('afterInster');
      //console.log(this); //User { username: 'xiaoming', password: '890', id: 19 }
      
  }

  @AfterRemove()
  afterUpdate() {
      console.log('AfterRemove');
      
  }
}