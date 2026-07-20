/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Attendance {
  attendanceId: string;
  uid: string;
  fullName: string;
  role: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'Present' | 'Late' | 'Leave' | 'Absent';
  location?: {
    lat: number;
    lng: number;
  };
  notes?: string;
}
