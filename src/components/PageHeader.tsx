import { ReactNode } from 'react';
import Typography from '@mui/material/Typography';
import { Box, IconButton, alpha } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import PageBreadcrumb from '@/components/PageBreadcrumb';

export type PageHeaderProps = {
	title: ReactNode;
	subtitle?: ReactNode;
	actions?: ReactNode;
	showBreadcrumb?: boolean;
	onBack?: () => void;
};

export default function PageHeader({
	title,
	subtitle,
	actions,
	showBreadcrumb = true,
	onBack
}: PageHeaderProps) {
	return (
		<Box className="flex flex-col w-full px-8 py-6 gap-2">
			{showBreadcrumb && <PageBreadcrumb className="mb-2" />}
			<Box className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<Box className="flex items-center gap-3">
					{onBack && (
						<IconButton
							onClick={onBack}
							size="small"
							sx={{
								color: 'text.secondary',
								'&:hover': {
									color: 'text.primary',
									bgcolor: (theme) => alpha(theme.palette.text.primary, 0.04)
								}
							}}
						>
							<ArrowLeft size={20} />
						</IconButton>
					)}
					<Box className="flex flex-col">
						{typeof title === 'string' ? (
							<Typography
								variant="h5"
								sx={{ fontWeight: 900, color: 'text.primary' }}
							>
								{title}
							</Typography>
						) : (
							title
						)}
						{subtitle && (
							<Typography
								variant="body2"
								sx={{ color: 'text.secondary', mt: 0.5 }}
							>
								{subtitle}
							</Typography>
						)}
					</Box>
				</Box>
				{actions && <Box className="flex items-center gap-3 self-end sm:self-auto">{actions}</Box>}
			</Box>
		</Box>
	);
}
