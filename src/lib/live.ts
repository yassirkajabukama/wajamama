import { createClient, type SupabaseClient } from '@supabase/supabase-js';
/** This module is opt-in. The shipped UI remains in explicit demo mode until the full live workflow is certified. */
const mode = process.env.EXPO_PUBLIC_DATA_MODE ?? 'demo';
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export function getLiveClient(): SupabaseClient {
 if (mode !== 'live') throw new Error('Live data mode is disabled; demo actions never call Supabase.');
 if (!url || !key || !/^https:\/\//.test(url)) throw new Error('Live mode requires a valid Supabase URL and publishable key.');
 // Until the native secure-storage/session lifecycle is integrated and tested, sessions stay in memory.
 return createClient(url, key, { auth:{ persistSession:false,autoRefreshToken:false,detectSessionInUrl:false }});
}
export async function sendPhoneOtp(client:SupabaseClient, phone:string){if(!/^\+[1-9]\d{7,14}$/.test(phone))throw new Error('Invalid E.164 phone number');const {error}=await client.auth.signInWithOtp({phone});if(error)throw error;}
export async function verifyPhoneOtp(client:SupabaseClient,phone:string,token:string){if(!/^\d{6,8}$/.test(token))throw new Error('Invalid OTP');const {data,error}=await client.auth.verifyOtp({phone,token,type:'sms'});if(error)throw error;if(!data.session)throw new Error('No authenticated session returned');return data.session;}
export type LiveBooking={id:string;status:string;start_at:string};
export async function holdSlot(client:SupabaseClient,args:{service_id:string;patient_id:string;start_at:string;request_key:string}):Promise<LiveBooking>{const {data,error}=await client.rpc('hold_slot',args);if(error)throw error;if(!data||typeof data!=='object'||typeof data.id!=='string'||typeof data.status!=='string'||typeof data.start_at!=='string')throw new Error('Invalid hold response');return data as LiveBooking;}
export async function confirmBooking(client:SupabaseClient,hold_id:string):Promise<LiveBooking>{const {data,error}=await client.rpc('confirm_booking',{hold_id});if(error)throw error;if(!data||typeof data!=='object'||typeof data.id!=='string'||typeof data.status!=='string'||typeof data.start_at!=='string')throw new Error('Invalid booking response');return data as LiveBooking;}
export async function cancelBooking(client:SupabaseClient,booking_id:string):Promise<LiveBooking>{const {data,error}=await client.rpc('cancel_booking',{booking_id});if(error)throw error;if(!data||typeof data!=='object'||typeof data.id!=='string'||typeof data.status!=='string'||typeof data.start_at!=='string')throw new Error('Invalid cancellation response');return data as LiveBooking;}
