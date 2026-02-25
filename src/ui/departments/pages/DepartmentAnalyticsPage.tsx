import React, { Suspense, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { usePreviewJsonFile } from '@/features/files/hooks/usePreviewJsonFile';
import type { IMutField } from '@kanaries/graphic-walker';
import Link from '@fuse/core/Link';
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import '@kanaries/graphic-walker/dist/style.css';

const GraphicWalker = React.lazy(() =>
	import('@kanaries/graphic-walker').then((module) => ({
		default: module.GraphicWalker
	}))
);

type PreviewRow = Record<string, unknown>;

interface AnalyticsLocationState {
	fileName?: string;
	fileTypeName?: string;
	uploaderName?: string;
	returnTo?: string;
	departmentCode?: string;
}

function isObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function hasNestedDataArray(value: unknown): value is { data: PreviewRow[] } {
	return isObject(value) && Array.isArray(value.data);
}

function inferFieldMeta(key: string, rows: PreviewRow[]): IMutField {
	const sample = rows.map((row) => row[key]).find((value) => value !== null && value !== undefined && value !== '');

	if (typeof sample === 'number' && Number.isFinite(sample)) {
		return {
			fid: key,
			key,
			name: key,
			basename: key,
			path: [key],
			semanticType: 'quantitative',
			analyticType: 'measure'
		};
	}

	if (typeof sample === 'string' && !Number.isNaN(Date.parse(sample))) {
		return {
			fid: key,
			key,
			name: key,
			basename: key,
			path: [key],
			semanticType: 'temporal',
			analyticType: 'dimension'
		};
	}

	return {
		fid: key,
		key,
		name: key,
		basename: key,
		path: [key],
		semanticType: 'nominal',
		analyticType: 'dimension'
	};
}

export default function DepartmentAnalyticsPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const theme = useTheme();
	const { fileId } = useParams<{ fileId: string }>();
	const analyticsState = (location.state as AnalyticsLocationState | null) || null;
	const appearance: 'light' | 'dark' = theme.palette.mode === 'dark' ? 'dark' : 'light';

	const parsedFileId = Number(fileId || 0);
	const hasValidFileId = Number.isInteger(parsedFileId) && parsedFileId > 0;

	const { data: response, isLoading, isError } = usePreviewJsonFile(parsedFileId, hasValidFileId);

	const actualData = useMemo(() => {
		if (!response) return [];

		if (Array.isArray(response)) return response;

		if (!isObject(response)) return [];

		const firstData = response.data;

		if (Array.isArray(firstData)) return firstData;

		if (hasNestedDataArray(firstData)) return firstData.data;

		return [];
	}, [response]);

	const columnKeys = useMemo(() => {
		if (actualData.length === 0) return [];

		const firstRow = actualData[0] as PreviewRow;

		return Object.keys(firstRow).filter((key) => key.trim() !== '');
	}, [actualData]);

	const walkerFields = useMemo<IMutField[]>(() => {
		const rows = actualData as PreviewRow[];
		return columnKeys.map((key) => inferFieldMeta(key, rows));
	}, [actualData, columnKeys]);

	const walkerDefaultConfig = useMemo(
		() => ({
			layout: {
				size: {
					mode: 'full' as const,
					width: 320,
					height: 200
				}
			}
		}),
		[]
	);

	if (!hasValidFileId) {
		return (
			<Box sx={{ p: 4 }}>
				<Typography color="error">Archivo inválido para analítica visual.</Typography>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				position: 'relative',
				bgcolor: 'background.default',
				display: 'flex',
				flexDirection: 'column',
				height: 'calc(100dvh - 120px)',
				width: '100%',
				maxWidth: '100%',
				minHeight: 0
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					flexWrap: 'wrap',
					gap: 2,
					p: 2,
					borderBottom: '1px solid',
					borderColor: 'divider',
					bgcolor: 'background.paper'
				}}
			>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
					<IconButton
						size="small"
						onClick={() => navigate(analyticsState?.returnTo || -1)}
						sx={{ bgcolor: 'action.hover' }}
					>
						<ArrowBack fontSize="small" />
					</IconButton>
					<Box>
						<Breadcrumb className="mb-1">
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink asChild>
										<Link to="/departments">Departamentos</Link>
									</BreadcrumbLink>
								</BreadcrumbItem>
								{analyticsState?.departmentCode && (
									<>
										<BreadcrumbSeparator />
										<BreadcrumbItem>
											<BreadcrumbLink asChild>
												<Link to={`/departments/${analyticsState.departmentCode}`}>
													{analyticsState.departmentCode}
												</Link>
											</BreadcrumbLink>
										</BreadcrumbItem>
									</>
								)}
								<BreadcrumbSeparator />
								<BreadcrumbItem>
									<BreadcrumbPage>Analítica visual</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<Typography
							variant="h5"
							fontWeight={700}
						>
							Analítica visual del archivo
						</Typography>
						<Typography
							variant="body2"
							color="text.secondary"
						>
							{analyticsState?.fileName || `Archivo #${parsedFileId}`}
							{analyticsState?.fileTypeName ? ` • ${analyticsState.fileTypeName}` : ''}
						</Typography>
						{analyticsState?.uploaderName && (
							<Typography
								variant="caption"
								color="text.secondary"
							>
								Subido por: {analyticsState.uploaderName}
							</Typography>
						)}
					</Box>
				</Box>
			</Box>

			<Box
				sx={{
					flex: 1,
					minHeight: 0,
					overflow: 'hidden',
					bgcolor: 'background.default'
				}}
			>
				{isLoading ? (
					<Box
						sx={{
							display: 'flex',
							height: '100%',
							minHeight: 360,
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<CircularProgress />
					</Box>
				) : isError ? (
					<Box>
						<Typography color="error">
							Error al procesar el archivo. Asegúrate de que sea un Excel o CSV válido.
						</Typography>
					</Box>
				) : actualData.length > 0 ? (
					<Suspense
						fallback={
							<Box
								sx={{
									display: 'flex',
									height: '100%',
									minHeight: 360,
									justifyContent: 'center',
									alignItems: 'center'
								}}
							>
								<CircularProgress />
							</Box>
						}
					>
						<Box
							className="p-3"
							sx={{ height: '100%', minHeight: 0 }}
						>
							<GraphicWalker
								dataSource={actualData as PreviewRow[]}
								fields={walkerFields}
								appearance={appearance}
								defaultConfig={walkerDefaultConfig}
								style={{ width: '100%', height: '100%' }}
							/>
						</Box>
					</Suspense>
				) : (
					<Box
						sx={{
							display: 'flex',
							height: '100%',
							minHeight: 360,
							justifyContent: 'center',
							alignItems: 'center',
							p: 3
						}}
					>
						<Typography>No hay datos disponibles para mostrar.</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}
