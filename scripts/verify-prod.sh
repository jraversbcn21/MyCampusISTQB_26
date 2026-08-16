#!/usr/bin/env bash
# Verificación post-deploy de producción (https://mycampusistqb.vercel.app) desde cualquier red,
# incluida la corporativa con proxy de inspección SSL (usa el bundle de CA si existe).
#
# Comprueba: (a) la app se sirve, (b) nada sensible expuesto (ISTQB 2026/, docs/, CLAUDE.md,
# scripts/), (c) estado de los blobs PDF inalcanzables en GitHub (ticket a Support) SIN tener
# los SHAs escritos aquí: se recalculan de los ficheros locales con `git hash-object` si la
# carpeta local existe (repo público — los SHAs jamás se versionan; ver
# docs/2026-08-15-github-unreachable-pdf-blobs.md).
#
# Uso: bash scripts/verify-prod.sh
# Exit 0 = producción correcta (el ticket de GitHub pendiente solo avisa, no falla).

set -u
BASE="https://mycampusistqb.vercel.app"
CA_PEM="${USERPROFILE:-$HOME}/.certs/corporate-ca.pem"

CURL=(curl -s -o /dev/null -w '%{http_code}' --max-time 30)
if [ -f "$CA_PEM" ]; then
  # Red corporativa: schannel + proxy → hace falta el bundle y tolerar revocación inalcanzable.
  CURL+=(--ssl-revoke-best-effort --cacert "$CA_PEM")
fi

fails=0
check() { # check <esperado> <url> <etiqueta>
  local want="$1" url="$2" label="$3" got
  got=$("${CURL[@]}" "$url")
  if [ "$got" = "$want" ]; then
    echo "OK   $label -> $got"
  else
    echo "FAIL $label -> $got (esperado $want)"
    fails=$((fails+1))
  fi
}

echo "== App servida (200) =="
check 200 "$BASE/"                "/"
check 200 "$BASE/css/styles.css"  "/css/styles.css"
check 200 "$BASE/js/app.js"       "/js/app.js"
check 200 "$BASE/privacy.html"    "/privacy.html"

echo "== Nada sensible expuesto (404) =="
check 404 "$BASE/ISTQB%202026/ISTQB_CTFL_Syllabus_v4.0.1.pdf" "/ISTQB 2026/<pdf>"
check 404 "$BASE/docs/2026-08-15-github-unreachable-pdf-blobs.md" "/docs/<audit>"
check 404 "$BASE/CLAUDE.md"                 "/CLAUDE.md"
check 404 "$BASE/scripts/verify-runtime.js" "/scripts/verify-runtime.js"
check 404 "$BASE/.githooks/pre-commit"      "/.githooks/pre-commit"

echo "== Blobs PDF en GitHub (ticket a Support) =="
PDF_DIR="$(git rev-parse --show-toplevel 2>/dev/null)/ISTQB 2026"
if [ -d "$PDF_DIR" ]; then
  pending=0
  for f in "Foundations of software testing - ISTQB Certification.pdf" \
           "ISO-IEC-IEEE-291194-4.pdf" \
           "ISTQB_CTFL_Syllabus_v4.0.1.pdf"; do
    sha=$(git hash-object "$PDF_DIR/$f") # sin -w: solo calcula, no escribe en .git
    got=$("${CURL[@]}" "https://api.github.com/repos/jraversbcn21/MyCampusISTQB_26/git/blobs/$sha")
    if [ "$got" = "404" ]; then
      echo "OK   blob de '$f' purgado en GitHub (404)"
    else
      echo "WARN blob de '$f' aun servido por GitHub ($got) — ticket a Support pendiente"
      pending=$((pending+1))
    fi
  done
  [ "$pending" -gt 0 ] && echo "WARN: enviar/esperar el ticket de support.github.com (borrador en docs/2026-08-15-github-unreachable-pdf-blobs.md)"
else
  echo "SKIP carpeta local 'ISTQB 2026/' no presente — no se pueden recalcular los SHAs en este clon"
fi

echo
if [ "$fails" -eq 0 ]; then
  echo "PRODUCCION OK ($([ -f "$CA_PEM" ] && echo 'red corporativa, CA bundle' || echo 'red normal'))"
  exit 0
else
  echo "PRODUCCION CON $fails FALLO(S)"
  exit 1
fi
