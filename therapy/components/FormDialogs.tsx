'use client'
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore"; 
import firebaseApp from '@/config';
import { firebaseConfig } from '@/config';
import firebase from 'firebase/compat/app';
//import db from '@/config';

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
//cache current therapist forms




interface DialogProps {
  formJSON: string;
  setFormJSON: (formJSON: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  //set optionData as json object type
  optionData?: { title: string, choices: Array<{ id: number, text: string, value: number }> };
  setOptionData?: (optionData: any) => void;
  textData?: string;
  setTextData?: (textData: string) => void;
  isEdit?: boolean;
  setIsEdit?: (isEdit: boolean) => void;
  index?: number;
}
export function TextDialog({ formJSON, setFormJSON, open, setOpen, textData, setTextData, isEdit, index, setIsEdit }: DialogProps) {

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextData!(e.target.value);
  }
  const handleClose = () => {
    setTextData!('');
    setOpen(false);
  }
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Text Question
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const name = formJson.name;
            const newFormJSON = JSON.parse(formJSON);
            if (isEdit) {
              newFormJSON.pages[0].elements[index!].title = name;
              setIsEdit!(false);
            }
            else {
              const newElement = {
                'name': Math.random().toString(36).substring(7),
                'title': name,
                'type': 'comment'
              };
              newFormJSON.pages[0].elements.push(newElement);
            }
            setFormJSON(JSON.stringify(newFormJSON));
            setTextData!('');
            setOpen(false);
          },
        }}
      >
        <DialogTitle>Add Text Element</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the Question
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Question Text"
            fullWidth
            variant="standard"
            value={textData}
            onChange={onTextChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export function RadioDialog({ formJSON, setFormJSON, optionData, setOptionData, open, setOpen, isEdit, index, setIsEdit }: DialogProps) {

  const [options, setOptions] = useState(Object.keys(optionData!).length > 0 ? optionData!.choices : [{ id: 1, text: '', value: 0 }]); // Initial state with one option
  const [question, setQuestion] = useState<string>(Object.keys(optionData!).length > 0 ? optionData!.title : '');


  React.useEffect(() => {
    if (Object.keys(optionData!).length > 0) {
      setOptions(optionData!.choices);
      setQuestion(optionData!.title);
      console.log("Called useEffect in RadioDialog", optionData!.choices)
    }
  }, [optionData]);
  // Function to add a new option
  const addOption = () => {
    const tempOptions = isEdit ? optionData!.choices : options;
    const newOptionId = tempOptions![tempOptions!.length - 1].id + 1;
    const newValue = tempOptions.length; // Incremental value starting from 0
    isEdit ? setOptionData!({ ...optionData!, choices: [...tempOptions!, { id: newOptionId, text: '', value: newValue }] }) :
      setOptions([...tempOptions!, { id: newOptionId, text: '', value: newValue }]);
  };

  // Function to handle change in option text or value
  const handleOptionChange = (id: any, field: string, value: any) => {
    const tempOptions = isEdit ? optionData!.choices : options;

    if (field === 'value') {
      if (isNaN(parseInt(value)) || parseInt(value) < 0) {
        value = 0; // Set to 0 if NaN or negative
      }
    }
    const updatedOptions = tempOptions.map((option: any) =>
      option.id === id ? { ...option, [field]: value } : option
    );

    isEdit ? setOptionData!({ ...optionData!, choices: updatedOptions }) : setOptions(updatedOptions);
  };

  // Function to remove an option
  const removeOption = (id: any) => {
    const updatedOptions = isEdit ? optionData!.choices.filter((option: any) => option.id !== id) : options.filter((option: any) => option.id !== id);
    isEdit ? setOptionData!({ ...optionData!, choices: updatedOptions }) : setOptions(updatedOptions);
  };


  // Function to handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const name = formJson.name;
    const newFormJSON = JSON.parse(formJSON);

    if (isEdit) {
      newFormJSON.pages[0].elements[index!].title = name;
      newFormJSON.pages[0].elements[index!].choices = optionData!.choices;
      setIsEdit!(false);
    }
    else {
      const newElement = {
        'title': name,
        'type': 'radiogroup',
        'choices': options
      };
      newFormJSON.pages[0].elements.push(newElement);
    }
    setFormJSON(JSON.stringify(newFormJSON));
    setOptions([{ id: 1, text: '', value: 0 }]);
    setQuestion('');
    setOpen(false);
  };

  const handleClose = () => {
    setOptions([{ id: 1, text: '', value: 0 }]);
    setQuestion('');
    setOpen(false);
  }

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Radio Group
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add Radio Element</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the Question
          </DialogContentText>

          <form onSubmit={handleSubmit}>
            <div id="radioOptions">
              <TextField
                autoFocus
                required
                type="text"
                id="name"
                name="name"
                label='Question Text'
                variant="outlined"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              {(isEdit ? optionData!.choices : options).map((option: any) => (
                <div key={option.id} className="option-item">
                  <RadioButtonUncheckedIcon style={{ height: '14px' }} />
                  <input
                    required
                    type="text"
                    value={option.text}
                    onChange={e => handleOptionChange(option.id, 'text', e.target.value)}
                    placeholder="Option text"
                  />
                  <input
                    type="number"
                    value={option.value}
                    onChange={e => handleOptionChange(option.id, 'value', parseInt(e.target.value))}
                    placeholder="Value"
                  />
                  <button type="button" onClick={() => removeOption(option.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addOption}>
              Add Option
            </button>
            <Button type="submit">{isEdit ? "Save" : "Add"}</Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}


export function DropdownDialog({ formJSON, setFormJSON, optionData, open, setOpen, isEdit, index, setIsEdit }: DialogProps) {
  //const [open, setOpen] = React.useState(false);

  const [options, setOptions] = useState(Object.keys(optionData!).length > 0 ? optionData!.choices : [{ id: 1, text: '', value: 0 }]); // Initial state with one option
  const [question, setQuestion] = useState<string>(Object.keys(optionData!).length > 0 ? optionData!.title : '');

  React.useEffect(() => {
    if (Object.keys(optionData!).length > 0) {
      setOptions(optionData!.choices);
      setQuestion(optionData!.title);
    }
  }, [optionData]);

  const addOption = () => {
    const newOptionId = options![options!.length - 1].id + 1;
    const newValue = options.length; // Incremental value starting from 0
    setOptions([...options!, { id: newOptionId, text: '', value: newValue }]);
  };

  // Function to handle change in option text or value
  const handleOptionChange = (id: any, field: string, value: any) => {
    let newValue = value;

    // Ensure value is a non-negative integer
    if (field === 'value') {
      newValue = parseInt(value);
      if (isNaN(newValue) || newValue < 0) {
        newValue = 0; // Set to 0 if NaN or negative
      }
    }

    const updatedOptions = options.map(option =>
      option.id === id ? { ...option, [field]: newValue } : option
    );
    setOptions(updatedOptions);
  };

  // Function to remove an option
  const removeOption = (id: any) => {
    const updatedOptions = options.filter(option => option.id !== id);
    setOptions(updatedOptions);
  };

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  }

  // Function to handle form submission
  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("heree")
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const name = formJson.name;
    const newFormJSON = JSON.parse(formJSON);
    if (isEdit) {
      newFormJSON.pages[0].elements[index!].title = name;
      newFormJSON.pages[0].elements[index!].choices = options;
      setIsEdit!(false);
    }
    else {
      const newElement = {
        'title': name,
        'type': 'dropdown',
        'choices': options
      };
      newFormJSON.pages[0].elements.push(newElement);
    }
    setFormJSON(JSON.stringify(newFormJSON));
    setOptions([{ id: 1, text: '', value: 0 }]);
    setQuestion('');
    setOpen(false);
  };
  const handleClose = () => {
    setOptions([{ id: 1, text: '', value: 0 }]);
    setQuestion('');
    setOpen(false);

  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Add Dropdown
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Add Dropdown Element</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the Question
          </DialogContentText>

          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Question Text"
              fullWidth
              variant="standard"
              value={question}
              onChange={onTextChange}
            />
            <div id="dropdownOptions">
              {options.map(option => (
                <div key={option.id} className="option-item">
                  <input
                    required
                    type="text"
                    value={option.text}
                    onChange={e => handleOptionChange(option.id, 'text', e.target.value)}
                    placeholder="Option text"
                  />
                  <input
                    type="number"
                    value={option.value}
                    onChange={e => handleOptionChange(option.id, 'value', e.target.value)}
                    min="0"
                    placeholder="Value"
                  />
                  <button type="button" onClick={() => removeOption(option.id)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addOption}>
              Add Option
            </button>
            <Button type="submit">{isEdit ? "Save" : "Add"}</Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export const SaveDialog = ({ open, setOpen, formJSON, setFormJSON }: DialogProps) => {
  const [error, setError] = useState<boolean>(false);
  
   const  loadForms = async  ()  =>  {
      const forms: any[] = [];

      const query = db.collection("forms").where("therapistId", "==", "northstar");
      await query.get().then((querySnapshot) => {
        console.log("querySnapshot heree",querySnapshot)
        if (querySnapshot.size > 0) {
          console.log("forms found")
          querySnapshot.forEach((doc) => {
            forms.push(doc.data());
          });
        }
      });
      await localStorage.setItem("forms", JSON.stringify(forms));
  
  }



  // const query = db.collection("forms").where("therapistId", "==", "northstar");
  // query.get().then((querySnapshot) => {
  //   const forms: any = [];
  //   querySnapshot.forEach((doc) => {
  //     forms.push(doc.data());
  //   });
  //   setCache(forms);
  // });
  const handleClose = () => {
    setOpen(false);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const name = formJson.name;
    //validate if form name is unique for current therapist
    await loadForms();
    const forms:any[] = JSON.parse(localStorage.getItem("forms") || "null");
    console.log("forms after open load",forms)
    if(forms!==null && forms.some(form => form.name === name)){
        setError(true);
    }
    else{
        setError(false)
        await db.collection("forms").add({
          name: name,
          formData: formJSON,
          therapistId: "northstar"
        })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            loadForms();
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });
        setOpen(false);
      }
  }
   
  return (
    <React.Fragment>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Save Form
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the Form Name
          </DialogContentText>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              error = {error}
              required
              margin="dense"
              id="name"
              name="name"
              label="Form Name"
              fullWidth
              variant="standard"
              helperText={error ? "Form name already exists" : ""}
            />
            <Button type="submit">Save</Button>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}