export class Trait {
  role: string;
  includeInGame: boolean;
  randomNumber: number;
  player?: string;

  constructor(role: string, includeInGame: boolean) {
    this.role = role;
    this.includeInGame = includeInGame;
    this.randomNumber = -1;
    // REMOVE
    if (this.role === 'Saint') {
      this.player = 'PInvestigator';
    } else if (this.role === 'Recluse') {
      this.player = 'PBedmaker';
    } else {
      this.player = 'PMedicine Doctor';
    }
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
    // REMOVE
    this.player = 'P' + role;
    if (role === 'Gravekeeper' || role === 'Gossipmonger' || role === 'Ravenkeeper') {
      this.player = undefined;
      this.sharedWithVillainIfUnused = true;
    }
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
