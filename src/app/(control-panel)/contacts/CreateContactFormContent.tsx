import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled, alpha } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { z } from 'zod';
import Box from '@mui/material/Box';

// Validation Schema
export const schema = z.object({
    legalEntityName: z.string().nonempty('Required'),
    internalId: z.string().optional(),
    taxId: z.string().optional(),
    industrySector: z.string().optional(),
    legalCategory: z.string().optional(),
    riskRating: z.string().optional(),
    baseCurrency: z.string().optional(),
    address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        postalCode: z.string().optional(),
        country: z.string().optional()
    }),
    financial: z.object({
        creditLimit: z.string().optional(),
        paymentTerms: z.string().optional(),
        incoterms: z.string().optional(),
        taxCategory: z.string().optional(),
        salesOrg: z.string().optional(),
        distributionCh: z.string().optional(),
        priceList: z.string().optional(),
        discountGroup: z.string().optional()
    })
});

export type FormType = z.infer<typeof schema>;

export const defaultValues: FormType = {
    legalEntityName: 'INDUSTRIAL SYSTEMS CORP S.A.',
    internalId: 'BP-2024-X880',
    taxId: '',
    industrySector: 'MFG - Manufacturing',
    legalCategory: 'Private Corporation',
    riskRating: 'Low Risk (A1)',
    baseCurrency: 'USD - US Dollar',
    address: {
        street: '',
        city: '',
        postalCode: '',
        country: ''
    },
    financial: {
        creditLimit: '50,000.00',
        paymentTerms: 'NET 30',
        incoterms: 'FOB - Free On Board',
        taxCategory: 'EXEMPT_GROUP_01',
        salesOrg: 'SO_1000',
        distributionCh: 'Direct Sales',
        priceList: 'Standard Whls',
        discountGroup: 'GRP_GLOBAL_5'
    }
};

const SectionHeaderRoot = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem', // gap-2
    padding: '0.25rem 0.5rem', // px-2 py-1
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.mode === 'dark'
        ? alpha(theme.palette.text.primary, 0.05)
        : theme.palette.grey[100],
    color: theme.palette.text.secondary,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em', // tracking-widest
    fontSize: '10px'
}));

export const SectionHeader = ({ icon, title }: { icon: string; title: string }) => (
    <SectionHeaderRoot>
        <FuseSvgIcon size={14} className="mr-2">
            {icon}
        </FuseSvgIcon>
        {title}
    </SectionHeaderRoot>
);

export const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Typography
        component="label"
        sx={{
            display: 'block',
            fontSize: '10px',
            fontWeight: 'bold',
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '-0.025em', // tracking-tighter
            mb: 0.5
        }}
    >
        {children}
    </Typography>
);

interface CreateContactFormContentProps {
    control: Control<FormType>;
    errors: FieldErrors<FormType>;
    variant?: 'default' | 'modal';
}

export function CreateContactFormContent(props: CreateContactFormContentProps) {
    const { control, errors, variant = 'default' } = props;
    const isModal = variant === 'modal';

    const sectionBoxSx = {
        bgcolor: 'background.paper',
        border: isModal ? 0 : 1,
        borderColor: 'divider',
        boxShadow: isModal ? 0 : 1
    };

    return (
        <div className="w-full  mx-auto p-2 space-y-2 pb-24 relative">
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 lg:col-span-9 space-y-3">
                    {/* Section 01 */}
                    <Box
                        sx={sectionBoxSx}
                    >
                        <SectionHeader
                            icon="heroicons-outline:identification"
                            title="01. Identification & General Information"
                        />
                        <div className="p-2 grid grid-cols-4 gap-x-2 gap-y-2">
                            <div className="col-span-2">
                                <Controller
                                    control={control}
                                    name="legalEntityName"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>
                                                Legal Entity Name <Box component="span" sx={{ color: 'primary.main' }}>*</Box>
                                            </FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                error={!!errors.legalEntityName}
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            fontWeight: 'bold',
                                                            p: 0,
                                                            bgcolor: 'background.paper'
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="internalId"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Internal ID</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                disabled
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            fontFamily: 'monospace',
                                                            color: 'primary.main',
                                                            p: 0,
                                                            bgcolor: (theme) => alpha(theme.palette.action.disabledBackground, 0.5)
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="taxId"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Tax ID (VAT/RUT)</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                placeholder="77.283.100-K"
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0,
                                                            pr: 3 // space for icon
                                                        },
                                                        endAdornment: (
                                                            <FuseSvgIcon
                                                                size={12}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    right: 4,
                                                                    color: 'action.active',
                                                                    cursor: 'pointer',
                                                                    '&:hover': { color: 'primary.main' }
                                                                }}
                                                            >
                                                                heroicons-outline:search
                                                            </FuseSvgIcon>
                                                        )
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="industrySector"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Industry Sector</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0,
                                                            pr: 3
                                                        },
                                                        endAdornment: (
                                                            <FuseSvgIcon
                                                                size={12}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    right: 4,
                                                                    color: 'action.active',
                                                                    cursor: 'pointer',
                                                                    '&:hover': { color: 'primary.main' }
                                                                }}
                                                            >
                                                                heroicons-outline:view-list
                                                            </FuseSvgIcon>
                                                        )
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="legalCategory"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Legal Category</FieldLabel>
                                            <TextField
                                                {...field}
                                                select
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    select: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            py: 0.5,
                                                            px: 1,
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="Private Corporation" dense sx={{ fontSize: 11 }}>
                                                    Private Corporation
                                                </MenuItem>
                                                <MenuItem value="Public Company" dense sx={{ fontSize: 11 }}>
                                                    Public Company
                                                </MenuItem>
                                            </TextField>
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="riskRating"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Risk Rating</FieldLabel>
                                            <TextField
                                                {...field}
                                                select
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    select: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            py: 0.5,
                                                            px: 1,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            fontWeight: 'bold',
                                                            color: 'success.main'
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="Low Risk (A1)" dense sx={{ fontSize: 11 }}>
                                                    Low Risk (A1)
                                                </MenuItem>
                                                <MenuItem value="Medium (B2)" dense sx={{ fontSize: 11 }}>
                                                    Medium (B2)
                                                </MenuItem>
                                            </TextField>
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="baseCurrency"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Base Currency</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </Box>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Section 02 */}
                        <Box
                            sx={sectionBoxSx}
                        >
                            <SectionHeader
                                icon="heroicons-outline:location-marker"
                                title="02. Logistic Address"
                            />
                            <div className="p-2 grid grid-cols-2 gap-2">
                                <div className="col-span-2">
                                    <Controller
                                        control={control}
                                        name="address.street"
                                        render={({ field }) => (
                                            <div className="w-full">
                                                <FieldLabel>Primary Street Address</FieldLabel>
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    slotProps={{
                                                        input: {
                                                            sx: {
                                                                height: 28,
                                                                fontSize: 11,
                                                                p: 0
                                                            }
                                                        },
                                                        htmlInput: {
                                                            sx: { py: 0.5, px: 1 }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        control={control}
                                        name="address.city"
                                        render={({ field }) => (
                                            <div className="w-full">
                                                <FieldLabel>City / Region</FieldLabel>
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    slotProps={{
                                                        input: {
                                                            sx: {
                                                                height: 28,
                                                                fontSize: 11,
                                                                p: 0
                                                            }
                                                        },
                                                        htmlInput: {
                                                            sx: { py: 0.5, px: 1 }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        control={control}
                                        name="address.postalCode"
                                        render={({ field }) => (
                                            <div className="w-full">
                                                <FieldLabel>Postal Code</FieldLabel>
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    fullWidth
                                                    variant="outlined"
                                                    slotProps={{
                                                        input: {
                                                            sx: {
                                                                height: 28,
                                                                fontSize: 11,
                                                                p: 0
                                                            }
                                                        },
                                                        htmlInput: {
                                                            sx: { py: 0.5, px: 1 }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <Controller
                                        control={control}
                                        name="address.country"
                                        render={({ field }) => (
                                            <div className="w-full">
                                                <FieldLabel>Country Code</FieldLabel>
                                                <TextField
                                                    {...field}
                                                    size="small"
                                                    fullWidth
                                                    placeholder="Select Country..."
                                                    variant="outlined"
                                                    slotProps={{
                                                        input: {
                                                            sx: {
                                                                height: 28,
                                                                fontSize: 11,
                                                                p: 0,
                                                                pr: 3
                                                            },
                                                            endAdornment: (
                                                                <FuseSvgIcon
                                                                    size={12}
                                                                    sx={{
                                                                        position: 'absolute',
                                                                        right: 4,
                                                                        color: 'action.active',
                                                                        cursor: 'pointer',
                                                                        '&:hover': { color: 'primary.main' }
                                                                    }}
                                                                >
                                                                    heroicons-outline:globe
                                                                </FuseSvgIcon>
                                                            )
                                                        },
                                                        htmlInput: {
                                                            sx: { py: 0.5, px: 1 }
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </Box>

                        {/* Section 03 */}
                        <Box
                            sx={sectionBoxSx}
                        >
                            <SectionHeader icon="heroicons-outline:map" title="03. Georeference" />
                            <div className="p-2">
                                <div className="relative h-[95px] bg-slate-200 border border-slate-300 overflow-hidden group">
                                    <img
                                        alt="Terminal Map"
                                        className="w-full h-full object-cover grayscale brightness-50 contrast-125"
                                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTbuGCUj3cIV6JSq43v_hpVGt1afKpAuplgdSeHnWHq-9IURXG4DfZ71UMpBUOOnIc2LjbdjFjgEkGw4TDIc0GBoaXo_JwDOZJ7tz1ZKX-zPFIFTF2iA2iUo9MfIS4c9rTZ2fo8tQauxYxCRB-Xnl_zjjKf_DcY_fClkybPC5A08GlJPRuZ0GKUeI-H2U0tq8lEbM2bwfStrf48p6oxVO5EpUVcDpeTqK9msg14l116tQeculOUC0dxEOLvIymLntyPGToPJFSK3w"
                                    />
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a]/40">
                                        <div className="bg-[#0f172a] text-white px-2 py-0.5 rounded-sm border border-slate-700 font-mono text-[9px] flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                                            19.4326° N, 99.1332° W
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 grid grid-cols-2 gap-2">
                                    <TextField
                                        size="small"
                                        placeholder="Lat: 0.000"
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    height: 28,
                                                    fontSize: 11,
                                                    fontFamily: 'monospace',
                                                    p: 0
                                                }
                                            },
                                            htmlInput: {
                                                sx: { py: 0.5, px: 1 }
                                            }
                                        }}
                                    />
                                    <TextField
                                        size="small"
                                        placeholder="Lng: 0.000"
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                sx: {
                                                    height: 28,
                                                    fontSize: 11,
                                                    fontFamily: 'monospace',
                                                    p: 0
                                                }
                                            },
                                            htmlInput: {
                                                sx: { py: 0.5, px: 1 }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </Box>
                    </div>

                    {/* Section 04 */}
                    <Box
                        sx={sectionBoxSx}
                    >
                        <SectionHeader
                            icon="heroicons-outline:currency-dollar"
                            title="04. Financial & Sales Configuration"
                        />
                        <div className="p-2 grid grid-cols-4 gap-x-2 gap-y-2">
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.creditLimit"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Credit Limit</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            fontFamily: 'monospace',
                                                            textAlign: 'right',
                                                            p: 0
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.paymentTerms"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Payment Terms</FieldLabel>
                                            <TextField
                                                {...field}
                                                select
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    select: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            py: 0.5,
                                                            px: 1,
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="NET 30" dense sx={{ fontSize: 11 }}>
                                                    NET 30
                                                </MenuItem>
                                                <MenuItem value="NET 60" dense sx={{ fontSize: 11 }}>
                                                    NET 60
                                                </MenuItem>
                                                <MenuItem value="CASH" dense sx={{ fontSize: 11 }}>
                                                    CASH
                                                </MenuItem>
                                            </TextField>
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.incoterms"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Incoterms</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.taxCategory"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Tax Category</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.salesOrg"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Sales Org</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0,
                                                            pr: 3
                                                        },
                                                        endAdornment: (
                                                            <FuseSvgIcon
                                                                size={12}
                                                                sx={{
                                                                    position: 'absolute',
                                                                    right: 4,
                                                                    color: 'action.active',
                                                                    cursor: 'pointer',
                                                                    '&:hover': { color: 'primary.main' }
                                                                }}
                                                            >
                                                                heroicons-outline:office-building
                                                            </FuseSvgIcon>
                                                        )
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.distributionCh"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Distribution Ch.</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.priceList"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Price List</FieldLabel>
                                            <TextField
                                                {...field}
                                                select
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    select: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            py: 0.5,
                                                            px: 1,
                                                            display: 'flex',
                                                            alignItems: 'center'
                                                        }
                                                    }
                                                }}
                                            >
                                                <MenuItem value="Standard Whls" dense sx={{ fontSize: 11 }}>
                                                    Standard Whls
                                                </MenuItem>
                                                <MenuItem value="Premium Tier" dense sx={{ fontSize: 11 }}>
                                                    Premium Tier
                                                </MenuItem>
                                            </TextField>
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    control={control}
                                    name="financial.discountGroup"
                                    render={({ field }) => (
                                        <div className="w-full">
                                            <FieldLabel>Discount Group</FieldLabel>
                                            <TextField
                                                {...field}
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                slotProps={{
                                                    input: {
                                                        sx: {
                                                            height: 28,
                                                            fontSize: 11,
                                                            p: 0
                                                        }
                                                    },
                                                    htmlInput: {
                                                        sx: { py: 0.5, px: 1 }
                                                    }
                                                }}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </Box>
                </div>

                {/* Right Column */}
                <div className="col-span-12 lg:col-span-3 space-y-3">
                    <Box
                        sx={sectionBoxSx}
                    >
                        <SectionHeader icon="heroicons-outline:tag" title="Segmentation" />
                        <div className="p-2 space-y-2">
                            <div>
                                <FieldLabel>System Tags</FieldLabel>
                                <div className="flex flex-wrap gap-1 p-1 bg-slate-50 border border-slate-200 min-h-[50px] content-start">
                                    {/* System tags still hardcoded styles for now as they are specific badges, but container updated */}
                                    <span className="px-1.5 py-0 bg-[#1e293b] text-white text-[9px] font-bold rounded-sm flex items-center gap-1">
                                        CRITICAL
                                        <FuseSvgIcon size={10} className="cursor-pointer">
                                            heroicons-outline:x
                                        </FuseSvgIcon>
                                    </span>
                                    <span className="px-1.5 py-0 bg-slate-200 text-slate-700 text-[9px] font-bold rounded-sm flex items-center gap-1">
                                        REG_NORTH
                                        <FuseSvgIcon size={10} className="cursor-pointer">
                                            heroicons-outline:x
                                        </FuseSvgIcon>
                                    </span>
                                    <input
                                        className="bg-transparent border-none p-0 focus:ring-0 text-[10px] w-12 outline-none"
                                        placeholder="+ tag"
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div>
                                <FieldLabel>ABC Classification</FieldLabel>
                                <div className="flex">
                                    <button className="flex-1 py-0.5 text-[10px] font-bold border border-slate-300 bg-[#0f172a] text-white">
                                        A
                                    </button>
                                    <button className="flex-1 py-0.5 text-[10px] font-bold border-y border-r border-slate-300 text-slate-400 hover:bg-slate-50">
                                        B
                                    </button>
                                    <button className="flex-1 py-0.5 text-[10px] font-bold border-y border-r border-slate-300 text-slate-400 hover:bg-slate-50">
                                        C
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Box>

                    <Box
                        sx={sectionBoxSx}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                bgcolor: (theme) => theme.palette.mode === 'dark' ? alpha(theme.palette.text.primary, 0.05) : 'grey.100',
                                px: 1,
                                py: 0.5,
                                borderTop: 1,
                                borderBottom: 1,
                                borderColor: 'divider',
                                color: 'text.secondary',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                fontSize: 10
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <FuseSvgIcon size={14}>heroicons-outline:paper-clip</FuseSvgIcon>
                                Attachments
                            </div>
                            <span className="text-[9px] font-mono">COUNT: 02</span>
                        </Box>
                        <div className="p-2 space-y-1.5">
                            <div className="p-1.5 border border-slate-200 flex items-center gap-2">
                                <FuseSvgIcon className="text-slate-400 text-base">
                                    heroicons-outline:document-text
                                </FuseSvgIcon>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold truncate m-0">TAX_ID_CERT.PDF</p>
                                    <div className="w-full bg-slate-200 h-0.5 mt-1">
                                        <div className="bg-[#3b82f6] h-0.5 w-[60%]"></div>
                                    </div>
                                </div>
                                <span className="text-[9px] font-mono text-slate-400">60%</span>
                            </div>
                            <div className="p-1.5 border border-slate-200 flex items-center gap-2 bg-slate-50">
                                <FuseSvgIcon className="text-[#10b981] text-base">
                                    heroicons-outline:check-circle
                                </FuseSvgIcon>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-bold truncate m-0">KYC_FORM_V2.XLSX</p>
                                    <p className="text-[8px] text-slate-400 font-mono m-0">
                                        VERIFIED_HASH_OK
                                    </p>
                                </div>
                                <button className="text-slate-300 hover:text-red-600">
                                    <FuseSvgIcon size={14}>heroicons-outline:trash</FuseSvgIcon>
                                </button>
                            </div>
                            <button className="w-full py-2 border border-dashed border-slate-300 text-slate-400 hover:text-[#3b82f6] hover:border-[#3b82f6] flex flex-col items-center justify-center transition-colors bg-transparent cursor-pointer">
                                <FuseSvgIcon size={18}>heroicons-outline:cloud-upload</FuseSvgIcon>
                                <span className="text-[9px] font-bold uppercase tracking-tight">
                                    Upload Document
                                </span>
                            </button>
                        </div>
                    </Box>

                    <Box
                        sx={{
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                            p: 1,
                            borderRadius: 1,
                            border: 1,
                            borderColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                            '& > div': { mb: 0.5 }
                        }}
                    >
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                            <span>CREATION_DATE:</span>
                            <span>2024-05-20 14:22:10</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                            <span>OBJECT_OWNER:</span>
                            <span>SYS_ADMIN_01</span>
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                            <span>SCHEMA_REF:</span>
                            <span className="text-[#3b82f6]">BUPA_V3_MASTER</span>
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    );
}
