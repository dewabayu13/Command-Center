/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VillageProject {
  projectId: string;
  name: string;
  budget: number;
  expenditure: number;
  contractor: string;
  progress: number; // 0 to 100
  startDate: string;
  endDate: string;
  location: {
    lat: number;
    lng: number;
  };
  photoBefore: string;
  photoAfter: string;
  status: 'Planned' | 'On Progress' | 'Completed' | 'Delayed';
}
