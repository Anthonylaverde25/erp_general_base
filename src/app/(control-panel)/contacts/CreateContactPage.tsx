import FusePageSimple from '@fuse/core/FusePageSimple';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router';
import { CreateContactFormContent, schema, defaultValues, FormType } from './CreateContactFormContent';

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-header': {
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.background.default : '#0f172a',
        color: theme.palette.mode === 'dark' ? theme.palette.text.primary : '#ffffff',
        borderBottom: `1px solid ${theme.palette.divider}`,
        minHeight: 'auto',
        padding: 0
    },
    '& .FusePageSimple-content': {
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        fontSize: '11px',
        fontFamily: 'Inter, system-ui, sans-serif'
    }
}));

function CreateContactPage() {
    const navigate = useNavigate();
    const { control, handleSubmit, formState } = useForm<FormType>({
        mode: 'onChange',
        defaultValues,
        resolver: zodResolver(schema)
    });

    const { errors } = formState;

    function onSubmit(data: FormType) {
        console.log(data);
        // Provisional submit
        navigate('/contacts');
    }

    return (
        <Root
            content={
                <div className="flex flex-col h-full">
                    <div className="flex-1 overflow-auto">
                        <CreateContactFormContent control={control} errors={errors} />
                    </div>
                    <div className="items-center px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-divider flex justify-between shrink-0">
                        <div className="flex items-center gap-2">
                            <Button
                                component={Link}
                                to="/contacts"
                                color="inherit"
                            >
                                Discard
                            </Button>
                            <Button
                                color="secondary"
                                variant="outlined"
                            >
                                Save Draft
                            </Button>
                        </div>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSubmit(onSubmit)}
                            startIcon={
                                <FuseSvgIcon size={16}>
                                    heroicons-outline:paper-airplane
                                </FuseSvgIcon>
                            }
                        >
                            Commit to Ledger
                        </Button>
                    </div>
                </div>
            }
        />
    );
}

export default CreateContactPage;
