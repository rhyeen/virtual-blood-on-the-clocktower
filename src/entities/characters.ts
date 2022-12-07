export class Trait {
  role: string;
  includeInGame: boolean;
  randomNumber: number;
  player?: string;

  constructor(role: string, includeInGame: boolean) {
    this.role = role;
    this.includeInGame = includeInGame;
    this.randomNumber = -1;
  }

  json(): any {
    return {
      role: this.role,
      includeInGame: this.includeInGame,
      randomNumber: this.randomNumber,
      player: this.player,
    };
  }

  static build(json: any): Trait {
    const t = new Trait(json.role, json.includeInGame);
    t.role = json.role;
    t.includeInGame = json.includeInGame;
    t.randomNumber = json.randomNumber;
    t.player = json.player;
    return t;
  }

  copy(): Trait {
    const tr = new Trait(this.role, this.includeInGame);
    tr.randomNumber = this.randomNumber;
    tr.player = this.player;
    return tr;
  }

  isDrunk(traits: Trait[]): boolean {
    return !!traits.find(trait => trait.role === 'Drunk' && this.player === trait.player);
  }
}

export type CharacterType = 'townsfolk' | 'minion' | 'villain' | 'outsiderGood' | 'outsiderEvil';

export class Character {
  includeInGame: boolean;
  randomNumber: number;
  killed: boolean;
  finalVoteUsed: boolean;
  role: string;
  player?: string;
  type: CharacterType;
  sharedWithVillainIfUnused: boolean;

  constructor(role: string, includeInGame: boolean, type: CharacterType) {
    this.includeInGame = includeInGame;
    this.randomNumber = -1;
    this.killed = false;
    this.finalVoteUsed = false;
    this.role = role;
    this.type = type;
    this.sharedWithVillainIfUnused = false;
  }

  json(): any {
    return {
      includeInGame: this.includeInGame,
      randomNumber: this.randomNumber,
      killed: this.killed,
      finalVoteUsed: this.finalVoteUsed,
      role: this.role,
      player: this.player,
      type: this.type,
      sharedWithVillainIfUnused: this.sharedWithVillainIfUnused,
    };
  }

  static build(json: any): Character {
    const c = new Character(json.role, json.includeInGame, json.type);
    c.includeInGame = json.includeInGame;
    c.randomNumber = json.randomNumber;
    c.killed = json.killed;
    c.finalVoteUsed = json.finalVoteUsed;
    c.role = json.role;
    c.player = json.player;
    c.type = json.type;
    c.sharedWithVillainIfUnused = json.sharedWithVillainIfUnuse;
    return c;
  }

  get unused(): boolean {
    return !this.player;
  }

  isDrunk(traits: Trait[]): boolean {
    return !!traits.find(trait => trait.role === 'Drunk' && this.player === trait.player);
  }

  get isGood(): boolean {
    return this.type === 'townsfolk' || this.type === 'outsiderGood';
  }

  get isEvil(): boolean {
    return !this.isGood;
  }

  registersAsEvil(traits: Trait[]): boolean {
    return this.isEvil || !!traits.find(trait => trait.role === 'Recluse' && this.player === trait.player);
  }

  copy(): Character {
    const ch = new Character(this.role, this.includeInGame, this.type);
    ch.randomNumber = this.randomNumber;
    ch.killed = this.killed;
    ch.finalVoteUsed = this.finalVoteUsed;
    ch.sharedWithVillainIfUnused = this.sharedWithVillainIfUnused;
    ch.player = this.player;
    return ch;
  }
}
