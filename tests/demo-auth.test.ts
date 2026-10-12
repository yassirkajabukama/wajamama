import { describe,expect,test } from 'bun:test';
import { demoOtpStatus,resendSeconds } from '../src/mocks/demo-auth';
describe('development sign-in recovery',()=>{
 const sent=1000000;
 test('wrong, expired and offline states do not authenticate',()=>{expect(demoOtpStatus('000000',sent,sent+1,false)).toBe('wrong');expect(demoOtpStatus('246810',sent,sent+300001,false)).toBe('expired');expect(demoOtpStatus('246810',sent,sent+100,true)).toBe('offline');});
 test('resend cooldown expires independently of code lifetime',()=>{expect(resendSeconds(sent,sent+1000)).toBe(29);expect(resendSeconds(sent,sent+30000)).toBe(0);expect(demoOtpStatus('246810',sent,sent+30000,false)).toBe('valid');});
});
