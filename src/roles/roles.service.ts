import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles } from './roles.entity';
import { Repository } from 'typeorm';
 
@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private readonly rolesRepository:Repository<Roles>
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const user = await this.rolesRepository.create(createRoleDto)
    return this.rolesRepository.save(user);
  }

  findAll() {
    return this.rolesRepository.find();
  }

  findOne(id: number) {
    return this.rolesRepository.findOne({where: {id}});
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const userTmp =await this.rolesRepository.findOne({where: {id}});
    const newUser = this.rolesRepository.merge(userTmp, updateRoleDto)
    return this.rolesRepository.save(newUser);
  }

  remove(id: number) {
    return this.rolesRepository.delete(id);
  }
}
