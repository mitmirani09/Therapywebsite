'use client'
import React, { useCallback, useEffect } from "react";
import { useState } from "react";
import { Button, IconButton } from "@mui/material";
import { DropdownDialog, RadioDialog, TextDialog } from "./FormDialogs";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import { Survey } from 'survey-react-ui';
import { Model } from 'survey-core';
import 'survey-core/defaultV2.min.css';
import { SaveDialog } from "./FormDialogs";
//import firebaseApp from "@/config";
import { firebaseConfig } from "@/config";
// import firebase from 'firebase/compat/app'
// import "firebase/firestore";

// firebase.initializeApp(firebaseConfig);

// const db = firebase.firestore();

const creatorOptions = {
  showLogicTab: true,
  isAutoSave: true
};




const FormArea = () => {
  // const creator = new SurveyCreator(creatorOptions);
  // const style = { height: "100vh" };
  // return (
  //   <div style={style}>
  //   <SurveyCreatorComponent creator={creator} />
  //   </div>
  // )
  //const [inputFields, setInputFields] = useState<Array<string>>([]);
  const initJSON = {
    'pages': [
      {
        'name': 'page1',
        'elements': []
      }
    ]
  };

  const getComponent = (element: any, index: number) => {
    switch (element.type) {
      case 'radiogroup':
        return (
          <div key={index}>
            <p>{element.title}</p>
            <form>
              {element.choices.map((choice: any) => (
                <div key={`${choice.name}-${choice.value}`}>
                  <input type="radio" id={choice.value} name={element.name} value={choice.value} />
                  <label htmlFor={choice.value}>{choice.text}</label>
                </div>
              ))}
            </form>
          </div>
        );
      case 'dropdown':
        return (
          <div key={index}>
            <p>{element.title}</p>
            <select>
              {element.choices.map((choice: any, index: any) => (
                <option key={index} value={choice.value}>{choice.text}</option>
              ))}
            </select>
          </div>
        );
      case 'rating':
        let ratingValues = [];
        if (element.autoGenerate === false && element.rateValues) {
          ratingValues = element.rateValues;
        } else {
          // Default rating values
          ratingValues = [
            { value: 1, text: 'Poor' },
            { value: 2, text: 'Fair' },
            { value: 3, text: 'Average' },
            { value: 4, text: 'Good' },
            { value: 5, text: 'Excellent' }
          ];
        }
        if (element.displayMode === 'dropdown') {
          return (
            <div key={index}>
              <p>{element.name}</p>
              <select>
                {ratingValues.map((rate: any) => (
                  <option key={rate.value} value={rate.value}>{rate.text}</option>
                ))}
              </select>
            </div>
          );
        } else {
          return (
            <div key={index}>
              <p>{element.name}</p>
              {ratingValues.map((rate: any) => (
                <div key={`${element.name}-${rate.value}`}>
                  <input type="radio" id={`${element.name}-${rate.value}`} name={element.name} value={rate.value} />
                  <label htmlFor={`${element.name}-${rate.value}`}>{rate.text}</label>
                </div>
              ))}
            </div>
          );
        }

      case 'checkbox':
        return (
          <div key={index}>
            <p>{element.name}</p>
            <form>
              {element.choices.map((choice: any) => (
                <div key={choice}>
                  <input type="checkbox" id={choice} name={element.name} value={choice} />
                  <label htmlFor={choice}>{choice}</label>
                </div>
              ))}
            </form>
          </div>
        );

      case 'comment':
        console.log(index);
        return (
          <div key={index}>
            <p>{element.title}</p>
            <textarea name={`text-${index.toString()}`} rows={4} cols={20} />
          </div>
        );

      default:
        break;
    }
  }



  const [formJSON, setFormJSON] = useState<string>(JSON.stringify(initJSON));
  const [componentList, setComponentList] = useState<Array<React.JSX.Element>>([]);
  const [openText, setOpenText] = useState<boolean>(false);
  const [openRadio, setOpenRadio] = useState<boolean>(false);
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  const [radioOptions, setRadioOptions] = useState<any>([]);
  const [dropdownOptions, setDropdownOptions] = useState<any>([]);
  const [textData, setTextData] = useState<string>("");

  const [isEditText, setIsEditText] = useState<boolean>(false);
  const [isEditRadio, setIsEditRadio] = useState<boolean>(false);
  const [isEditDropdown, setIsEditDropdown] = useState<boolean>(false);
  const [editIndex, setEditIndex] = useState<number>(0);

  const [surveyModel, setSurveyModel] = useState<any>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);

  useEffect(() => {
    const jsonObj = JSON.parse(formJSON);
    if (!formJSON) return;
    const pages = jsonObj.pages;
    if (!pages) return;
    const renderedComponents: React.JSX.Element[] = [];
    pages.forEach((page: any) => {
      const elements = page.elements;
      elements.forEach((element: any) => {
        renderedComponents.push(
          <div className="flex flex-row justify-between m-2 p-2 bg-white rounded-md border-black border-1" key={elements.indexOf(element)}>
            <div className="flex">{getComponent(element, elements.indexOf(element))}</div>
            <div className="flex flex-col">
              <IconButton onClick={
                () => {
                  const index = elements.indexOf(element);
                  jsonObj.pages[0].elements.splice(index, 1);
                  setFormJSON(JSON.stringify(jsonObj));

                }}><Delete /></IconButton>
              <IconButton onClick={
                () => {
                  const index = elements.indexOf(element);
                  jsonObj.pages[0].elements.splice(index, 0, element);
                  setFormJSON(JSON.stringify(jsonObj));
                }
              }><ContentCopy /></IconButton>
              <IconButton onClick={
                () => {
                  const optionData = element;
                  console.log('optionData', optionData)
                  //open dialog
                  if (element.type === 'radiogroup') {
                    setRadioOptions({});  //TODO: fix this later with reducer or better state management
                    setRadioOptions(optionData);
                    setIsEditRadio(true);
                    setEditIndex(elements.indexOf(element));
                    setOpenRadio(true);
                  } else if (element.type === 'dropdown') {
                    setRadioOptions({});
                    setDropdownOptions(optionData);
                    setIsEditDropdown(true);
                    setEditIndex(elements.indexOf(element));
                    setOpenDropdown(true);
                  } else {
                    setTextData("");
                    setTextData(element.title);
                    setIsEditText(true);
                    setEditIndex(elements.indexOf(element));
                    setOpenText(true);
                  }
                }}><Edit /></IconButton>
            </div>
          </div>
        )
      });
    });
    setComponentList(renderedComponents);
    //return renderedComponents;
  }, [formJSON]);

  const [saving, setSaving] = useState<boolean>(false);

  const surveyComplete = useCallback((survey: Model) => {
    //  // const userId = /* ... Getting the user ID ... */
    //  const userId = "user-id-123";
    // survey.setValue("userId", userId);

    //   saveSurveyResults(
    //     "https://your-web-service.com/" + SURVEY_ID,
    //     survey.data
    //   )
    const results = JSON.stringify(survey.data);
    alert(results)
  }, []);
  // console.log(componentList);
  const handlePreview = () => {
    const survey = new Model(formJSON);
    survey.onComplete.add(surveyComplete);
    setIsPreview(!isPreview);
    setSurveyModel(survey);
  }


  return (
    <div className="flex flex-row h-screen w-screen justify-center items-center">
      <div className="flex flex-col max-h-** overflow-y-auto no-scrollbar py-[8px] px-[8px] border-[#575a5c] border-solid border-2 rounded-lg w-1/3 bg-[#dfe8ed] h-2/3 ">
        {isPreview ? <Survey model={surveyModel} /> :
          componentList.length === 0 ?
            <div className="flex h-full  rounded-md border-[#b0b3b5] border-dotted border-2 justify-center items-center"><p>Add Form Elements from the palette</p></div> :
            componentList.map((component) => component)}
      </div>
      <div className="flex flex-col w-1/6">
        {/* <Button className="m-2" onClick={addText}>Text</Button> */}
        {!isPreview &&
          <>
            <TextDialog formJSON={formJSON} setFormJSON={setFormJSON} open={openText} setOpen={setOpenText} setTextData={setTextData} textData={textData} isEdit={isEditText} setIsEdit={setIsEditText} index={editIndex} />
            <RadioDialog formJSON={formJSON} setFormJSON={setFormJSON} optionData={radioOptions} setOptionData={setRadioOptions} open={openRadio} setOpen={setOpenRadio} isEdit={isEditRadio} setIsEdit={setIsEditRadio} index={editIndex} />
            <DropdownDialog formJSON={formJSON} setFormJSON={setFormJSON} optionData={dropdownOptions} open={openDropdown} setOpen={setOpenDropdown} isEdit={isEditDropdown} setIsEdit={setIsEditDropdown} index={editIndex} />
          </>
        }
        <Button className="m-2" onClick={handlePreview}>{isPreview ? 'Edit' : 'Preview'}
        </Button>
        <SaveDialog formJSON={formJSON} setFormJSON={setFormJSON} open={saving} setOpen={setSaving} />
      </div>
    </div>
  );
}

export default FormArea;