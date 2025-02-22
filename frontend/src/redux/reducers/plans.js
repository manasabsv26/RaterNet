import {
    FETCH_PLANS,
    ADD_PLAN,
    UPDATE_PLAN,
    DELETE_PLAN
} from '../actions/plans'

const initialState = {
    plans: []
}

export default (state = initialState,action)=>{
    switch (action.type){
        case FETCH_PLANS:
            console.log("action.payload.data.plan ",action.payload.data.plan)
            return {
                plans : action.payload
            }
        case ADD_PLAN:
            console.log(action.payload);
            return {
                ...state,
                plans: {
                    ...state.plans,
                    data: {
                        plan: [...(state.plans.data?.plan || []), action.payload]  // Ensure it's an array
                    }
                }
            };
        case UPDATE_PLAN : 
        console.log("Updating Plan:", action.payload);
        console.log("Before Update:", state.plans.data.plan.find(p => p._id === action.payload._id));
        console.log("After Update:", state.plans.data.plan.map(p => p._id === action.payload._id ? { ...p, ...action.payload } : p));
        return {
            ...state,
            plans: {
                ...state.plans,
                data: {
                    ...state.plans.data,
                    plan:  state.plans.data.plan.map(existingPlan =>
                        existingPlan._id === action.payload._id
                            ? { ...existingPlan, ...action.payload }
                            : existingPlan
                    ) // Ensure it's an array
                }
            }
        };
        case DELETE_PLAN : 
            return {
                ...state,
                plans:{
                    ...state.plans,
                    data:{
                        ...state.plans.data,
                        plan : state.plans.data.plan.filter(plan=>plan._id!==action.plan_id)
                    }
                } 
            }
        default :
            return state;
    }
}