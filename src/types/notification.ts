/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VillageNotification {
  id: string;
  title: string;
  description: string;
  category: 'letter' | 'finance' | 'tax' | 'meeting' | 'attendance' | 'complaint';
  timestamp: string;
  read: boolean;
}
