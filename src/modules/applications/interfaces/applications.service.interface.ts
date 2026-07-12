import { ApplicationStatus } from '../../../generated/prisma';
import {
  Application,
  ApplicationListItem,
  ApplicationForCompany,
  CreatedApplication,
} from './applications.repository.interface';

export interface ListApplicationsDto {
  status?: ApplicationStatus;
  page: number;
  limit: number;
}

export interface ApplicationListResult {
  data: ApplicationListItem[];
  meta: { page: number; limit: number; total: number };
}

export interface CompanyApplicationListResult {
  data: ApplicationForCompany[];
  meta: { page: number; limit: number; total: number };
}

export const IApplicationsService = Symbol('IApplicationsService');

export interface IApplicationsService {
  apply(
    userId: string,
    jobId: string,
    file: Express.Multer.File,
  ): Promise<CreatedApplication>;
  listMine(
    userId: string,
    query: ListApplicationsDto,
  ): Promise<ApplicationListResult>;
  listForJob(
    jobId: string,
    userId: string,
    query: ListApplicationsDto,
  ): Promise<CompanyApplicationListResult>;
  updateStatus(
    id: string,
    userId: string,
    status: ApplicationStatus,
  ): Promise<Application>;
}
