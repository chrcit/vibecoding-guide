/*
 * The two invites the give-back page shows, all made up. Ana Lopez is on Kai's list with one guest
 * for the Lantern's birthday night; Lea Brandt is the same on the trial copy of Friday's list.
 */
export type InviteId = 'ana' | 'lea';

export interface Invite {
  id: InviteId;
  name: string;
  first: string;
  promoter: string;
  /** Guests the invite brings. */
  plus: number;
}

export const INVITES: Record<InviteId, Invite> = {
  ana: { id: 'ana', name: 'Ana Lopez', first: 'Ana', promoter: 'Kai', plus: 1 },
  lea: { id: 'lea', name: 'Lea Brandt', first: 'Lea', promoter: 'Kai', plus: 1 },
};

export const NIGHT = { day: 'Friday', date: '28 Nov', doors: '23:00', venue: 'The Lantern', address: 'Werftstraße 9 · through the courtyard' };

/** The door's expected count for Friday before Ana gave back, and Kai's list size. */
export const EXPECTED_BEFORE = 213;
export const KAI_SPOTS = 20;
