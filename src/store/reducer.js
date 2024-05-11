import { SET_LIST_BOOKING,SET_BOOKING_CODE, SET_TABLE_ID, SET_STATUS, SET_TIMELINE, SET_LIST_TABLE, SET_LIST_MENU, SET_LIST_ORDER } from "./constants";
const initState = {
    listBooking:[], 
    listTable: [], 
    listMenu: [], 
    listOrder:[], 
    listBookingStorage:[], 
    booking_code: '', 
    table_id: [], 
    status: {
        waiting: true, 
        sorted:true, 
        accepted:true, 
        canceled:false
    }, 
    timeline: {
        overtime:false, 
        coming: false
    }, 

}

function reducer(state, action)
{
    switch(action.type)
    {
        case SET_BOOKING_CODE: 
            return {...state, booking_code: action.payload}
        case SET_TABLE_ID: 
            return {...state, table_id: action.payload}
        case SET_STATUS: 
            var statusObj = action.payload;
            return {...state, status:statusObj }
        case SET_LIST_BOOKING:
            return {...state, listBooking:action.payload, listBookingStorage:action.payload} 
        case SET_TIMELINE: 
            var {name, checked} = action.payload;
            var newTimeline = {...action.timeline, [name]: checked}
            return {...state, timeline:newTimeline}
        case SET_LIST_TABLE: 
            return {...state, listTable:action.payload} 
        case SET_LIST_MENU: 
            return {...state, listMenu:action.payload}
        case SET_LIST_ORDER: 
            return {...state, listOrder: action.payload}
        default: 
            throw new Error('Invalid action')
    }
    
}
export {initState};
export default reducer;

