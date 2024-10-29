export interface ShipPosition {
  x: number;
  y: number;
}

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export interface Ship {
  position: ShipPosition;
  direction: boolean;
  length: number;
  type: ShipType;
}
