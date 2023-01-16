import React from 'react';
import { Bubble } from '../../../../components/Bubble';
import { RichText } from '../../../../components/RichText';

const DefaultMsg: React.FC<any> = (props) => {
  return (
    <Bubble>
      <RichText content={props?.data?.qaResult?.answer[0]?.content || ''} />
    </Bubble>
  );
};
export default DefaultMsg;
