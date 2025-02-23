import { jwtDecode } from "jwt-decode";
export const FETCH_PLANS = 'FETCH_PLANS';
export const ADD_PLAN = 'ADD_PLAN';
export const UPDATE_PLAN = 'UPDATE_PLAN';
export const DELETE_PLAN = 'DELETE_PLAN';


const baseUrl = 'http://localhost:7000/'

export const fetchPlans = (id) => {
    return async (dispatch) => {
        try {
            const response = await fetch(baseUrl + `plan/options/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`  // Optional for protected routes
                }
            });

            const data = await response.json();

            if (response.ok) {
                dispatch({
                    type: FETCH_PLANS,
                    payload: data, // Send plans to the reducer
                });
            } else {
                throw new Error(data.message || "Failed to fetch plans.");
            }
        } catch (error) {
            console.error("Error fetching plans:", error);
            throw error;
        }
    };
};


export const addPlan = (plan,file)=>{
    /*const data = new FormData();
    data.append('planData',JSON.stringify(plan));
    data.append('planFile',file);*/
    const token = localStorage.getItem("token");
    let user = jwtDecode(token);
    plan.company_id = user.id;
    const data = JSON.stringify(plan)

    console.log("plans update data: ", data )

    return async dispatch=>{
        const response = await fetch(baseUrl + "plan/",{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: data
        });
        const responseData = await response.json();
    
        if (responseData.error) {
          throw new Error(responseData.error.message);
        } 
        
        dispatch({
            type : ADD_PLAN,
            payload : plan
        })
        
    }
}

export const updatePlan = (plan)=>{
    return async dispatch=>{
        const plan_copy = plan
        const token = localStorage.getItem("token");
        let user = jwtDecode(token);
        plan.company_id = user.id;
        const data = JSON.stringify(plan)

        console.log("plans update data: ", data )
        const response = await fetch( baseUrl + "plan/options/" + plan._id ,{
            method: 'PUT',
            headers : {
                'content-type' : 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: data
        });
        const responseData = await response.json();
    
        if (responseData.error) {
          throw new Error(responseData.error.message);
        } 

        console.log("Updated data: ", plan_copy)

        dispatch({
            type: UPDATE_PLAN,
            payload: plan_copy  // assuming backend sends the updated plan back
        });
        
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