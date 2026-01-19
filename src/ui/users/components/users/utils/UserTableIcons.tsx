import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { MRT_Icons } from 'material-react-table';

/**
 * Custom icons for Material React Table using Lucide icons via FuseSvgIcon
 * Based on MRT_Default_Icons from material-react-table v3.2.1
 */
export const UserTableIcons: Partial<MRT_Icons> = {
    // Navigation & Arrows
    ArrowDownwardIcon: () => <FuseSvgIcon size={20}>lucide:arrow-down</FuseSvgIcon>,
    ArrowRightIcon: () => <FuseSvgIcon size={20}>lucide:arrow-right</FuseSvgIcon>,
    ChevronLeftIcon: () => <FuseSvgIcon size={20}>lucide:chevron-left</FuseSvgIcon>,
    ChevronRightIcon: () => <FuseSvgIcon size={20}>lucide:chevron-right</FuseSvgIcon>,
    ExpandMoreIcon: () => <FuseSvgIcon size={20}>lucide:chevron-down</FuseSvgIcon>,
    FirstPageIcon: () => <FuseSvgIcon size={20}>lucide:chevrons-left</FuseSvgIcon>,
    LastPageIcon: () => <FuseSvgIcon size={20}>lucide:chevrons-right</FuseSvgIcon>,
    KeyboardDoubleArrowDownIcon: () => <FuseSvgIcon size={20}>lucide:chevrons-down</FuseSvgIcon>,

    // Actions
    CancelIcon: () => <FuseSvgIcon size={20}>lucide:x-circle</FuseSvgIcon>,
    ClearAllIcon: () => <FuseSvgIcon size={20}>lucide:eraser</FuseSvgIcon>,
    CloseIcon: () => <FuseSvgIcon size={20}>lucide:x</FuseSvgIcon>,
    ContentCopy: () => <FuseSvgIcon size={20}>lucide:copy</FuseSvgIcon>,
    EditIcon: () => <FuseSvgIcon size={20}>lucide:edit</FuseSvgIcon>,
    SaveIcon: () => <FuseSvgIcon size={20}>lucide:save</FuseSvgIcon>,
    RestartAltIcon: () => <FuseSvgIcon size={20}>lucide:refresh-cw</FuseSvgIcon>,
    SyncAltIcon: () => <FuseSvgIcon size={20}>lucide:arrow-left-right</FuseSvgIcon>,

    // Density
    DensityLargeIcon: () => <FuseSvgIcon size={20}>lucide:align-justify</FuseSvgIcon>,
    DensityMediumIcon: () => <FuseSvgIcon size={20}>lucide:grip-horizontal</FuseSvgIcon>,
    DensitySmallIcon: () => <FuseSvgIcon size={20}>lucide:grip</FuseSvgIcon>,

    // Drag & Pin
    DragHandleIcon: () => <FuseSvgIcon size={20}>lucide:grip-vertical</FuseSvgIcon>,
    PushPinIcon: () => <FuseSvgIcon size={20}>lucide:pin</FuseSvgIcon>,
    DynamicFeedIcon: () => <FuseSvgIcon size={20}>lucide:rss</FuseSvgIcon>,

    // Filters
    FilterAltIcon: () => <FuseSvgIcon size={20}>lucide:filter</FuseSvgIcon>,
    FilterListIcon: () => <FuseSvgIcon size={20}>lucide:list-filter</FuseSvgIcon>,
    FilterListOffIcon: () => <FuseSvgIcon size={20}>lucide:filter-x</FuseSvgIcon>,

    // Fullscreen
    FullscreenIcon: () => <FuseSvgIcon size={20}>lucide:maximize</FuseSvgIcon>,
    FullscreenExitIcon: () => <FuseSvgIcon size={20}>lucide:minimize</FuseSvgIcon>,

    // Search
    SearchIcon: () => <FuseSvgIcon size={20}>lucide:search</FuseSvgIcon>,
    SearchOffIcon: () => <FuseSvgIcon size={20}>lucide:search-x</FuseSvgIcon>,

    // Visibility & Columns
    ViewColumnIcon: () => <FuseSvgIcon size={20}>lucide:columns</FuseSvgIcon>,
    VisibilityOffIcon: () => <FuseSvgIcon size={20}>lucide:eye-off</FuseSvgIcon>,

    // More Options
    MoreHorizIcon: () => <FuseSvgIcon size={20}>lucide:more-horizontal</FuseSvgIcon>,
    MoreVertIcon: () => <FuseSvgIcon size={20}>lucide:more-vertical</FuseSvgIcon>,

    // Sort
    SortIcon: () => <FuseSvgIcon size={20}>lucide:arrow-up-down</FuseSvgIcon>
};
