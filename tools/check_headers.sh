#!/usr/bin/env bash
# Comprueba las cabeceras de seguridad de cabreraelite.com
URL="${1:-https://cabreraelite.com/}"
H=$(curl -sIL "$URL")
fail=0
for h in strict-transport-security x-content-type-options x-frame-options referrer-policy permissions-policy cross-origin-opener-policy content-security-policy; do
  if echo "$H" | grep -qi "^$h:"; then echo "OK      $h"; else echo "FALTA   $h"; fail=1; fi
done
exit $fail
