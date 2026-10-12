/** A fixed, visibly displayed development-only code; never an authentication credential. */
export const DEMO_CODE='246810';
export function demoOtpStatus(code:string,sentAt:number,now:number,offline:boolean):'offline'|'expired'|'wrong'|'valid'{if(offline)return 'offline';if(!sentAt||now-sentAt>300000)return 'expired';if(code!==DEMO_CODE)return 'wrong';return 'valid';}
export function resendSeconds(sentAt:number,now:number){return Math.max(0,Math.ceil((30000-(now-sentAt))/1000));}
