import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';
import { User } from './user.entity';
import { MyLogs } from '../my_logs/my_logs.entity';
import { getUserDto } from './dto/get-user.dto';
import { conditionUtils } from 'src/untils/db.helper';
import { Roles } from 'src/roles/roles.entity';
import * as argon2 from 'argon2'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        @InjectRepository(MyLogs) private readonly logsRepository:Repository<MyLogs>,
        @InjectRepository(Roles) private readonly rolesRepository:Repository<Roles>,

    ) {}

    getUser(querys:getUserDto): any {
        console.log("🚀 ~ UserService ~ getUser ~ query:", querys)
        // select * from user u, profile p, roles r where this.update.id = p.id and this.update.id = r.id limit 10 offset 0
        const {limit, page, gender, username, role} = querys
        const skip = ((page || 1) - 1) * limit
        const take =  limit || 10
        return this.userRepository.find({
            select: {
                id: true,
                username: true,
                profile: {
                    gender: true
                },
                roles: {
                    id: true,
                    name: true
                }
            },
            relations: {
                profile: true,
                roles: true
            },
            where: {
                username,
                profile: {
                    gender,
                },
                roles: {
                    id: role
                }

            },
            skip: skip ,
            take: take
        })
        
    }

    findAll(querys:getUserDto) {
        const {limit, page, gender, username, role} = querys
        const skip = ((page || 1) - 1) * limit
        const take =  limit || 10
        let selectQueryBuilder:SelectQueryBuilder<User> = this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.profile', 'profile')
            .leftJoinAndSelect('user.roles', 'roles')
            // .where('user.username = :username', {username})
            // .andWhere('profile.gender = :profile.gender', {'profile.gender': gender})
            // .andWhere('roles.id = :roles.id', {'roles.id': role})
        const obj = {
            'user.username': username,
            'profile.gender': gender,
            'roles.id': role,
        }

        selectQueryBuilder = conditionUtils(selectQueryBuilder, obj)
        return selectQueryBuilder.take(take).skip(skip).getMany()
    }
    find(username: string) {
        return this.userRepository.findOne({where: {username}})
    }
    findOne(id: number) {
        return this.userRepository.findOne({where: {id}})
    }
    async create(user: User) {
        if(!user.roles) {
            // 给个默认角色
            const role = await this.rolesRepository.findOne({where: {id: 2}})
            user.roles = [role]
        }

        if(user.roles instanceof Array && typeof user.roles[0] === 'number') {
            // 查询所有的角色
            user.roles = await this.rolesRepository.find({where: {id: In(user.roles)}})
        }

        const userTmp: User = await this.userRepository.create(user)
        userTmp.password = await argon2.hash(user.password)
        console.log(userTmp);
        
        return this.userRepository.save(userTmp)
    }
    async update(id: number, user: Partial<User>) {
        const userTmp = await this.findProfile(id)
        const newUser = this.userRepository.merge(userTmp, user)
        return this.userRepository.save(newUser)
        //联合模型更新使用save方法或者queryBuilder
        // 下面的update方法，只适合单模型更新，不是适合有关系的模型更新
        // return this.userRepository.update(id, user)
    }
    async remove(id: number) {
        // return this.userRepository.delete(id)
        const user: User = await this.findOne(Number(id))
        return this.userRepository.remove(user) // 使用remove才能出发AfterUpdate
    }

    findProfile(id: number) {
        return this.userRepository.findOne({
            where: {id},
            relations: {
                profile: true,
            }
        })
    }

    async findUserLogs(id: number) {
        const user = await this.findOne(id)
        return this.logsRepository.find({
            where: {
                user: user.my_logs
            },
            relations: {
                user: true
            }
        })
    }

    findLogsByGroup(id: number) {
        return (
            // this.logsRepository.query("select * from logs where id = :id", [1])
            this.logsRepository.createQueryBuilder('logs')
            .select('logs.result', 'result')
            .addSelect('COUNT("logs.result")', 'count')
            .leftJoinAndSelect('logs.user', 'user')
            .where('user.id = :id', {id})
            .groupBy('logs.result')
            .orderBy('count', 'DESC')
            .limit(2)
            .getRawMany()
        )
    }
    async getUsers() {
        const res = await this.userRepository.find()
        return {
            code: 0, 
            data: [],
            msg: 'success'
        }
    }
}
