export enum AnswerType {
  SendMsg = -1, //发送
  DefaultMsg, //默认
  AccurateMsg, //精确回答
  RecommendMsg, //推荐问题
  TaskMsg, //任务
  FirstMsg, //首次
  SubjectMsg, //专题
  HotQuestion, //热门问题
  KnowledgeGraphMsg, //图谱答案
}
export const loginPath = '/login';
export const errorPath = '/error';
export const Disease_Words = '疾病敏感';
export const Diagnosis_Words = '诊疗敏感';
