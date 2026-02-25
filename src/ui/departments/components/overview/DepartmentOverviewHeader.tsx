import { Avatar, Box, Typography } from '@mui/material';
import { DepartmentOverviewModel } from './types';

interface DepartmentOverviewHeaderProps {
	department: DepartmentOverviewModel;
}

export default function DepartmentOverviewHeader({ department }: DepartmentOverviewHeaderProps) {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				alignItems: 'flex-start',
				mb: 3
			}}
		>
			<Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
					<Typography
						variant="h4"
						fontWeight={800}
						sx={{ letterSpacing: '-0.02em' }}
					>
						{department.name}
					</Typography>

					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							ml: 1,
							px: 1.5,
							py: 0.5,
							bgcolor: 'action.hover',
							borderRadius: 2
						}}
					>
						<Avatar
							sx={{
								width: 24,
								height: 24,
								fontSize: '0.75rem',
								bgcolor: 'primary.main',
								fontWeight: 700
							}}
						>
							{department.manager.initials}
						</Avatar>
						<Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
							<Typography
								variant="caption"
								fontWeight={600}
								color="text.secondary"
							>
								Manager:
							</Typography>
							<Typography
								variant="body2"
								fontWeight={700}
							>
								{department.manager.name}
							</Typography>
						</Box>
					</Box>
				</Box>
				<Typography
					variant="body2"
					color="text.secondary"
				>
					{department.code} • {department.description}
				</Typography>
			</Box>
		</Box>
	);
}
