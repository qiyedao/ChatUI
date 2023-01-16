import React, { useState, useLayoutEffect, useRef } from 'react';
import { ScrollView, ScrollViewHandle } from '../ScrollView/ScrollView';
import { AutoComplete, AutoCompleteItemProps } from './AutoComplete';

export interface AutoCompletesProps {
  items: AutoCompleteItemProps[];
  visible?: boolean;
  onClick: (item: AutoCompleteItemProps, index: number) => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

const AutoCompletes = (props: AutoCompletesProps) => {
  const { items, visible, onClick, onScroll } = props;
  const scroller = useRef<ScrollViewHandle>(null);
  const [scrollEvent, setScrollEvent] = useState(!!onScroll);

  useLayoutEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (scroller.current) {
      setScrollEvent(false);
      scroller.current.scrollTo({ x: 0, y: 0 });
      timer = setTimeout(() => {
        setScrollEvent(true);
      }, 500);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [items]);

  if (!items.length) return null;

  return (
    <ScrollView
      className="AutoCompletes"
      data={items}
      scrollX={false}
      itemKey="name"
      ref={scroller}
      data-visible={visible}
      onScroll={scrollEvent ? onScroll : undefined}
      renderItem={(item: AutoCompleteItemProps, index) => (
        <AutoComplete item={item} index={index} onClick={onClick} key={item.name} />
      )}
    />
  );
};

AutoCompletes.defaultProps = {
  items: [],
  visible: true,
};

export default React.memo(AutoCompletes);
