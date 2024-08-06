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
            return {
                plans : action.payload
            }
        case ADD_PLAN:
            return {
                plans: state.plans.concat(action.payload)
            }
        case UPDATE_PLAN : 
            for(var i in state.notes){
                if(state.plans[i]._id === action.plan._id){
                    state.plans[i] = Object.assign(state.plans[i],action.plan)
                    break;
                }
            }
            return state;
        case DELETE_PLAN : 
            return {
                plans : state.plans.filter(plan=>plan._id!==action.plan_id)
            }
        default :
            return state;
    }
}