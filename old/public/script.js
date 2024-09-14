// SCSS 내용을 여기에 직접 포함시킵니다.
const scssContent = `
  // SCSS 내용은 styles.scss에 포함되어 있습니다.
`;

// SCSS를 CSS로 컴파일
Sass.compile(scssContent, function(result) {
  const style = document.createElement('style');
  style.textContent = result.text;
  document.head.appendChild(style);
});
