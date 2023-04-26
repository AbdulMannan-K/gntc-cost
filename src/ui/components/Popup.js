import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

const styles = {
    dialogTitle: {
        padding: 5,
    }
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
        '& .MuiDialog-paper': {
            margin: theme.spacing(2),
            minWidth: 'unset',
            maxWidth: 'unset',
        },
    },
}));

export default function Popup(props) {

    const { title, children, openPopup, setOpenPopup } = props;
    const classes = styles;

    return (
        <StyledDialog
            open={openPopup}
            PaperProps={{
                // sx: {
                //     width: "50%",
                //     maxHeight: 300
                // }
            }}
        >
            <DialogTitle style={classes.dialogTitle}>
                <div style={{ display: 'flex' }}>
                    <Typography variant="h6" component="div" style={{ flexGrow: 1, paddingTop: 5, paddingLeft: 5 }}>
                        {title}
                    </Typography>
                    <IconButton
                        onClick={() => { setOpenPopup(false) }}>
                        <CloseIcon />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                {children}
            </DialogContent>
        </StyledDialog>
    )
}