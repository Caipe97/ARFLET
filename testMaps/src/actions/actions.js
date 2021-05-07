import { 
    LOGGING_USER,
    LOG_USER_SUCCESS,
    LOG_USER_FAILURE,
    LOG_OUT,
    CLEAR_USERDATA,

    FETCHING_USER,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
} from '../constants'

export function fetchUser(){
    return (dispatch) => {
        dispatch(getUser());
        return (fetch('http://10.0.2.2:3000/api/users'))
        .then( res => res.json())
        .then( json => {
            return(dispatch(getUserSuccess(json)))
        })
        .catch( err => dispatch(getUserFailure(err)))
    }
}

export function loginUser(inputUserType, inputEmail, inputPassword){
    return(dispatch) => {
        dispatch(loggingUser());
        return (fetch('http://10.0.2.2:3000/api/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userType: inputUserType,
                email: inputEmail,
                password: inputPassword
            })
        }))
        .then(res => res.json())
        .then( json => {
            console.log(json)
            if(json.id == -1){
                return(dispatch(logUserFailure()));
            }
            json.data.address = JSON.parse(json.data.address);
            if(json.data.carId){ //Es un transport
                json.data.transportTypes = JSON.parse(json.data.transportTypes)
            }
            return(dispatch(logUserSuccess(json)));
        })
        .catch( err => dispatch(logUserFailure())) //Error de autenticación
    }
}

export function logOutUser(){
    return (dispatch) => {
        dispatch(logOut())
    }
}
export function clearUser(){
    return (dispatch) => {
        dispatch(clearUserData())
    }
}

function loggingUser(){
    return {
        type: LOGGING_USER
    }
}

function logUserSuccess(data){
    return {
        type: LOG_USER_SUCCESS,
        data: data
    }
}
function logUserFailure(){
    return {
        type: LOG_USER_FAILURE
    }
}

function getUser() {
    return {
        type: FETCHING_USER
    }
}

function getUserSuccess(data) {
    return {
        type: FETCH_USER_SUCCESS,
        data: data
    }
}

function getUserFailure() {
    return {
        type: FETCH_USER_FAILURE
    }
}
function logOut() {
    return {
        type: LOG_OUT
    }
}
function clearUserData() {
    return {
        type: CLEAR_USERDATA
    }
}