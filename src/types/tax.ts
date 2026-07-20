/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Taxpayer {
  nop: string;
  nik: string;
  taxpayerName: string;
  amount: number;
  status: 'Paid' | 'Unpaid';
  dusunId: string;
  collectorId: string;
  location: {
    lat: number;
    lng: number;
  };
  paidAt?: string;
}
