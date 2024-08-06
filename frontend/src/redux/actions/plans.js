export const FETCH_PLANS = 'FETCH_PLANS';
export const ADD_PLAN = 'ADD_PLAN';
export const UPDATE_PLAN = 'UPDATE_PLAN';
export const DELETE_PLAN = 'DELETE_PLAN';

const baseUrl = 'http://localhost:7000/'


export const fetchPlans = (id)=>{
    return async dispatch=>{
        const response = await fetch(baseUrl + "plan/options/" + id);
        const responseData = await response.json();
        
        if (responseData.error) {
        throw new Error(responseData.error.message);
        }else {
            dispatch({
                type : FETCH_PLANS,
                payload : responseData
            })
        }

    }
}

export const addPlan = (plan,file)=>{
    /*const data = new FormData();
    data.append('planData',JSON.stringify(plan));
    data.append('planFile',file);*/

    return async dispatch=>{
        const response = await fetch(baseUrl + "plan/options/" + plan._id,{
            method: 'POST',
            headers : {
                'content-type' : 'multipart-form/data'
            },
            body: JSON.stringify(plan)
        });
        const responseData = await response.json();
    
        if (responseData.error) {
          throw new Error(responseData.error.message);
        } 
        
        dispatch({
            type : ADD_PLAN,
            payload : responseData
        })
        
    }
}

export const updatePlan = (plan)=>{
    return async dispatch=>{
        const response = await fetch( baseUrl + "plan/options/" + plan._id ,{
            method: 'PUT',
            headers : {
                'content-type' : 'application/json'
            },
            body: JSON.stringify(plan)
        });
        const responseData = await response.json();
    
        if (responseData.error) {
          throw new Error(responseData.error.message);
        } 
        
        dispatch({
            type : UPDATE_PLAN,
            plan : plan
        })
        
    }
}

export const deletePlan = (plan_id)=>{
    return async dispatch=>{
        const response = await fetch( baseUrl + "plan/options/" + plan_id ,{
            method: 'DELETE',
            headers : {
                'content-type' : 'application/json'
            }
        });
        const responseData = await response.json();
    
        if (responseData.error) {
          throw new Error(responseData.error.message);
        } 
        
        dispatch({
            type : DELETE_PLAN,
            plan_id : plan_id
        })
        
    }
}