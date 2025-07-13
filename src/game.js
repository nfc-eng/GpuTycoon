export const SIZE_PRESETS = [
  { label: 'Small (10 racks)', capacity: 10, costMultiplier: 1, purchaseCost: 1000 },
  { label: 'Medium (100 racks)', capacity: 100, costMultiplier: 3, purchaseCost: 10000 },
  { label: 'Large (1k racks)', capacity: 1000, costMultiplier: 5, purchaseCost: 100000 },
  { label: 'Mega (10k racks)', capacity: 10000, costMultiplier: 7, purchaseCost: 1000000 },
];

export function createBuilding(preset) {
  return {
    size: preset,
    gpus: 0,
    gpuCost: 100 * Math.pow(2, preset.costMultiplier),
    gpuIncome: 1,
    incomePerTick: 0,
    cooling: {
      tier: 0,
      costs: [
        500 * preset.costMultiplier,
        2000 * preset.costMultiplier,
        10000 * preset.costMultiplier,
      ],
    },
  };
}

export class Game {
  constructor({ money, buildings }) {
    this.money = money;
    this.buildings = buildings;
  }

  static createInitial() {
    const initialMoney =
      SIZE_PRESETS[0].purchaseCost +
      2 * (100 * Math.pow(2, SIZE_PRESETS[0].costMultiplier));
    return new Game({ money: initialMoney, buildings: [] });
  }

  tick() {
    const income = this.buildings.reduce(
      (sum, b) => sum + b.incomePerTick,
      0,
    );
    return new Game({ money: this.money + income, buildings: this.buildings });
  }

  addBuilding(preset) {
    if (this.money < preset.purchaseCost) return this;
    const buildings = [...this.buildings, createBuilding(preset)];
    return new Game({ money: this.money - preset.purchaseCost, buildings });
  }

  buyGPU(index) {
    const b = this.buildings[index];
    if (!b || this.money < b.gpuCost) return this;
    const updated = {
      ...b,
      gpus: b.gpus + 1,
      incomePerTick: b.incomePerTick + b.gpuIncome,
    };
    const buildings = this.buildings.slice();
    buildings[index] = updated;
    return new Game({ money: this.money - b.gpuCost, buildings });
  }

  upgradeCooling(index) {
    const b = this.buildings[index];
    if (!b) return this;
    const { tier, costs } = b.cooling;
    if (tier >= costs.length - 1 || this.money < costs[tier]) return this;
    const updated = {
      ...b,
      cooling: { ...b.cooling, tier: tier + 1 },
    };
    const buildings = this.buildings.slice();
    buildings[index] = updated;
    return new Game({ money: this.money - costs[tier], buildings });
  }
}
