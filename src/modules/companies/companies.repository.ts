import { Injectable } from '@nestjs/common';
import {
  ICompaniesRepository,
  CreateCompanyInput,
  UpdateCompanyInput,
  Company,
  CompanyWithJobCount,
} from './interfaces/companies.repository.interface';
import {
  createCompany,
  getCompanyById,
  getCompanyByUserId,
  updateCompany,
} from '../../generated/prisma/sql';
import { PrismaService } from '../../prisma/prisma.service';
import { nullableParam } from 'src/common/utils/typed-sql.util';

@Injectable()
export class CompaniesRepository implements ICompaniesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCompanyInput): Promise<Company> {
    const [company] = await this.prisma.$queryRawTyped(
      createCompany(
        BigInt(data.userId),
        data.name,
        nullableParam(data.description),
        nullableParam(data.website),
      ),
    );

    if (!company) {
      throw new Error('Failed to create company');
    }

    return {
      id: company.id.toString(),
      userId: company.userId.toString(),
      name: company.name,
      description: company.description,
      logoUrl: company.logoUrl,
      website: company.website,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  async findById(id: string): Promise<CompanyWithJobCount | null> {
    const [company] = await this.prisma.$queryRawTyped(
      getCompanyById(BigInt(id)),
    );
    if (!company) return null;

    return {
      id: company.id.toString(),
      userId: company.userId.toString(),
      name: company.name,
      description: company.description,
      logoUrl: company.logoUrl,
      website: company.website,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      jobCount: Number(company.jobCount ?? 0),
    };
  }

  async findByUserId(userId: string): Promise<Company | null> {
    const [company] = await this.prisma.$queryRawTyped(
      getCompanyByUserId(BigInt(userId)),
    );
    if (!company) return null;

    return {
      id: company.id.toString(),
      userId: company.userId.toString(),
      name: company.name,
      description: company.description,
      logoUrl: company.logoUrl,
      website: company.website,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }

  async updateById(id: string, data: UpdateCompanyInput): Promise<Company> {
    const [company] = await this.prisma.$queryRawTyped(
      updateCompany(
        BigInt(id),
        nullableParam(data.name),
        nullableParam(data.description),
        nullableParam(data.website),
      ),
    );

    if (!company) {
      throw new Error('Failed to update company');
    }

    return {
      id: company.id.toString(),
      userId: company.userId.toString(),
      name: company.name,
      description: company.description,
      logoUrl: company.logoUrl,
      website: company.website,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    };
  }
}
