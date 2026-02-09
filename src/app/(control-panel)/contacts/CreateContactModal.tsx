import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateContactFormContent, schema, defaultValues, FormType } from './CreateContactFormContent';

interface CreateContactModalProps {
    open: boolean;
    handleClose: () => void;
}

export function CreateContactModal({ open, handleClose }: CreateContactModalProps) {
    const { control, handleSubmit, formState, reset } = useForm<FormType>({
        mode: 'onChange',
        defaultValues,
        resolver: zodResolver(schema)
    });

    const { errors } = formState;

    function onSubmit(data: FormType) {
        console.log(data);
        handleClose();
        reset();
    }

    const onClose = () => {
        handleClose();
        reset();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    bgcolor: 'background.default',
                    minHeight: '600px', // Fixed min-height instead of vh for better stability
                    width: '100%' // Ensure it takes full width up to maxWidth
                }
            }}
        >
            <DialogContent className="p-0 bg-background-default overflow-y-auto">
                <CreateContactFormContent control={control} errors={errors} variant="modal" />
            </DialogContent>

            <DialogActions className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-divider justify-between">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={onClose}
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
            </DialogActions>
        </Dialog>
    );
}
