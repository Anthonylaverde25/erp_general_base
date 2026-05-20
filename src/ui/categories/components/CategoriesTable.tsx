import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Tooltip,
	useTheme,
	alpha,
	Switch,
	Stack,
	Chip
} from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { CategoryEntity } from '@/domain/entities/categories/CategoryEntity';
import React from 'react';

interface CategoriesTableProps {
	categories: CategoryEntity[] | undefined;
	isLoading?: boolean;
	showParentColumn?: boolean;
	enableGrouping?: boolean;
	onEdit: (category: CategoryEntity) => void;
	onDelete: (id: number) => void;
	onStatusChange: (category: CategoryEntity) => void;
}

export default function CategoriesTable(props: CategoriesTableProps) {
	const {
		categories,
		isLoading,
		showParentColumn = false,
		enableGrouping = false,
		onEdit,
		onDelete,
		onStatusChange
	} = props;
	const theme = useTheme();

	return (
		<TableContainer sx={{ borderRadius: 0 }}>
			<Table sx={{ minWidth: 650, borderCollapse: 'collapse', border: `1px solid ${theme.palette.divider}` }}>
				<TableHead>
					<TableRow>
						<TableCell
							sx={{
								width: 50,
								textAlign: 'center',
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							#
						</TableCell>
						<TableCell
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Name
						</TableCell>
						<TableCell
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Description
						</TableCell>
						{showParentColumn && (
							<TableCell
								sx={{
									fontWeight: 700,
									p: '6px 10px',
									fontSize: '0.8125rem',
									border: `1px solid ${theme.palette.divider}`,
									backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
									color: theme.palette.text.primary
								}}
							>
								Parent Category
							</TableCell>
						)}
						<TableCell
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Active
						</TableCell>
						<TableCell
							align="right"
							sx={{
								fontWeight: 700,
								p: '6px 10px',
								fontSize: '0.8125rem',
								border: `1px solid ${theme.palette.divider}`,
								backgroundColor: theme.palette.mode === 'dark' ? '#242a2b' : '#f1f3f4',
								color: theme.palette.text.primary
							}}
						>
							Actions
						</TableCell>
					</TableRow>
				</TableHead>

				<TableBody>
					{isLoading ? (
						<TableRow>
							<TableCell
								colSpan={showParentColumn ? 6 : 5}
								align="center"
								sx={{ py: 8, border: `1px solid ${theme.palette.divider}` }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									Loading categories...
								</Typography>
							</TableCell>
						</TableRow>
					) : categories && categories.length > 0 ? (
						categories.map((category, index) => {
							const prevCategory = categories[index - 1];
							const showGroupHeader =
								enableGrouping && (!prevCategory || prevCategory.parent_id !== category.parent_id);

							return (
								<React.Fragment key={category.id}>
									{showGroupHeader && (
										<TableRow
											sx={{
												backgroundColor: alpha(theme.palette.secondary.main, 0.05)
											}}
										>
											<TableCell
												colSpan={showParentColumn ? 6 : 5}
												sx={{
													py: 1,
													pl: 3,
													border: `1px solid ${theme.palette.divider}`,
													backgroundColor: theme.palette.mode === 'dark' ? '#1e2122' : '#f8f9fa'
												}}
											>
												<Typography
													variant="subtitle1"
													sx={{ fontSize: '0.875rem', fontWeight: 700 }}
													color="text.primary"
												>
													{category.parent_name || 'Uncategorized'}
												</Typography>
											</TableCell>
										</TableRow>
									)}
									<TableRow
										hover
										sx={{
											backgroundColor:
												index % 2 === 0
													? 'transparent'
													: theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.02)'
														: 'rgba(0, 0, 0, 0.01)',
											'&:hover': {
												backgroundColor:
													theme.palette.mode === 'dark'
														? 'rgba(255, 255, 255, 0.06)'
														: 'rgba(0, 0, 0, 0.03)'
											}
										}}
									>
										{/* # */}
										<TableCell
											sx={{
												width: 50,
												textAlign: 'center',
												p: '6px 10px',
												fontSize: '0.8125rem',
												border: `1px solid ${theme.palette.divider}`,
												color: theme.palette.text.secondary
											}}
										>
											{index + 1}
										</TableCell>

										<TableCell
											sx={{
												pl: enableGrouping ? 5 : 3,
												p: '6px 10px',
												fontSize: '0.8125rem',
												border: `1px solid ${theme.palette.divider}`
											}}
										>
											<Typography
												variant="subtitle2"
												sx={{ fontSize: '0.8125rem', fontWeight: 600 }}
											>
												{category.name}
											</Typography>
										</TableCell>
										<TableCell
											sx={{
												p: '6px 10px',
												fontSize: '0.8125rem',
												border: `1px solid ${theme.palette.divider}`
											}}
										>
											<Typography
												noWrap
												sx={{ fontSize: '0.8125rem', maxWidth: 300 }}
											>
												{category.description || '-'}
											</Typography>
										</TableCell>
										{showParentColumn && (
											<TableCell
												sx={{
													p: '6px 10px',
													fontSize: '0.8125rem',
													border: `1px solid ${theme.palette.divider}`
												}}
											>
												{category.parent_name ? (
													<Chip
														label={category.parent_name}
														size="small"
														sx={{
															borderRadius: 0,
															fontSize: '0.75rem',
															height: 20
														}}
														variant="outlined"
														color="info"
													/>
												) : (
													'-'
												)}
											</TableCell>
										)}
										<TableCell
											sx={{
												p: '6px 10px',
												fontSize: '0.8125rem',
												border: `1px solid ${theme.palette.divider}`
											}}
										>
											<Switch
												checked={category.is_active}
												onChange={() => onStatusChange(category)}
												inputProps={{ 'aria-label': 'controlled' }}
												size="small"
											/>
										</TableCell>
										<TableCell
											align="right"
											sx={{
												p: '6px 10px',
												fontSize: '0.8125rem',
												border: `1px solid ${theme.palette.divider}`
											}}
										>
											<Stack
												direction="row"
												justifyContent="flex-end"
												spacing={1}
											>
												<Tooltip title="Edit">
													<IconButton
														color="primary"
														size="small"
														onClick={() => onEdit(category)}
													>
														<FuseSvgIcon size={18}>
															heroicons-outline:pencil-square
														</FuseSvgIcon>
													</IconButton>
												</Tooltip>
												<Tooltip title="Delete">
													<IconButton
														color="error"
														size="small"
														onClick={() => onDelete(category.id)}
													>
														<FuseSvgIcon size={18}>heroicons-outline:trash</FuseSvgIcon>
													</IconButton>
												</Tooltip>
											</Stack>
										</TableCell>
									</TableRow>
								</React.Fragment>
							);
						})
					) : (
						<TableRow>
							<TableCell
								colSpan={showParentColumn ? 6 : 5}
								align="center"
								sx={{ py: 8, border: `1px solid ${theme.palette.divider}` }}
							>
								<Typography
									variant="body2"
									color="text.secondary"
								>
									No categories available
								</Typography>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
