# Blobs inalcanzables con PDFs de terceros todavía servidos por GitHub (2026-08-15)

**Estado:** local RESUELTO · lado GitHub PENDIENTE de ticket a soporte.

## Qué se encontró

Durante la auditoría de cierre de sesión del 2026-08-15 (rutina: comprobar que no quedan
commits colgantes), `git fsck` reveló 13 objetos inalcanzables en el clon local, entre ellos
**tres blobs de material con copyright** que la reescritura de historial del 2026-07-02
(`git filter-repo` + force-push) debía haber eliminado:

| Tamaño (bytes) | Fichero |
|---|---|
| 3.377.689 | `Foundations of software testing - ISTQB Certification.pdf` |
| 3.009.906 | `ISO-IEC-IEEE-291194-4.pdf` |
| 1.061.189 | `ISTQB_CTFL_Syllabus_v4.0.1.pdf` |

Coinciden **byte a byte** con los ficheros de la carpeta local `ISTQB 2026/`.

El objeto que los mantenía vivos era el commit huérfano **`ac572a66`** (2026-07-02,
*"chore: production-readiness quick fixes"*), el commit original pre-reescritura que borraba
la carpeta: al quedar inalcanzable pero no podado, sus padres seguían reteniendo los blobs.

## Por qué importa: no era solo local

La comprobación decisiva fue contra la API pública de GitHub, **sin autenticar**, con el
repositorio en estado `public`:

```bash
curl https://api.github.com/repos/jraversbcn21/MyCampusISTQB_26/git/blobs/<sha-del-blob>
# → 200 OK · 1.061.189 bytes · %PDF-1.4 (el syllabus completo, en base64)
```

> **Los SHAs no se escriben en este documento a propósito.** Este repositorio es público: publicar
> aquí los SHAs equivaldría a publicar la única pieza que hoy falta para descargar los PDFs (ver
> "alcance real del riesgo" justo debajo). Se recalculan en un segundo con `git hash-object`, ver
> más abajo.

GitHub conserva los objetos inalcanzables tras un force-push y los sigue sirviendo por SHA.
Los tres blobs devolvían 200.

**Alcance real del riesgo (para no exagerarlo ni minimizarlo):**
- **No** se llega navegando: la vista `raw` devuelve 404 y la de `blob` redirige. Hace falta
  **conocer el SHA exacto**.
- Pero ese SHA está en el `.git` de **cualquier clon hecho antes del 2026-07-02**, y el
  repositorio se compartió públicamente en Reddit.
- Es decir: no es un fichero indexable por Google, pero tampoco es privado.

## Qué se hizo (local, 2026-08-15)

```bash
git reflog expire --expire=now --expire-unreachable=now --all
git gc --prune=now
```

Antes de purgar se revisaron los 13 objetos uno a uno: 8 eran stashes descartados
(`WIP on master`) de trabajo que después se commiteó igualmente, 1 un commit `docs:` sobre el
desaparecido `AGENTS.md`, y el resto el commit `ac572a66` y sus árboles. **Nada recuperable.**

Resultado verificado:
- `.git`: **15 MB → 1,1 MB**
- objetos colgantes: **13 → 0**
- los tres SHAs: `git cat-file -e` → *Not a valid object name*
- blobs > 1 MB en toda la base de objetos: **0**
- `git fsck --full` limpio, 252 commits alcanzables, árbol limpio, 0/0 frente a `origin/master`,
  los tres gates en verde tras el `gc`.

## Qué queda pendiente: solo lo puede hacer GitHub

Los objetos inalcanzables del lado servidor **no se pueden purgar desde el cliente**: ni un
force-push ni un `gc` local los tocan. GitHub documenta que, tras reescribir historial para
eliminar datos sensibles, hay que **pedir a GitHub Support** que ejecute el recolector de basura
del repositorio.

### Borrador del ticket (enviar desde la cuenta de Jorge en https://support.github.com/)

> **Asunto:** Request garbage collection to purge unreachable objects after history rewrite
>
> Hi,
>
> Repository: `jraversbcn21/MyCampusISTQB_26` (public)
>
> On 2026-07-02 I rewrote this repository's history with `git filter-repo` and force-pushed, in
> order to remove copyrighted third-party PDFs that had been committed by mistake. The rewrite
> removed them from all branches, and the files are not reachable from any ref today.
>
> However, the blobs are still being served by the API. This request returns 200 with the full
> file content, unauthenticated:
>
> `GET /repos/jraversbcn21/MyCampusISTQB_26/git/blobs/<SHA-3>`
>
> The three affected blob SHAs are:
> - `<SHA-1>` (3.377.689 bytes)
> - `<SHA-2>` (3.009.906 bytes)
> - `<SHA-3>` (1.061.189 bytes)
>
> All three currently return 200 to unauthenticated API requests.
>
> These are copyrighted materials I am not licensed to redistribute, so I need them gone from
> the server, not just unreachable. Could you please run garbage collection on the repository to
> permanently remove these unreachable objects, and confirm once they no longer resolve?
>
> There are no forks of the repository. Thanks.

**Rellena los tres `<SHA-N>` antes de enviar.** No están escritos aquí a propósito (repo público).
Se recalculan al instante desde los ficheros locales, sin reintroducirlos en el repositorio,
porque el SHA de un blob es determinista a partir del contenido:

```bash
git hash-object "ISTQB 2026/Foundations of software testing - ISTQB Certification.pdf"
git hash-object "ISTQB 2026/ISO-IEC-IEEE-291194-4.pdf"
git hash-object "ISTQB 2026/ISTQB_CTFL_Syllabus_v4.0.1.pdf"
# sin -w: calcula el SHA pero NO escribe nada en .git
```

Verificado el 2026-08-15: los tres SHAs así calculados coinciden con los blobs que GitHub sirve,
y los tres devolvían 200.

### Comprobación posterior

Cuando GitHub confirme, verificar que los tres devuelven **404**:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  https://api.github.com/repos/jraversbcn21/MyCampusISTQB_26/git/blobs/<sha>
```

(Desde la red corporativa, añadir
`--ssl-revoke-best-effort --cacert "$USERPROFILE/.certs/corporate-ca.pem"`.)

## Lección para futuras auditorías

`git status` limpio y `local == origin/master` **no demuestran** que un purgado de historial haya
funcionado. La comprobación que de verdad vale es doble:

```bash
# 1. ¿queda algún blob grande en la base de objetos, alcanzable o no?
git cat-file --batch-all-objects --batch-check='%(objecttype) %(objectsize)' \
  | awk '$1=="blob" && $2>1000000'

# 2. ¿el servidor sigue sirviéndolos por SHA?
curl -s -o /dev/null -w "%{http_code}\n" https://api.github.com/repos/<owner>/<repo>/git/blobs/<sha>
```

La primera se saltó en 2026-07-02 porque el force-push "se veía" correcto desde la vista de
GitHub. La segunda ni se planteó.
