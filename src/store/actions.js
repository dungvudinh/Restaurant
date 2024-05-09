import { FILTER_BOOKING_BY_CODE, FILTER_BOOKING_BY_TABLE, SET_BOOKING_CODE, SET_LIST_BOOKING, UPDATE_LIST_BOOKING, SET_TABLE_ID, 
FILTER_BOOKING_BY_STATUS, FILTER_BOOKING, SET_STATUS, 
SET_TIMELINE,SET_LIST_MENU, 
SET_LIST_TABLE} from "./constants";
export const updateListBooking = payload =>({type:UPDATE_LIST_BOOKING, payload})
export const setListBooking = payload =>({type:SET_LIST_BOOKING, payload})
export const filterBookingByCode = ()=>({type:FILTER_BOOKING_BY_CODE})
export const filterBookingByTable = (table_id)=>({type:FILTER_BOOKING_BY_TABLE, payload:table_id})
export const setBookingCode = (booking_code) =>({type:SET_BOOKING_CODE, payload:booking_code})
export const setTableId = (table_id)=>({type:SET_TABLE_ID, payload:table_id})
export const filterBookingByStatus = (status_name)=>({type:FILTER_BOOKING_BY_STATUS, payload:status_name})
export const filterBooking = (booking_code, table_id, status)=>({type:FILTER_BOOKING, payload: {booking_code, table_id, status}})
export const setStatus = (statusObj)=>({type:SET_STATUS, payload:statusObj})
export const setTimeline = (name, checked)=>({type:SET_TIMELINE, payload:{name, checked}})
export const setListTable = (payload)=>({type:SET_LIST_TABLE, payload})
export const setListMenu = (payload) =>({type:SET_LIST_MENU, payload})