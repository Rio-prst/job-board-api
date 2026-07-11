import {
  Injectable,
  Inject,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { ICompaniesService } from './interfaces/companies.service.interface';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ICompaniesRepository } from './interfaces/companies.repository.interface';

@Injectable()
export class CompaniesService implements ICompaniesService {
  constructor(
    @Inject(ICompaniesRepository)
    private readonly companiesRepository: ICompaniesRepository,
  ) {}

  async create(userId: string, dto: CreateCompanyDto) {
    const existing = await this.companiesRepository.findByUserId(userId);
    if (existing) {
      throw new ConflictException({
        code: 'company.already_exists',
        message: 'Company already exists',
      });
    }

    return this.companiesRepository.create({ userId, ...dto });
  }

  async findById(id: string) {
    const company = await this.companiesRepository.findById(id);
    if (!company) {
      throw new NotFoundException({
        code: 'company.not_found',
        message: 'Company not found',
      });
    }

    return company;
  }

  async updateById(id: string, userId: string, dto: UpdateCompanyDto) {
    const company = await this.companiesRepository.findById(id);
    if (!company) {
      throw new NotFoundException({
        code: 'company.not_found',
        message: 'Company not found',
      });
    }

    if (company.userId !== userId) {
      throw new ForbiddenException({
        code: 'company.forbidden',
        message: 'Forbidden',
      });
    }

    return this.companiesRepository.updateById(id, dto);
  }
}
