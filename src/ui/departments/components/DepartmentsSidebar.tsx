import { useState } from 'react';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    Box,
    Divider,
    IconButton
} from '@mui/material';
import {
    AccountTree as AccountTreeIcon,
    Business as BusinessIcon,
    ExpandLess,
    ExpandMore,
    ChevronRight
} from '@mui/icons-material';

const mockTreeData = [
    {
        id: 1,
        name: 'Operaciones',
        code: 'OPR',
        children: [
            { id: 4, name: 'Producción', code: 'PROD', children: [] },
            { id: 5, name: 'Logística', code: 'LOG', children: [] }
        ]
    },
    {
        id: 2,
        name: 'Finanzas',
        code: 'FIN',
        children: [
            { id: 6, name: 'Contabilidad', code: 'CONT', children: [] }
        ]
    },
    {
        id: 3,
        name: 'Recursos Humanos',
        code: 'HR',
        children: []
    }
];

interface DepartmentNodeProps {
    node: any;
    level: number;
    selectedCode: string | null;
    onSelect: (code: string) => void;
}

function DepartmentNode({ node, level, selectedCode, onSelect }: DepartmentNodeProps) {
    const [open, setOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedCode === node.code;

    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        setOpen(!open);
    };

    return (
        <>
            <ListItem disablePadding>
                <ListItemButton
                    selected={isSelected}
                    onClick={() => onSelect(node.code)}
                    sx={{
                        pl: 2 + level * 2,
                        py: 1,
                        borderLeft: isSelected ? 3 : 3,
                        borderColor: isSelected ? 'primary.main' : 'transparent',
                        bgcolor: isSelected ? 'primary.light' : 'transparent',
                        '&.Mui-selected': {
                            bgcolor: 'primary.light',
                            '&:hover': {
                                bgcolor: 'primary.light',
                            }
                        }
                    }}
                >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                        {hasChildren ? (
                            <IconButton size="small" onClick={handleToggle} sx={{ p: 0.5, mr: 0.5 }}>
                                {open ? <ExpandMore fontSize="small" /> : <ChevronRight fontSize="small" />}
                            </IconButton>
                        ) : (
                            <Box sx={{ width: 28 }} /> // Spacer for alignment
                        )}
                    </ListItemIcon>
                    <ListItemIcon sx={{ minWidth: 36, color: isSelected ? 'primary.main' : 'text.secondary' }}>
                        {level === 0 ? <BusinessIcon fontSize="small" /> : <AccountTreeIcon fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText
                        primary={node.name}
                        secondary={node.code}
                        primaryTypographyProps={{
                            variant: 'body2',
                            fontWeight: isSelected ? 600 : 500,
                            color: isSelected ? 'primary.main' : 'text.primary'
                        }}
                        secondaryTypographyProps={{ variant: 'caption' }}
                    />
                </ListItemButton>
            </ListItem>
            {hasChildren && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {node.children.map((child: any) => (
                            <DepartmentNode
                                key={child.id}
                                node={child}
                                level={level + 1}
                                selectedCode={selectedCode}
                                onSelect={onSelect}
                            />
                        ))}
                    </List>
                </Collapse>
            )}
        </>
    );
}

interface DepartmentsSidebarProps {
    selectedCode: string | null;
    onSelect: (code: string) => void;
}

export default function DepartmentsSidebar({ selectedCode, onSelect }: DepartmentsSidebarProps) {
    // In future iterations, replace mockTreeData with dynamic department tree data
    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={700}>
                    Organigrama
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Estructura de la empresa
                </Typography>
            </Box>
            <Divider />
            <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
                <List component="nav" sx={{ p: 0 }}>
                    {mockTreeData.map((node) => (
                        <DepartmentNode
                            key={node.id}
                            node={node}
                            level={0}
                            selectedCode={selectedCode}
                            onSelect={onSelect}
                        />
                    ))}
                </List>
            </Box>
        </Box>
    );
}
