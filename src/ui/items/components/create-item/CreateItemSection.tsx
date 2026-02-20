import { Chip, Typography } from '@mui/material';
import { ReactNode } from 'react';

type CreateItemSectionProps = {
	title: string;
	chipLabel: string;
	description: string;
	children: ReactNode;
	borderedTop?: boolean;
};

function CreateItemSection({ title, chipLabel, description, children, borderedTop = true }: CreateItemSectionProps) {
	return (
		<div className={borderedTop ? 'border-t border-dashed pt-6' : ''}>
			<div className="mb-6 flex flex-col border-b pb-4">
				<div className="mb-2 flex items-center justify-between">
					<Typography
						variant="h6"
						className="text-text-primary text-lg font-semibold"
					>
						{title}
					</Typography>
					<Chip
						label={chipLabel}
						size="small"
						variant="outlined"
						className="text-text-secondary border-divider"
					/>
				</div>
				<Typography
					variant="body2"
					className="text-text-secondary"
				>
					{description}
				</Typography>
			</div>
			{children}
		</div>
	);
}

export default CreateItemSection;
