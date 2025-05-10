<template>
  <div class="lds-ring">
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
    <div><div></div></div>
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
  animation: lds-ring 8s linear infinite;
  /* animation-direction: reverse; */
}
.lds-ring > div {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: block;
  position: absolute;
  margin: 0px;

  &:after {
    content: "";
    display: block;
    position: absolute;
    top: 0px;
    left: 0px;
    width: calc(100% - 0px);
    height: calc(100% - 0px);
    border-radius: 50%;
    border: 18px solid var(--color-navbar);
    z-index: -1;
  }

  /* border-color: var(--ui-primary) transparent var(--ui-primary) transparent;
  border-style: solid;
  border-width: 2px;
  border-radius: 50%; */

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
  border-width: 3px;
  border-style: solid;
  border-radius: 50%;
  width: calc(100% - 14px);
  height: calc(100% - 14px);
  top: 7px;
  left: 7px;
  position: absolute;
}
.lds-ring > div:nth-child(1) {
  & > div {
    animation-delay: 0s;
    /* animation-duration: 3s; */
  }
}
.lds-ring > div:nth-child(2) {
  & > div {
    animation-delay: -0.1s;
  }
}
.lds-ring > div:nth-child(3) {
  & > div {
    animation-delay: -0.2s;
  }
}
.lds-ring > div:nth-child(4) {
  & > div {
    animation-delay: -0.3s;
  }
}
.lds-ring > div:nth-child(5) {
  & > div {
    animation-delay: -0.4s;
  }
}
.lds-ring > div:nth-child(6) {
  & > div {
    animation-delay: -0.5s;
  }
}
/* .lds-ring > div:nth-child(1) {
  width: calc(100% - 0px);
  height: calc(100% - 0px);
  top: 0px;
  left: 0px;
  & > div {
    animation-delay: 0s;
    border-width: 10px;
  }
}
.lds-ring > div:nth-child(2) {
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  top: 12px;
  left: 12px;
  & > div {
    animation-delay: -.2s;
    border-width: 8px;
  }
}
.lds-ring > div:nth-child(3) {
  width: calc(100% - 44px);
  height: calc(100% - 44px);
  top: 22px;
  left: 22px;
  & > div {
    animation-delay: -.4s;
    border-width: 4px;
  }
}
.lds-ring > div:nth-child(4) {
  width: calc(100% - 56px);
  height: calc(100% - 56px);
  top: 28px;
  left: 28px;
  & > div {
    animation-delay: -.6s;
    border-width: 2px;
  }
} */

@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
