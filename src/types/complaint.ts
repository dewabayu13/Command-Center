/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Complaint {
  complaintId: string;
  reporterName: string;
  category: string;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  photoURL?: string;
  status: 'Submitted' | 'In Progress' | 'Resolved';
  createdAt: string;
  responseTimeHours?: number;
}
