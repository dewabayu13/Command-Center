/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Citizen {
  nik: string;
  noKK: string;
  fullName: string;
  gender: 'Male' | 'Female';
  birthPlace: string;
  birthDate: string;
  address: string;
  dusunId: string;
  education: string;
  occupation: string;
  poorStatus: boolean;
  aidRecipients: string[];
  location: {
    lat: number;
    lng: number;
  };
  status: 'Alive' | 'Deceased' | 'Migrated';
}
