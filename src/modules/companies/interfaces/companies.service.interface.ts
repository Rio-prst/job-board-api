import { CreateCompanyDto } from '../dto/create-company.dto';
import { UpdateCompanyDto } from '../dto/update-company.dto';
import { Company, CompanyWithJobCount } from './companies.repository.interface';

export const ICompaniesService = Symbol('ICompaniesService');

export interface ICompaniesService {
  create(userId: string, dto: CreateCompanyDto): Promise<Company>;
  findById(id: string): Promise<CompanyWithJobCount | null>;
  updateById(id: string, userId: string, dto: UpdateCompanyDto): Promise<Company>;
}
