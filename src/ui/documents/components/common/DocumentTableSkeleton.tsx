import { Box, Skeleton, Stack } from '@mui/material';

export default function DocumentTableSkeleton() {
	return (
		<Box sx={{ width: '100%', p: 2 }}>
			{/* Fake Header/Toolbar */}
			<Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
				<Skeleton variant="rectangular" width={320} height={40} sx={{ borderRadius: '8px' }} />
				<Skeleton variant="circular" width={40} height={40} />
				<Box sx={{ flex: 1 }} />
				<Skeleton variant="text" width={150} />
			</Box>

			{/* Table Structure */}
			<Stack spacing={1}>
				{/* Table Header */}
				<Box sx={{ display: 'flex', gap: 2, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
					<Skeleton variant="text" width="20%" height={30} />
					<Skeleton variant="text" width="30%" height={30} />
					<Skeleton variant="text" width="10%" height={30} />
					<Skeleton variant="text" width="15%" height={30} />
					<Skeleton variant="text" width="15%" height={30} />
					<Skeleton variant="text" width="10%" height={30} />
				</Box>

				{/* Table Rows */}
				{[...Array(8)].map((_, i) => (
					<Box 
						key={i} 
						sx={{ 
							display: 'flex', 
							gap: 2, 
							py: 2, 
							borderBottom: '1px solid', 
							borderColor: 'divider',
							alignItems: 'center'
						}}
					>
						<Box sx={{ width: '20%' }}>
							<Skeleton variant="text" width="60%" />
							<Skeleton variant="text" width="40%" height={15} />
						</Box>
						<Box sx={{ width: '30%', display: 'flex', alignItems: 'center', gap: 1 }}>
							<Skeleton variant="circular" width={30} height={30} />
							<Box sx={{ flex: 1 }}>
								<Skeleton variant="text" width="80%" />
								<Skeleton variant="text" width="50%" height={15} />
							</Box>
						</Box>
						<Box sx={{ width: '10%' }}>
							<Skeleton variant="rounded" width={80} height={20} sx={{ borderRadius: '10px' }} />
						</Box>
						<Box sx={{ width: '15%' }}>
							<Skeleton variant="text" width="70%" />
						</Box>
						<Box sx={{ width: '15%' }}>
							<Skeleton variant="text" width="60%" />
						</Box>
						<Box sx={{ width: '10%', display: 'flex', justifyContent: 'center', gap: 1 }}>
							<Skeleton variant="circular" width={24} height={24} />
							<Skeleton variant="circular" width={24} height={24} />
						</Box>
					</Box>
				))}
			</Stack>
		</Box>
	);
}
