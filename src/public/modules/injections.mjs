window.Math.rem = (n = 1) => {
  return n * parseFloat(getComputedStyle(document.documentElement).fontSize);
};

window.cookies = (name) => {
  let cookies = document.cookie
    ? ((s) => {
        const o = {};
        for (const c of s.split(';')) {
          const v = c.split('=');
          o[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
        }
        return o;
      })(document.cookie)
    : {};
  return cookies[name];
};

function vh() {
  document.documentElement.style.setProperty(
    '--vh',
    window.innerHeight * 0.01 + 'px'
  );
}
window.addEventListener('resize', vh);
vh();
