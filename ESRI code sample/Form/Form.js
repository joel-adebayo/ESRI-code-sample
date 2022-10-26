import React from "react";
import Button from "../../../buttons/Button";
import { useEffect } from "react";
import classes from '../picarro_form/Upload_MidTex_form_Picarro.module.css'
import instance from "../../../../api/api";
import { useReducer } from 'react';
import useInput from '../hooks/use-input';

const initialState = {
    townNames: [],
    mapGrids: [],
    mapNumbers: [],
    submit: false
  };

const formStateReducer = (state, action) => {
    switch (action.type){
        case 'TOWN_NAMES':
            return { ...state, townNames: action.value };
        case 'MAP_GRIDS':
            return { ...state, mapGrids: action.value };
        case 'MAP_NUMBERS':
            return { ...state, mapNumbers: action.value };
        case 'SUBMIT':
            return { ...state, submit: action.value };
        default: 
            return state
        }
    }
        
const Upload_Files_Form = () => {

    const [state, dispatch] = useReducer(
        formStateReducer,
        initialState
      );

    //validation functions that is passed to the custom hook
    // If the input value is included in a list of available town names, map grids and map numbers, the input is valid.
    const isTown = (value) => lowerCaseTownNames.includes(value)
    const isMapNumber = (value) => state.mapNumbers.includes(value)
    const isMapGrid = (value) => state.mapGrids.includes(value)
    
    // Use the custom user-input hook to handle input changes and validation.
    const {
        value: enteredTown,
        isValid: enteredTownIsValid,
        hasError: townInputHasError,
        valueChangeHandler: townChangeHandler,
        inputBlurHandler: townBlurHandler,
        reset: resetTown,
      } = useInput(isTown);

    const {
        value: enteredMapGrid,
        isValid: enteredMapGridIsValid,
        hasError: mapGridInputHasError,
        valueChangeHandler: mapGridChangeHandler,
        inputBlurHandler: mapGridBlurHandler,
        reset: resetMapGrid,
      } = useInput(isMapGrid);

    const {
        value: enteredMapNumber,
        isValid: enteredMapNumberIsValid,
        hasError: mapNumberInputHasError,
        valueChangeHandler: mapNumberChangeHandler,
        inputBlurHandler: mapNumberBlurHandler,
        reset: resetMapNumber,
      } = useInput(isMapNumber);

      let formIsValid = false

      if (enteredTownIsValid && enteredMapNumberIsValid && enteredMapGridIsValid) {
        formIsValid = true;
      }
    
    // Send an API request to get all the town names, map grids and map numbers when the componenet is rendered
    useEffect(()=>{

        state.mapGrids || instance({
            method:'get',
            url: `###/api/get_file_info`,
        }).then( res => {
            const {town_names, map_numbers, map_grids} = res.data
            dispatch({type: 'TOWN_NAMES', value: town_names})
            dispatch({type: 'MAP_GRIDS', value: map_grids})
            dispatch({type: 'MAP_NUMBERS', value: map_numbers})
        }
            
        )
    },[state.mapGrids])

    // On submit, send form data to the backend
    useEffect(()=>{
        const formData = new FormData();

        const submittedData = {
            town: state.town,   
            gdo_map_grid: state.mapgrid,
            map_number: state.mapNumber, 
        }

        for (const x in submittedData){
            formData.append(x, submittedData[x])
        }

        state.submit && instance({
            url: `###/api/form_submit/`,
            method: "POST",
            data: formData,
            headers:{
                'Content-Type': 'multipart/form-data'
            }
            
        }).then((res)=>{
            dispatch({type: 'SUBMIT', value: false})
            resetTown();
            resetMapGrid()
            resetMapNumber()
        }

        ).catch((res)=>{
            dispatch({type: 'SUBMIT', value: false})
        })

        return ()=>{
            
        }
    },[state.submit])

    
    // Handle form submission. If all validations have passed, send form to the backend.
    const formSubmissionHandler = (e) => {
        e.preventDefault() 

        if (!formIsValid) {
            return;
          }
        dispatch({type: 'SUBMIT', value: true})
    }

    // Conditionally render styles to inputs if depending on if the input has errors.
    const townClasses = townInputHasError ? 'form-control invalid' : 'form-control';
    const mapGridClasses = mapGridInputHasError ? 'form-control invalid' : 'form-control';
    const mapNumberClasses = mapNumberInputHasError ? 'form-control invalid' : 'form-control';

    return (

        <form className={`form-group`} style={{ width: '80%' }} onSubmit={formSubmissionHandler} autoComplete="off">
            <div className={classes.control}>
                <label for="town">Town Name</label>
                <input className = {townClasses} type="text" id="town"  onBlur = {townBlurHandler} onChange={townChangeHandler} value={enteredTown} ></input>
                {townInputHasError && <p className="error-text">Please enter a valid town.</p>}
            </div>
        
            <div className={classes.control}>
                <label for="mapGrid">GDO map grid</label>
                <input className = {mapGridClasses} type="text" id="mapGrid"  onBlur = {mapGridBlurHandler} onChange = {mapGridChangeHandler} value = {enteredMapGrid} ></input>
                {mapGridInputHasError && <p className="error-text">Please enter a valid map grid.</p>}
            </div>
           
            <div className={classes.control}>
                <label for="mapNumber">Map Number</label>
                <input className = {mapNumberClasses} type="text" id="mapNumber" onBlur = {mapNumberBlurHandler}  onChange = {mapNumberChangeHandler} value = {enteredMapNumber} ></input>
                {mapNumberInputHasError && <p className="error-text">Please enter a valid map number.</p>}
            </div>
            
            <Button type='submit' label={'Upload'} ></Button>

        </form>
    )
    }

export default Upload_Files_Form