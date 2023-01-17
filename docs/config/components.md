---
title: Components Options
---

# Components Options

```js
new ChatSDK({ components: { ...args } });
```

## components

```js
interface Components {
  [key: string | number]: React.FC<any> | React.ComponentType<any>;
}
```

## Custom Component

```js
const GuessYou = ({ data, ctx, meta }: { ctx: Ctx }) => {
  console.log('GuessYou', data, ctx, meta);

  return <div>GuessYou</div>;
};
```

## Register Component

```js
new ChatSDK({
  Components: {
    'Guess-You': GuessYou,
  },
});
```
