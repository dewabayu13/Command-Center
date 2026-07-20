/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Letter {
  letterId: string;
  letterNo: string;
  title: string;
  applicantNIK: string;
  applicantName: string;
  type: 'Incoming' | 'Outgoing';
  status: 'Pending' | 'Verified' | 'Completed';
  requestedAt: string;
  completedAt?: string;
  signedBy?: string;
  qrVerificationCode?: string;
  fileURL?: string;
}
