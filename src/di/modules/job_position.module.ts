import { Container } from 'inversify';
import { TYPES } from '../types';
import { IJobPositionRepository } from '@/domain/entities/job_positions/repositories/job_position.repository';
import { JobPositionRepositoryImpl } from '@/infrastructure/repositories/job_position/JobPositionRepositoryImpl';
import { IndexJobPositionsUseCase } from '@/application/use_cases/job_positions/IndexJobPositionsUseCase';

export const registerJobPositionModule = (container: Container) => {
	container.bind<IJobPositionRepository>(TYPES.JobPositionRepository).to(JobPositionRepositoryImpl);
	container.bind<IndexJobPositionsUseCase>(TYPES.IndexJobPositionsUseCase).to(IndexJobPositionsUseCase);
};
