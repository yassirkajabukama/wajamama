import type { Copy } from '@/i18n';
export type AppointmentStatus = 'held' | 'confirmed' | 'checked_in' | 'in_progress' | 'completed' | 'expired' | 'cancelled' | 'no_show';
export type Service = { id: string; title: Copy; category: string; minutes: number; description: Copy };
export type Appointment = { id: string; serviceId: string; patient: string; start: string; status: AppointmentStatus; expiresAt?: number; requestKey: string };
export type Membership = 'none' | 'interest' | 'invited' | 'active' | 'declined' | 'left';
export type Post = { id: string; body: string; reported: boolean; author: string };
export type Consent = { purpose: 'terms' | 'ai' | 'previews' | 'group'; granted: boolean; version: '1'; at: string };
export type Learning = { id: string; title: Copy; category: string; summary: Copy; sections: Copy[]; minutes: number };
