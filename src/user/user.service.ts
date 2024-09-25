import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { MyLogs } from '../my_logs/my_logs.entity';
import { getUserDto } from '../dto/get-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository:Repository<User>,
        @InjectRepository(MyLogs) private readonly logsRepository:Repository<MyLogs>,

    ) {}

    getUser(querys:getUserDto): any {
        console.log("🚀 ~ UserService ~ getUser ~ query:", querys)
        // select * from user u, profile p, roles r where this.update.id = p.id and this.update.id = r.id limit 10 offset 0
        const {limit, page, gender, username, role} = querys
        return this.userRepository.find({
            select: {
                id: true,
                username: true,
                profile: {
                    gender: true
                },
                roles: {
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
            skip: ((page || 1) - 1) * limit ,
            take: limit || 10
        })
        
    }

    findAll() {
        return this.userRepository.find()
    }
    find(username: string) {
        return this.userRepository.findOne({where: {username}})
    }
    findOne(id: number) {
        return this.userRepository.findOne({where: {id}})
    }
    async create(user: User) {
        const userTmp: User = await this.userRepository.create(user)
        console.log(userTmp);
        
        return this.userRepository.save(userTmp)
    }
    async update(id: number, user: Partial<User>) {
        return this.userRepository.update(id, user)
    }
    remove(id: number) {
        return this.userRepository.delete(id)
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
                user
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
