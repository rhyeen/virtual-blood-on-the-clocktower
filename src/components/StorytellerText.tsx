import { FunctionComponent, ReactElement } from 'react';

interface Props {
  text: string;
  sendTo?: string;
}

export const StorytellerText: FunctionComponent<Props> = (props): ReactElement => {
  return (
    <span style={{ color: '#04727a' }}><span style={{
      fontWeight: 'bold',
    }}>Storyteller{props.sendTo ? `, send to ${props.sendTo}` : ''}:</span> {props.text}</span>
  );
}
