import type { Appointment } from '../types/domain';
import { services } from './catalog';
export class BookingError extends Error { constructor(public code: 'taken' | 'expired' | 'invalid' | 'offline' | 'cutoff') { super(code); } }
/** In-memory development engine. Never used for production confirmation. */
export class DemoBookingEngine {
 private records: Appointment[] = [];
 private sequence = 0;
 list() { return this.records.map(a => ({ ...a })); }
 clear() { this.records = []; this.sequence = 0; }
 private expire(now: number) { this.records.forEach(a => { if(a.status === 'held' && a.expiresAt! <= now) a.status = 'expired'; }); }
 hold(serviceId: string, patient: string, start: string, requestKey: string, now = Date.now(), replacing?: string) {
  this.expire(now);
  const prior = this.records.find(a => a.requestKey === requestKey);
  if (prior) { if(prior.serviceId !== serviceId || prior.patient !== patient || prior.start !== start) throw new BookingError('invalid'); return { ...prior }; }
  const service = services.find(s => s.id === serviceId);
  if (!service || !patient.trim() || !Number.isFinite(Date.parse(start)) || Date.parse(start) <= now) throw new BookingError('invalid');
  const end = Date.parse(start) + service.minutes * 60000;
  if (this.records.some(a => a.id !== replacing && ['held','confirmed','checked_in','in_progress'].includes(a.status) && Date.parse(a.start) < end && Date.parse(a.start) + (services.find(s=>s.id === a.serviceId)?.minutes ?? 30)*60000 > Date.parse(start))) throw new BookingError('taken');
  const record: Appointment = { id: `DEMO-${++this.sequence}`, serviceId, patient, start, requestKey, status: 'held', expiresAt: now + 600000 };
  this.records.push(record); return {...record};
 }
 confirm(id: string, now = Date.now()) { this.expire(now); const a = this.records.find(a=>a.id === id); if(!a) throw new BookingError('invalid'); if(a.status === 'confirmed') return {...a}; if(a.status !== 'held') throw new BookingError('expired'); a.status='confirmed'; return {...a}; }
 cancel(id: string, now = Date.now()) { const a = this.records.find(a=>a.id === id); if(!a) throw new BookingError('invalid'); if(a.status === 'cancelled') return; if(!['held','confirmed'].includes(a.status)) throw new BookingError('invalid'); if(a.status === 'confirmed' && Date.parse(a.start) - now < 3600000) throw new BookingError('cutoff'); a.status='cancelled'; }
 reschedule(id: string, start: string, key: string, now=Date.now(), heldId?: string) {
  const old = this.records.find(a=>a.id === id); if(!old) throw new BookingError('invalid');
  const existing = this.records.find(a=>a.requestKey === key); if(existing) { if(existing.start!==start) throw new BookingError('invalid'); return {...existing}; }
  if(old.status !== 'confirmed') throw new BookingError('invalid'); if(Date.parse(old.start)-now < 3600000) throw new BookingError('cutoff');
  const reserved = heldId ? this.records.find(a=>a.id===heldId) : undefined;
  if (heldId && (!reserved || reserved.status!=='held' || reserved.expiresAt!<=now || reserved.start!==start || reserved.serviceId!==old.serviceId || reserved.patient!==old.patient)) throw new BookingError('expired');
  const next = reserved ?? this.hold(old.serviceId,old.patient,start,key,now,old.id); const confirmed=this.confirm(next.id,now); const stored=this.records.find(a=>a.id===confirmed.id)!; stored.requestKey=key; old.status='cancelled'; return {...stored};
 }
}
