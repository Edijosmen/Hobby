// Cliente: maneja año, mensaje y comentarios (envía/recupera desde /comment y /comments)
document.addEventListener('DOMContentLoaded', () => {
  // Año en el footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mensaje (función compatible con el botón existente)
  window.mensaje = function(){
    alert('¡Listo! Edita /d:/Especializacion/hobby/Index.html para personalizar esta página.');
  };

  const form = document.getElementById('comment-form');
  const list = document.getElementById('comments-list');

  function escapeHtml(s){
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function render(comments){
    if (!list) return;
    if (!comments.length) {
      list.innerHTML = '<li class="muted">No hay comentarios todavía.</li>';
      return;
    }
    list.innerHTML = comments.map(c => {
      const time = c.time ? new Date(c.time).toLocaleString() : '';
      return `<li>${escapeHtml(c.text)} <small style="color:var(--muted);">${time}</small></li>`;
    }).join('');
  }

  async function loadComments(){
    try{
      const res = await fetch('/comments');
      const data = await res.json();
      render(data.comments || []);
    }catch(e){ console.error(e); }
  }

  if (form){
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('textarea[name="comment"]');
      if (!input) return;
      const comment = input.value.trim();
      if (!comment) return;
      try{
        const res = await fetch('/comment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ comment })
        });
        const data = await res.json();
        render(data.comments || []);
        input.value = '';
      }catch(err){ console.error(err); }
    });
  }

  loadComments();
});
