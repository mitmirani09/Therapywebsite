import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { SendOutlined} from '@mui/icons-material';

import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;


const clients = [
{
    name: 'John Doe',
    email: 'johndoe@gmail.com',
},
{
    name: 'Ralp Hubbard',
    email: 'RalphHubbard@gmail.com',
},
{
    name: 'Tucker',
    email: 'AprilTucker@gmail.com',
},
{
    name: 'Henry',
    email: 'VanHenry@gmail.com',
},
{
    name: 'Oliver',
    email: 'OliverHansen@gmail.com',
},
];



const SendDialog = () => {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

  return (
    <React.Fragment>
        <button className="text-xs text-nowrap bg-white text-purple-500 px-4 py-2 rounded-full shadow-md flex items-center" onClick={handleClickOpen}>
            <span className='pl-1 pr-1'>Send to</span>
            <SendOutlined/>
        </button>
        
        <Dialog
        open={open}
        onClose={handleClose}
        >
        <DialogTitle>Send Mail</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Send Mail To
          </DialogContentText>
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={clients}
            disableCloseOnSelect
            getOptionLabel={(option) => option.name}
            renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                <li key={key} {...optionProps}>
                    <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                    />
                    {`${option.name}: ${option.email}`}
                </li>
                );
            }}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} label="Email's" />
            )}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose} type="submit">Send</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}


export default SendDialog;