(() => {
  const moved = document.querySelector('dashhq-moved');
  const params = new URLSearchParams(location.search);
  if (params.has('id')) moved.setAttribute('path', '/identity/');
  else if (params.has('name')) moved.setAttribute('path', '/dpns/');
})();
