import { describe, expect, test } from 'bun:test';
import { BookingError, DemoBookingEngine } from '../src/mocks/booking-engine';
const start=new Date(Date.now()+4*86400000).toISOString();
function request(e:DemoBookingEngine,key='one',at=start,now=Date.now()){return e.hold('maternal','Example patient',at,key,now);}
describe('demo booking invariants',()=>{
 test('a held resource cannot be double booked and retries are idempotent',()=>{const e=new DemoBookingEngine();const first=request(e);expect(request(e).id).toBe(first.id);expect(()=>request(e,'other')).toThrow(BookingError);expect(e.list()).toHaveLength(1);});
 test('an expired hold releases the resource and cannot confirm',()=>{const e=new DemoBookingEngine();const now=Date.now();const first=request(e,'first',start,now);const second=request(e,'second',start,now+600001);expect(second.id).not.toBe(first.id);expect(()=>e.confirm(first.id,now+600001)).toThrow(BookingError);});
 test('replacement failure preserves the original booking',()=>{const e=new DemoBookingEngine();const original=e.confirm(request(e).id);const occupied=new Date(Date.parse(start)+86400000).toISOString();e.confirm(request(e,'another',occupied).id);expect(()=>e.reschedule(original.id,occupied,'replace')).toThrow(BookingError);expect(e.list().find(a=>a.id===original.id)?.status).toBe('confirmed');});
 test('replacement succeeds atomically and reuses its request key',()=>{const e=new DemoBookingEngine();const original=e.confirm(request(e).id);const next=new Date(Date.parse(start)+86400000).toISOString();const replacement=e.reschedule(original.id,next,'replace');expect(replacement.status).toBe('confirmed');expect(e.list().find(a=>a.id===original.id)?.status).toBe('cancelled');expect(e.reschedule(original.id,next,'replace').id).toBe(replacement.id);});
 test('cancel is idempotent and releases the resource',()=>{const e=new DemoBookingEngine();const a=e.confirm(request(e).id);e.cancel(a.id);e.cancel(a.id);expect(request(e,'new').status).toBe('held');});
 test('request key cannot be replayed with different parameters',()=>{const e=new DemoBookingEngine();request(e);expect(()=>request(e,'one',new Date(Date.parse(start)+86400000).toISOString())).toThrow(BookingError);});
});
