import React from 'react';
import { Bubble } from '../../../../components/Bubble';
import { RichText } from '../../../../components/RichText';
import ClassicAnswer from '../ClassicAnswer';

const AccurateMsg: React.FC<any> = (props) => {
  return (
    <Bubble>
      {props?.data?.qaResult && props?.data?.qaResult?.richTextFlag ? (
        <RichText content={props?.data?.qaResult?.answer[0]?.content || ''} />
      ) : null}
      {props?.data?.qaResult && !props?.data?.qaResult?.richTextFlag && (
        <ClassicAnswer
          openMediaUrl={props.ctx.requests.openMediaUrl}
          answerList={props?.data?.qaResult?.answer || []}
        />
      )}
    </Bubble>
  );
};
export default AccurateMsg;
