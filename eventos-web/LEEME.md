# Web de eventos (eventos.hotelvenecia.com)

Página estática (HTML + `img/` + `fonts/`). **No se publica con Vercel**: se sube por ZIP al hosting de Hostinger del hotel, a la carpeta `public_html/eventos`.

- Vista previa local: `python3 -m http.server 4322 --directory eventos-web` y abrir http://localhost:4322/
- Estado: oculta a Google (`noindex` en `index.html` y cabecera `X-Robots-Tag` en el `.htaccess` del ZIP, que no se guarda aquí).
- **Idiomas:** solo se edita `index.html` (español). Después se ejecuta `python3 scripts/eventos-idiomas.py`, que regenera `en/`, `it/`, `fr/` y `de/` (no editarlas a mano). Si cambia o se añade un texto en español, hay que actualizar sus traducciones en ese script; si falta alguna, el script se para y dice cuál (un texto **nuevo** no lo detecta: añadirlo siempre al script).
- Para publicar un cambio: crear un ZIP con el contenido de esta carpeta (+ el `.htaccess`) y extraerlo en `public_html/eventos` de Hostinger.
