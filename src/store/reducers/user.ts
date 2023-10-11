import { LOGGER, USER } from "../actions/actionType";

const initialState = {
    user: [],
    absen: [],
    totalPage: 1,
    logger: []
}

export interface UserState {
    UserReducer: {
        user?: Array<any>,
        absen?: Array<any>,
        totalPage?: number
    };
}


function UserReducer(state = initialState, action: any) {
    switch (action.type) {
        case USER:
            return {
                ...state,
                user: action.payload.userInfo,
                absen: action.payload.absen,
                totalPage: action.payload.totalPages,
            }
        case LOGGER:
            return {
                ...state,
                logger: action.payload.data,
            }
        default:
            return state;
    }
}

export default UserReducer