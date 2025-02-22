
export const AUTHENTICATE = 'AUTHENTICATE'; 
export const LOGOUT_USER = 'LOGOUT_USER';
export const SAVE_ASN = 'SAVE_ASN';
export const GET_PROFILE = 'GET_PROFILE';

const baseUrl = 'http://localhost:7000/'


export const authenticate = (token) => {
  return dispatch => {
    dispatch({ 
      type: AUTHENTICATE,
      token: token
     });
  };
}

export const SignUpUser = (email,password,asn,name,photo,web,service)=>{
  return async dispatch =>{
    const response = await fetch(
      `${baseUrl}users/signup`,{
      method: 'POST',
      headers : {
          'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
          name : name,
          email:email,
          password:password,
          asn:asn,
          photo : photo,
          webURL : web,
          services : service
      })
    });

    const responseData = await response.json();
    if (responseData.error) {
      throw new Error(responseData.error.message);
    }

  }
}

export const getProfileDetails = (asn) => {
  return async (dispatch) => {
      const response = await fetch(`${baseUrl}/users/profile/${asn}`, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,  
              'Content-Type': 'application/json'
          }
      });

      const responseData = await response.json();

      if (responseData.error) {
          throw new Error(responseData.error.message);
      } else {
          dispatch({
              type: GET_PROFILE,
              payload: responseData
          });
      }
  };
};


export const loginUser = (email, password)=>{
    const loginUrl = `${baseUrl}users/login`;

    return async dispatch=>{
        const response = await fetch(loginUrl,{
            method: 'POST',
            headers : {
                'content-type' : 'application/json'
            },
            body: JSON.stringify({
                email:email,
                password:password
            })
        });
        const responseData = await response.json();
    
        if (responseData.error) {
          throw new Error(responseData.error.message);
        }
        
        dispatch(
          authenticate(
            responseData.token
          )
        );
        saveDataToStorage(responseData.token);
    }
}


const saveDataToStorage = (token) => {
  localStorage.setItem('token',token);
};