/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  VILLAGE_HEAD = 'Village Head',
  SECRETARY = 'Secretary',
  TREASURER = 'Treasurer',
  ADMIN = 'Admin',
  OPERATOR = 'Operator',
  HAMLET_HEAD = 'Head of Hamlet',
  TAX_COLLECTOR = 'Tax Collector',
  PUBLIC_USER = 'Public User',
  KASI_PEMERINTAHAN = 'Kasi Pemerintahan',
  KASI_PELAYANAN = 'Kasi Pelayanan',
  KASI_KESEJAHTERAAN = 'Kasi Kesejahteraan'
}

export interface Employee {
  uid: string;
  fullName: string;
  role: UserRole;
  email: string;
  photoURL?: string;
  dusunId?: string;
  phoneNumber?: string;
}

export interface AuthUser {
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string;
  dusunId?: string;
  createdAt?: string;
}
