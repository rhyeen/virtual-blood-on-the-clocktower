import { FunctionComponent, ReactElement } from 'react';

interface Props {
  text: string;
  onCopy: (copySuccessMessage: string) => void;
}

export const CopyText: FunctionComponent<Props> = (props): ReactElement => {

  const copyTextToClipboard = async () => {
    const text = props.text.trim();
    try {
      await navigator.clipboard.writeText(text);
      props.onCopy('📋 Copied to clipboard: "' + text + '"');
    } catch (err) {
      props.onCopy('🔴🔴🔴 FAILED to copy: ' + text + ' --- ' + err);
    }
  };

  return (
    <span className="copyText" onClick={copyTextToClipboard}>📋 {props.text}</span>
  );
}
