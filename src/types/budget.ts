/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface APBDesBudget {
  year: number;
  revenue: {
    total: number;
    sectors: { name: string; value: number }[];
  };
  expenditure: {
    total: number;
    sectors: { name: string; value: number }[];
  };
  absorptionRate: number; // percentage
}
