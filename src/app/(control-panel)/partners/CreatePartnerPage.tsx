import FusePageSimple from '@fuse/core/FusePageSimple';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router';
import { PartnersForm } from '@/ui/partners/components/forms/PartnersForm';

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

function CreatePartnerPage() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/partners');
    };

    return (
        <Root
            content={
                <div className="p-0 h-full overflow-y-auto">
                    <PartnersForm onCancel={handleBack} onSuccess={handleBack} />
                </div>
            }
        />
    );
}

export default CreatePartnerPage;
