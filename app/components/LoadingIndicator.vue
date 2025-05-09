<template>
  <div class="lds-ring">
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
  </div>
</template>

<style scoped>
.lds-ring,
.lds-ring div {
  box-sizing: border-box;
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  animation: lds-ring 3s linear infinite;
  /* animation-direction: reverse; */
}
.lds-ring > div {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: block;
  position: absolute;
  margin: 0px;

  /* border-color: var(--ui-primary) transparent transparent transparent; */

  /* top: 50%;
  left: 50%; */
  /* transform: translate(-50%, -50%);
  transform-origin: center; */
}
.lds-ring > div > div {
  animation: lds-ring 2s cubic-bezier(0.2, 0, 0.1, 1) infinite;
  /* border-color: var(--ui-primary); */
  /* border: 2px solid white; */
  border-color: var(--ui-primary) transparent transparent transparent;
  border-width: 8px;
  border-style: solid;
  border-radius: 50%;
  height: 100%;
  width: 100%;
}
.lds-ring > div:nth-child(1) {
  width: calc(100% - 0px);
  height: calc(100% - 0px);
  top: 0px;
  left: 0px;
  & > div {
    animation-delay: -0.45s;
    /* animation-duration: 1.5s; */
    border-width: 10px;
  }
}
.lds-ring > div:nth-child(2) {
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  top: 10px;
  left: 10px;
  & > div {
    animation-delay: -0.3s;
    border-width: 8px;
  }
}
.lds-ring > div:nth-child(3) {
  width: calc(100% - 36px);
  height: calc(100% - 36px);
  top: 18px;
  left: 18px;
  & > div {
    animation-delay: -0.15s;
    /* animation-duration: 1.5s; */
    border-width: 4px;
  }
}
.lds-ring > div:nth-child(4) {
  width: calc(100% - 42px);
  height: calc(100% - 42px);
  top: 21px;
  left: 21px;
  & > div {
    animation-delay: -0.05s;
    border-width: 2px;
  }
}

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
