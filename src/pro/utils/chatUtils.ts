import { AnswerType } from './constants';

export const formatRecommends = (recommends: any) => {
  const questionList: any[] = [];
  recommends.map((item: any, index: number) => {
    questionList.push({
      question: item.recommendQuestion,
      id: item.id,
      sceneId: item.sceneId,
      index,
    });
  });
  return questionList;
};
export const getFileName = (fileName: string) => {
  const arr = fileName.substring(0, fileName.indexOf('.'));
  return arr[arr.length - 1];
};
export const getExtName = (fileName: string) => {
  const arr = fileName.split('.');
  return arr[arr.length - 1];
};
export const formatTaskAnswerNode = (qaInfos: any) => {
  const questionList: any[] = [];
  qaInfos.map((item: any, index: number) => {
    questionList.push({
      question: item.question?.question,
      id: item.id,
      sceneId: item.sceneId,
      index,
    });
  });
  return questionList;
};
//处理任务多轮禁止点击
export const getNoClickList = (list: any[]) => {
  const newList = JSON.parse(JSON.stringify(list));
  if (newList[newList.length - 1]?.answerType === AnswerType.SendMsg) return newList;
  let conversationId = '';
  let flag = false;
  //禁用多轮任务点击
  for (let i = newList.length - 1; i >= 0; i--) {
    //判断是否为多轮任务问答
    if (newList[i]?.answerType === AnswerType.TaskMsg) {
      conversationId = newList[i]?.conversationId;
      for (let j = newList.length - 1; j >= i; j--) {
        if (
          newList[j].isRhetorical &&
          newList[j].conversationId === conversationId &&
          newList[j]?.qaResult?.qaType === 6
        ) {
          //已跳出多轮
          flag = true;
          break;
        }
        if (newList[j].conversationId && newList[j].conversationId !== conversationId) {
          //已跳出多轮
          flag = true;
          break;
        }
      }
      break;
    }
  }
  // newList.forEach((item) => {
  //   if(item?.qaResult?.answerType === 4&&item?.conversationId !== conversationId){
  //     item.noClick = true
  //   }
  // })
  if (flag) {
    newList.forEach((item: { conversationId: string; isClick: boolean }) => {
      if (item?.conversationId === conversationId) {
        item.isClick = false;
      }
    });
  } else {
    newList.forEach((item: { conversationId: string; isClick: boolean }) => {
      if (item?.conversationId === conversationId) {
        item.isClick = true;
      } else {
        item.isClick = false;
      }
    });
  }
  return newList;
};

//处理图谱答案
const getKnowledgeGraphList = (res: any) => {
  const list: any[] = [];
  let answerText = res?.data?.answerText;

  if (!answerText) {
    return null;
  }
  if (answerText.includes('没有找到你想要的答案哦，我正在努力学习')) {
    return null;
  }
  if (res?.data?.answerTexts?.length > 0) {
    answerText = res?.data?.answerTexts?.join('<br />');
  }
  return {
    answerText,
    instanceVOList: list,
  };
};

//   resultType为答案类型
//-1: 查询错误
// 0: 无答案且知识点无关
// 1: 精确答案
// 2: 推荐答案
// 3: 无答案且知识点相关
// 4: 精确答案的推荐知识点
// 5: 推荐答案的知识点
// 6: 分类推荐的知识点
// 11: 客服问答
export const formatReceiveMsg = (msgData: any) => {
  const { resultType, qaResult, isRhetorical } = msgData;
  // let { qaType } = qaResult

  // let feedbackData = {
  //   validity: 0,
  //   followup: 0,
  // };
  //处理图谱答案
  if (msgData?.knowledgeGraphAnswer) {
    const knowledgeGraphAnswer = JSON.parse(msgData?.knowledgeGraphAnswer as string);
    msgData.knowledgeGraphAnswer = getKnowledgeGraphList(knowledgeGraphAnswer);
  }
  //处理pdf
  // if (qaResult?.relatedFiles) {
  //   qaResult?.relatedFiles?.forEach((item: any) => {
  //     item.name = item.name.replace('.pdf', '');
  //   });
  // }
  const dataTemplate = {
    [AnswerType.DefaultMsg]: {
      answerType: AnswerType.DefaultMsg,
      ...msgData,
    },
    [AnswerType.AccurateMsg]: {
      answerType: AnswerType.AccurateMsg,
      ...msgData,
    },

    [AnswerType.RecommendMsg]: {
      answerType: AnswerType.RecommendMsg,
      ...msgData,
    },
    [AnswerType.SubjectMsg]: {
      answerType: AnswerType.SubjectMsg,
      ...msgData,
    },
    [AnswerType.TaskMsg]: {
      answerType: AnswerType.TaskMsg,
      ...msgData,
    },
    [AnswerType.KnowledgeGraphMsg]: {
      answerType: AnswerType.KnowledgeGraphMsg,
      ...msgData,
    },
  };
  if (resultType === -1) return dataTemplate[AnswerType.DefaultMsg]; //报错
  if (isRhetorical === true && qaResult?.qaType === 6) return dataTemplate[AnswerType.AccurateMsg]; //多轮问答失败 不能变顺序

  if (isRhetorical === true) return dataTemplate[AnswerType.DefaultMsg]; //多轮反问  不能变顺序
  if (qaResult?.answerType === 4) return dataTemplate[AnswerType.TaskMsg]; //任务型问答 不能变顺序
  if (resultType === 9) return dataTemplate[AnswerType.AccurateMsg]; //多轮结果 不能变顺序

  if (resultType === 0) {
    if (msgData.knowledgeGraphAnswer) {
      return dataTemplate[AnswerType.KnowledgeGraphMsg];
    }
    return dataTemplate[AnswerType.DefaultMsg];
  }
  if (resultType === 1) {
    if (qaResult?.qaType === 1 && !qaResult?.answerLabelMap)
      return dataTemplate[AnswerType.AccurateMsg];
    if (msgData.knowledgeGraphAnswer) return dataTemplate[AnswerType.KnowledgeGraphMsg]; //图谱答案
    if (qaResult?.qaType === 2) return dataTemplate[AnswerType.DefaultMsg]; // 闲聊话术
    if (qaResult?.qaType === 1 && qaResult?.answerLabelMap) {
      // const qaObj: any = Object.values(qaResult?.answerLabelMap)[0];
      // const name = qaObj.name;
    }
  }
  if (resultType === 2) return dataTemplate[AnswerType.RecommendMsg]; //推荐
  if (qaResult?.qaType === 3) return dataTemplate[AnswerType.SubjectMsg];

  if (resultType === 3) return dataTemplate[AnswerType.DefaultMsg];

  if ((resultType === 4 || resultType === 5) && qaResult?.qaType !== 3)
    return dataTemplate[AnswerType.AccurateMsg];
  if (msgData.knowledgeGraphAnswer) return dataTemplate[AnswerType.KnowledgeGraphMsg]; //图谱答案

  if (resultType === 6 && qaResult?.qaType === 0) return dataTemplate[AnswerType.DefaultMsg];

  if (resultType === 6 && qaResult?.qaType === 0) return dataTemplate[AnswerType.RecommendMsg];
  // if (resultType === 11) return dataTemplate[AnswerType.AgainQues];
  return dataTemplate[AnswerType.DefaultMsg];
};

//处理词槽问题
export const formatSlot = (text: string, color = '#0075c2') => {
  if (
    (text && text.indexOf('@') == -1) ||
    (text && text.indexOf('$') == -1) ||
    (text && text.indexOf(':') == -1)
  )
    return text;
  const newArr: string[] = [];
  if (text) {
    text.split('@').forEach((item) => {
      if (item.indexOf('$') != -1) {
        const newStr = item.replace(/:.*?\$/g, '</span>');
        newArr.push(
          `<span style="border:1px solid ${color};padding:2px;border-radius:4px;margin:0 2px;" >${newStr}`,
        );
      } else {
        newArr.push(item);
      }
    });
  }

  return newArr.join('');
};

export const formatReferencesAndFiles = (fileList: any, list: any) => {
  const newList = list.map((item: any) => {
    return { name: item.text, url: '' };
  });
  return fileList.concat(newList);
};
