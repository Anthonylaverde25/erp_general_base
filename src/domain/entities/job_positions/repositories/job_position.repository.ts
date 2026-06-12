import { JobPositionEntity } from '../JobPositionEntity';

export interface IJobPositionRepository {
	index(departmentId?: number | null): Promise<JobPositionEntity[]>;
}
