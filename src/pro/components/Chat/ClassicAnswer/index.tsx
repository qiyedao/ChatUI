import React, { FC, useEffect, useState } from 'react';
import { formatSlot } from '../../../utils/chatUtils';
import { ImageViewer } from 'antd-mobile';
type IAnswerProps = {
  item: {
    type: number;
    mediaType: number;
    content: string;
  };
  index: number;
  openMediaUrl: string;
};

const renderFooter: any = () => {
  return (
    <div className="footer">
      <div
        className="footerButton"
        onClick={() => {
          const img: any = document.getElementsByClassName('adm-image-viewer-image-wrapper')[0]
            .childNodes[0];
          if (img.getAttribute('class')) {
            img.classList.remove('animation');
          } else {
            img.classList.add('animation');
          }
        }}
      ></div>
    </div>
  );
};

const AnswerItem: FC<IAnswerProps> = ({ item, openMediaUrl }) => {
  const [imgSrc] = useState<any>();
  const [visible, setVisible] = useState<boolean>(false);
  if (item.type === 0) {
    return (
      <div
        style={{ marginBottom: 5, width: '100%', fontSize: 'fontSize.875rem' }}
        dangerouslySetInnerHTML={{ __html: formatSlot(item.content, '#000') }}
      ></div>
    );
  }
  if (item.type === 1) {
    return (
      <div style={{ marginBottom: 5 }} className="image-wrap">
        <img
          src={`${openMediaUrl}?id=${item.content}&sceneId=${sessionStorage.getItem('sceneId')}`}

          // onClick={() => {
          //   setImgSrc(
          //     `${openMediaUrl}?id=${item.content}&sceneId=${sessionStorage.getItem(
          //       'sceneId',
          //     )}`,
          //   );
          //   setVisible(true);
          //   setTimeout(() => {
          //     const img: any = document.getElementsByClassName('adm-image-viewer-image-wrapper')[0]
          //       .childNodes[0];
          //     const width = img.width;
          //     const height = img.height;
          //     if (width / height > 1) {
          //       return Toast.show({
          //         content: '横屏观看效果更好哦',
          //       });
          //     }
          //   }, 100);
          // }}
        />
        <ImageViewer
          image={imgSrc}
          visible={visible}
          onClose={() => {
            setVisible(false);
          }}
          renderFooter={renderFooter}
        ></ImageViewer>
      </div>
    );
  }
  if (item.type === 2) {
    return (
      <audio
        src={`${openMediaUrl}?id=${item.content}&sceneId=${sessionStorage.getItem('sceneId')}`}
        controls
        style={{ marginBottom: 5, width: '100%' }}
      >
        您的浏览器不支持audio
      </audio>
    );
  }
  if (item.type === 3) {
    return (
      <video
        src={`${openMediaUrl}?id=${item.content}&sceneId=${sessionStorage.getItem('sceneId')}`}
        controls
        style={{ marginBottom: 5, width: '100%' }}
      ></video>
    );
  }
  return <div></div>;
};
type IClassicAnswerProps = {
  answerList: any[];
  openMediaUrl: string;
};

//经典答案
const ClassicAnswer: FC<IClassicAnswerProps> = ({ answerList, openMediaUrl }) => {
  // const handleAdd = () => {
  //   const imageWraps = document.querySelectorAll('.currentRichText .image-wrap');
  //   console.log('imageWraps', imageWraps);

  //   imageWraps.forEach((item) => {
  //     console.log('imageWraps item', item, 'item.children', item.children);

  //     if (item.children.length == 1) {
  //       item.children[0].insertAdjacentHTML(
  //         'afterend',
  //         `<div data-type="previewImg" data-src=${item.children[0].getAttribute(
  //           'src',
  //         )} class=${'chat-rich-text-fullIcon'}>点击进入长图了解详情</div>`,
  //       );
  //     }
  //   });
  // };
  useEffect(() => {}, [answerList]);
  return (
    <div className="classic-answer-container currentRichText">
      <div className="classic-answer">
        {answerList.map((item, index) => (
          <AnswerItem openMediaUrl={openMediaUrl} key={index} item={item} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ClassicAnswer;
