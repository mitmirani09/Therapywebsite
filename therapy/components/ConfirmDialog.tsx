import * as React from 'react';
import {DeleteOutlineOutlined , ForwardToInboxOutlined,} from '@mui/icons-material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { red } from '@mui/material/colors';
import deleteFormResponse from '@/app/api/deleteFormResponse';
import useUserStore from '@/store/useUserStore';
import { Dispatch, SetStateAction } from 'react';
import notifyClientById from '@/app/api/notifyClientsForPendingForms';
import deleteFormById from '@/app/api/deleteFormById';

const ConfirmDialog = (
    {   onDeleteResponse,
        onFormDelete,
        setSelectedResponse,
        id,
        formId,
        pending_form_id,
        name,
        pendingName,
        token,
        selectedDialog,
        dialogTitle,
        dialogMessage,
    }:{ 
        onDeleteResponse:Dispatch<SetStateAction<any>>,
        onFormDelete:Dispatch<SetStateAction<any>>,
        setSelectedResponse:Dispatch<SetStateAction<any>>,
        id:any,
        formId:any,
        pending_form_id:any,
        name:string,
        pendingName:string,
        token:any,
        selectedDialog:string,
        dialogTitle:string,
        dialogMessage:string,
    }
) => {

    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDeleteResponse = () => {
      const body={
        form_id:id,
        client_name:name,
      };
      console.log("Delete Response body:",body);
      deleteFormResponse(token,body).then(data =>{
        console.log(data);
        setSelectedResponse(null);
        onDeleteResponse();
        setOpen(false);
      });

    }

    const handleDeleteForm = (form_id) =>{
      deleteFormById(token,form_id).then(data =>{
         console.log(data);
         onFormDelete();
   });
   }


    const handleConfirmClick = (dialog) =>{
      if(dialog === 'delete'){
        handleDeleteResponse();
      }else if(dialog === 'deleteForm'){
        handleDeleteForm(formId);
      }else{
        handleSendMail();
      }
    }

    const handleSendMail = () => {
      const body={
        form_id:pending_form_id,
        client_name:pendingName,
      };
      notifyClientById(token,body).then(()=>{
        setOpen(false);
      }
      )
    }

  return (
    <React.Fragment>
        {dialogTitle === 'Delete' ? (
            <DeleteOutlineOutlined className="cursor-pointer" onClick={handleClickOpen} sx={{ color: red[300] }} />
        ):(
            <ForwardToInboxOutlined className="cursor-pointer" onClick={handleClickOpen} />
        )} 
        
        <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={()=>handleConfirmClick(selectedDialog)} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}

export default ConfirmDialog