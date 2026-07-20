/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VillageAsset {
  assetId: string;
  name: string;
  type: 'Land' | 'Building' | 'Vehicle' | 'Equipment' | 'Inventory';
  value: number;
  condition: 'Good' | 'Minor Damage' | 'Hard Damage';
  location: {
    lat: number;
    lng: number;
  };
  qrTrackingCode: string;
  registeredAt: string;
}
