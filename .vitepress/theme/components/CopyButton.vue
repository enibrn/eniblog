<!-- https://github.com/Mtillmann/vitepress-copy-helper -->
<template>
  <span
    v-if="show"
    :class="classes"
    ref="btn"
    @click="click"
    :data-message="message"
    :data-label="labelString"
  ></span>
  <span
    v-else
    v-html="errorComment"
  ></span>
</template>

<script setup>
import { ref, onMounted, useSlots, computed, watch } from "vue";

const props = defineProps({
  position: {
    // start, end, auto
    type: String,
    default: () => 'auto'
  },
  target: {
    // previous, next, auto
    type: String,
    default: () => 'auto'
  },
  message: {
    type: String,
    default: () => 'copied'
  },
  label: {
    type: String,
    default: () => null
  },
  classes: {
    type: String,
    default: () => 'copy-btn'
  },
  preferSibling: {
    type: String,
    default: 'previous'
  },
  content: {
    type: String,
    default: null
  }
});

const slots = useSlots();
const btn = ref(null);
const codeNode = ref(null);
const show = ref(true);
const error = ref(null);
const copyContent = ref(null);
const labelString = props.label ? props.label : slots.default?.()[0]?.children;

const errorComment = computed(() => {
  return `<!-- Button not rendered: ${error.value} -->`;
});

const message = computed(() => {
  return props.message.replace('$CONTENT', copyContent.value);
});

watch(() => props.content, (newContent) => {
  copyContent.value = newContent;
});

onMounted(() => {
  const elementBefore = btn.value.previousElementSibling?.tagName === 'CODE' ? btn.value.previousElementSibling : null;
  const elementAfter = btn.value.nextElementSibling?.tagName === 'CODE' ? btn.value.nextElementSibling : null;

  if (!elementBefore && !elementAfter && !props.content) {
    show.value = false;
    error.value = 'No code element found and no content prop given';
    return;
  }

  if (props.content) {
    copyContent.value = props.content;
    return;
  }

  // attempt to inject button into code element
  let preliminaryPosition = props.position;
  if (props.target === 'auto') {
    if (elementBefore && elementAfter) {
      if (props.preferSibling === 'previous') {
        codeNode.value = elementBefore;
        if (preliminaryPosition === 'auto') {
          preliminaryPosition = 'end';
        }
      } else if (props.preferSibling === 'next') {
        codeNode.value = elementAfter;
        if (preliminaryPosition === 'auto') {
          preliminaryPosition = 'start';
        }
      }
    } else {
      codeNode.value = elementBefore || elementAfter;
    }
  } else if (props.target === 'previous') {
    codeNode.value = elementBefore;
    if (preliminaryPosition === 'auto') {
      preliminaryPosition = 'end';
    }

  } else if (props.target === 'next') {
    codeNode.value = elementAfter;
    if (preliminaryPosition === 'auto') {
      preliminaryPosition = 'start';
    }
  }

  if (!codeNode.value) {
    error.value = 'Failed to select code node';
    return;
  }

  let insertPosition = 'beforeend';
  if (preliminaryPosition === 'auto') {
    if (elementBefore) {
      insertPosition = 'beforeend';
    } else if (elementAfter) {
      insertPosition = 'afterbegin';
    }
  } else if (preliminaryPosition === 'start') {
    insertPosition = 'afterbegin';
  } else if (preliminaryPosition === 'end') {
    insertPosition = 'beforeend';
  }

  copyContent.value = codeNode.value.innerText;
  codeNode.value.innerText = '';
  codeNode.value.insertAdjacentHTML('beforeend', `<span>${copyContent.value}</span>`);

  codeNode.value.insertAdjacentElement(insertPosition, btn.value);
  btn.value.classList.add(`copy-btn-${insertPosition}`);
});

async function click() {

  await copyToClipboard(copyContent.value);
  btn.value.classList.add('copied');

  setTimeout(() => {
    btn.value.classList.remove('copied');
  }, 1000);
}

async function copyToClipboard(text) {
  try {
    return navigator.clipboard.writeText(text)
  } catch {
    const element = document.createElement('textarea')
    const previouslyFocusedElement = document.activeElement

    element.value = text

    // Prevent keyboard from showing on mobile
    element.setAttribute('readonly', '')

    element.style.contain = 'strict'
    element.style.position = 'absolute'
    element.style.left = '-9999px'
    element.style.fontSize = '12pt' // Prevent zooming on iOS

    const selection = document.getSelection()
    const originalRange = selection
      ? selection.rangeCount > 0 && selection.getRangeAt(0)
      : null

    document.body.appendChild(element)
    element.select()

    // Explicit selection workaround for iOS
    element.selectionStart = 0
    element.selectionEnd = text.length

    document.execCommand('copy')
    document.body.removeChild(element)


    if (selection && originalRange) {
      selection.removeAllRanges();
      selection.addRange(originalRange);
    }

    // Get the focus back on the previously focused element, if any
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  }
}

</script>

<style scoped>
.copy-btn {
  position: relative;
  vertical-align: middle;
  border: 1px solid var(--vp-code-copy-code-border-color);
  border-radius: 4px;
  display: inline-block;
  width: 18px;
  height: 26px;
  background-color: var(--vp-code-copy-code-bg);

  margin-bottom: 1em;
  padding-bottom: 2px;
  padding-top: 2px;
  padding-left: 26px;

  cursor: pointer;
  background-image: var(--vp-icon-copy);
  background-position: 50%;
  background-size: 20px;
  background-repeat: no-repeat;

  line-height: 1;

  &.copy-btn-beforeend {
    margin-left: 5px;
  }

  &.copy-btn-afterbegin {
    margin-right: 5px;
  }

  &[data-label] {
    width: auto;
    padding-left: 22px;
    padding-right: 4px;
    background-position-x: 2px;
    padding-top: 0;

    &::after {
      content: attr(data-label);
      line-height: 1.3;
    }
  }

  &[data-message].copied::before {
    content: attr(data-message);
    position: absolute;
    top: 0;
    left: 50%;
    color: var(--vp-c-text-1);
    opacity: 0;
    animation: toast 1s ease-out;

    border: 1px solid var(--vp-code-copy-code-border-color);
    border-radius: 4px;
    padding: 2px 4px;
    font-size: small;
    display: inline-block;
    background-color: var(--vp-code-copy-code-bg);


    white-space: nowrap;

    line-height: 1;

  }
}

@keyframes toast {
  0% {
    opacity: 0;
    transform: translate(-50%, -100%);
  }

  50% {
    opacity: 1;
    transform: translate(-50%, -150%);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -200%);
  }
}
</style>