import { describe, expect, it } from 'vitest';
import { readingMinutes } from '../src/lib/curiosities';
import { dayEditorUrl } from '../src/lib/editor';
import {
  countOpenTasks,
  dayProgress,
  daysUntilTrip,
  drivingLevel,
  hikeLevel,
  osloDate,
  targetDay,
  temporalState,
  tripPhase,
  validSimulatedDate,
} from '../src/lib/trip';

describe('calendario del viaggio', () => {
  it('calcola la data nel fuso di Oslo anche vicino a mezzanotte', () => {
    expect(osloDate(new Date('2026-08-08T22:30:00Z'))).toBe('2026-08-09');
    expect(osloDate(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01');
  });

  it('gestisce prima, durante e dopo il viaggio', () => {
    expect(tripPhase('2026-08-08')).toBe('before');
    expect(tripPhase('2026-08-17')).toBe('during');
    expect(tripPhase('2026-08-24')).toBe('after');
    expect(targetDay('2026-08-01')).toBe('2026-08-09');
    expect(targetDay('2026-09-01')).toBe('2026-08-23');
    expect(dayProgress('2026-08-17')).toBe(9);
    expect(daysUntilTrip('2026-08-01')).toBe(8);
  });

  it('deriva lo stato temporale senza nascondere le date', () => {
    expect(temporalState('2026-08-16', '2026-08-17')).toBe('past');
    expect(temporalState('2026-08-17', '2026-08-17')).toBe('today');
    expect(temporalState('2026-08-18', '2026-08-17')).toBe('future');
  });

  it('accetta solo date simulate ISO valide', () => {
    expect(validSimulatedDate('2026-08-17')).toBe('2026-08-17');
    expect(validSimulatedDate('17-08-2026')).toBeNull();
    expect(validSimulatedDate('2026-99-99')).toBeNull();
  });
});

describe('tempo di lettura', () => {
  it('restituisce almeno un minuto e arrotonda per eccesso', () => {
    expect(readingMinutes('')).toBe(1);
    expect(readingMinutes(Array.from({ length: 201 }, () => 'parola').join(' '))).toBe(2);
  });
});

describe('editing da telefono', () => {
  it('punta al file giornaliero esatto sul branch main', () => {
    expect(dayEditorUrl('2026-08-17')).toBe('https://github.com/divi-94/miliopolo.norvegia26/edit/main/app/src/content/days/2026-08-17.md');
  });
});

describe('indicatori', () => {
  it('deriva i quattro livelli di guida', () => {
    expect(drivingLevel(30)).toBe('zero');
    expect(drivingLevel(31)).toBe('poca');
    expect(drivingLevel(121)).toBe('media');
    expect(drivingLevel(241)).toBe('molta');
    expect(drivingLevel(null)).toBeNull();
  });

  it('deriva il livello trekking da durata e dislivello', () => {
    expect(hikeLevel()).toBeNull();
    expect(hikeLevel({})).toBe('variabile');
    expect(hikeLevel({ durationHours: 3, elevationGainM: 300 })).toBe('leggera');
    expect(hikeLevel({ durationHours: 5 })).toBe('media');
    expect(hikeLevel({ elevationGainM: 1300 })).toBe('impegnativa');
  });

  it('conta soltanto le checkbox Markdown aperte', () => {
    expect(countOpenTasks('- [ ] Uno\n- [x] Due\n* [ ] Tre')).toBe(2);
  });
});
