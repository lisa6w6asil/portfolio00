window.addEventListener('load', function () {
  var loader = document.getElementById('loader');
  // 最低でも少しは見えるように、読み込みが一瞬でも溶け込みすぎないよう間を置く
  setTimeout(function () {
    loader.classList.add('hide');
  }, 500);
});