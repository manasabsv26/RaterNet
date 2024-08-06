import { 
    LOGOUT_USER,
    AUTHENTICATE,
    GET_PROFILE,
  SAVE_ASN} from '../actions/auth';
  
  const initialState = {
    token: null,
    asn : null,
    profile : {}
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case AUTHENTICATE:
        return {
          ...state,
          token: action.token
        };
      case SAVE_ASN:
          return {
            ...state,
            asn : action.asn
          };
      case GET_PROFILE :
          return {
            ...state,
            profile : Object.assign(state.profile,action.payload)
          }
      case  LOGOUT_USER:
        return initialState;
      default:
        return state;
    }
  };