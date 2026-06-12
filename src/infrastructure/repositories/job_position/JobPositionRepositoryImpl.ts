import { injectable } from 'inversify';
import { IJobPositionRepository } from '@/domain/entities/job_positions/repositories/job_position.repository';
import { JobPositionEntity } from '@/domain/entities/job_positions/JobPositionEntity';
import axiosInstance from '@/lib/@axios';

@injectable()
export class JobPositionRepositoryImpl implements IJobPositionRepository {
	private readonly baseUrl = 'job-positions';

	async index(departmentId?: number | null): Promise<JobPositionEntity[]> {
		const {
			data: { job_positions }
		} = await axiosInstance.get(this.baseUrl, {
			params: departmentId ? { department_id: departmentId } : {}
		});
		return job_positions;
	}
}
