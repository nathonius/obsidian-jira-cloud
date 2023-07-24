function copyCode(code) {
  const text = code.innerText;
  return navigator.clipboard.writeText(text);
}

const label = 'Copy';

const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');

// only add button if browser supports Clipboard API
if (navigator.clipboard) {
  codeBlocks.forEach((block) => {
    const pre = block.parentElement;
    const button = document.createElement('button');

    button.classList.add('copy-code-btn', 'btn');
    button.innerText = label;

    pre.appendChild(button);

    button.addEventListener('click', () => {
      copyCode(block);
    });
  });
}
