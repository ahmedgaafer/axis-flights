# Axis flights

## Used UI packages:

- [react-images-uploading](https://www.npmjs.com/package/react-images-uploading): for image uploading form
- [react-icons](https://www.npmjs.com/package/react-icons) For icons throughout the app
- [react-toastify](https://www.npmjs.com/package/react-toastify) to show toast messages
- [react-modal](https://www.npmjs.com/package/react-modal?activeTab=readme) to show modals

## Installation

1. Open terminal
2. Use the following command

```shell
npm i
```

3. I Created a simple data generation script [Here](./dataGenerator.ts) To use it type this in console

> NOTE: You can change the generator settings through the script line 152

```shell
npm run server:dev
```

and wait for it work. Then in another terminal

```shell
npx tsx dataGenerator.ts
```

1. to run the app (Front & back end) run the following command

```shell
npm run start
```

4. Open the front-end app from [HERE](http://localhost:5001/).

## Design

- To preview the mock design of the project please go [HERE](https://excalidraw.com/#json=jnOg1MtuUwiYPrOdRZB5Y,dZK930roeIFZrARoDzPhUg)

- The website will switch dark and light theme automatically based on system preferences.
