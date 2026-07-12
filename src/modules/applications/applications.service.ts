import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ApplicationStatus } from '../../generated/prisma';
import {
  IApplicationsRepository,
  Application,
  CreatedApplication,
} from './interfaces/applications.repository.interface';
import {
  IApplicationsService,
  ListApplicationsDto,
  ApplicationListResult,
  CompanyApplicationListResult,
} from './interfaces/applications.service.interface';
import { ICompaniesService } from '../companies/interfaces/companies.service.interface';
import { IStorageService } from '../storage/interfaces/storage.service.interface';

@Injectable()
export class ApplicationsService implements IApplicationsService {
  constructor(
    @Inject(IApplicationsRepository)
    private readonly applicationsRepository: IApplicationsRepository,
    @Inject(ICompaniesService)
    private readonly companiesService: ICompaniesService,
    @Inject(IStorageService)
    private readonly storageService: IStorageService,
  ) {}

  async apply(
    userId: string,
    jobId: string,
    file: Express.Multer.File,
  ): Promise<CreatedApplication> {
    const companyId = await this.applicationsRepository.getJobCompanyId(jobId);
    if (!companyId) {
      throw new NotFoundException({
        code: 'job.not_found',
        message: 'Job not found',
      });
    }

    const ext = file.originalname.split('.').pop();
    const key = `resumes/${userId}_${Date.now()}.${ext}`;
    await this.storageService.upload(key, file.buffer, file.mimetype);

    let application: CreatedApplication;
    try {
      application = await this.applicationsRepository.create({
        jobId,
        userId,
        resumeUrl: key,
      });
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        'code' in err &&
        (err as { code: unknown }).code === 'P2002'
      ) {
        throw new ConflictException({
          code: 'application.already_applied',
          message: 'Already applied',
        });
      }
      throw err;
    }

    const url = await this.storageService.getPresignedUrl(key);
    return { ...application, resumeUrl: url };
  }

  async listMine(
    userId: string,
    query: ListApplicationsDto,
  ): Promise<ApplicationListResult> {
    const [data, total] = await Promise.all([
      this.applicationsRepository.listByUserId(userId, query),
      this.applicationsRepository.countByUserId(userId, query),
    ]);

    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async listForJob(
    jobId: string,
    userId: string,
    query: ListApplicationsDto,
  ): Promise<CompanyApplicationListResult> {
    await this.assertJobOwnership(jobId, userId);

    const [data, total] = await Promise.all([
      this.applicationsRepository.listByJobId(jobId, query),
      this.applicationsRepository.countByJobId(jobId, query),
    ]);

    return { data, meta: { page: query.page, limit: query.limit, total } };
  }

  async updateStatus(
    id: string,
    userId: string,
    status: ApplicationStatus,
  ): Promise<Application> {
    const application = await this.applicationsRepository.findById(id);
    if (!application) {
      throw new NotFoundException({
        code: 'application.not_found',
        message: 'Application not found',
      });
    }

    await this.assertJobOwnership(application.jobId, userId);

    const updated = await this.applicationsRepository.updateStatus(id, status);

    // TODO: emit application.status_updated once NotificationsModule
    // exists, so the applicant gets an application_update notification.

    return updated;
  }

  private async assertJobOwnership(
    jobId: string,
    userId: string,
  ): Promise<void> {
    const companyId = await this.applicationsRepository.getJobCompanyId(jobId);
    if (!companyId) {
      throw new NotFoundException({
        code: 'job.not_found',
        message: 'Job not found',
      });
    }

    const company = await this.companiesService.findById(companyId);
    if (!company) {
      throw new NotFoundException({
        code: 'company.not_found',
        message: 'Company not found',
      });
    }

    if (company.userId !== userId) {
      throw new ForbiddenException({
        code: 'application.forbidden',
        message: 'Forbidden',
      });
    }
  }
}
