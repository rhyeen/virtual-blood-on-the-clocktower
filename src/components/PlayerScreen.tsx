import { FunctionComponent, ReactElement } from 'react';
import { Character, Trait } from '../entities/characters';
import { CharacterRecord } from './CharacterRecord';
import { TraitRecord } from './TraitRecord';

interface Props {
  characters: Character[];
  traits: Trait[];
  updateCharacter: (index: number, character: Character) => void;
  updateTrait: (index: number, trait: Trait) => void;
}

export const PlayerScreen: FunctionComponent<Props> = (props): ReactElement => {
  return (
    <div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: '4px',
      }}>
        <h3>Characters</h3>
        { props.characters.map((character, index) => {
          return (
            <div key={index}>
              <CharacterRecord character={character} update={(ch) => props.updateCharacter(index, ch)} />
            </div>
          );
        }) }
        <h3>Traits</h3>
        { props.traits.map((trait, index) => {
          return (
            <div key={index + props.characters.length}>
              <TraitRecord trait={trait} update={(tr) => props.updateTrait(index, tr)} />
            </div>
          );
        }) }
      </div>
    </div>
  );
}
