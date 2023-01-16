import React from 'react';
import clsx from 'clsx';
import { Icon } from '../Icon';

export interface AutoCompleteItemProps {
  name: string;
  code?: string;
  icon?: string;
  img?: string;
  isNew?: boolean;
  isHighlight?: boolean;
}

export interface AutoCompleteProps {
  item: AutoCompleteItemProps;
  index: number;
  onClick: (item: AutoCompleteItemProps, index: number) => void;
}

export const AutoComplete = (props: AutoCompleteProps) => {
  const { item, index, onClick } = props;

  function handleClick() {
    onClick(item, index);
  }

  return (
    <button
      className={clsx('AutoComplete', {
        new: item.isNew,
        highlight: item.isHighlight,
      })}
      type="button"
      data-code={item.code}
      aria-label={`快捷短语: ${item.name}，双击发送`}
      onClick={handleClick}
    >
      <div className="AutoComplete-inner">
        {item.icon && <Icon type={item.icon} />}
        {item.img && <img className="AutoComplete-img" src={item.img} alt="" />}
        <span>{item.name}</span>
      </div>
    </button>
  );
};
