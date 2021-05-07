import { 
    FETCHING_USER,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAILURE,
    LOGGING_USER,
    LOG_USER_SUCCESS,
    LOG_USER_FAILURE,
    LOG_OUT,
    CLEAR_USERDATA
} from '../constants'

const initialState = {
    user: [],
    isFetching: false,
    error: false,
    isLoggedIn: false,
}

export default function userReducer(state = initialState, action) {
    switch(action.type) {
        case FETCHING_USER:
            return {
                ...state,
                isFetching: true,
            }
        case FETCH_USER_SUCCESS:
            //console.log(JSON.stringify(action.data));
            return {
                ...state,
                isFetching: false,
                user: action.data,
                error: false,
            }
        case FETCH_USER_FAILURE:
            console.log("Error");
            return {
                ...state,
                isFetching: false,
                error: true,
            }
        case LOGGING_USER:
            return {
                ...state,
                isLoggedIn: false,
                isFetching: true,
                error: false,
            }
        case LOG_USER_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: false,
                isLoggedIn: true,
                user: action.data,
            }
        case LOG_USER_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: true,
                isLoggedIn: false,
            }
        case LOG_OUT:
            return {
                ...state,
                isLoggedIn: false,
            }
        case CLEAR_USERDATA:
            return {
                ...state,
                user: []
            }
        default:
            return state;
    }
}