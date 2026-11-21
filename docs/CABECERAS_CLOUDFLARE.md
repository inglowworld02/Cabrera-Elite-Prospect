# Cabeceras de seguridad HTTP para cabreraelite.com

GitHub Pages no permite definir cabeceras HTTP desde el repositorio (no lee `_headers`).
Se activan en Cloudflare (el dominio ya pasa por Cloudflare) con una **Transform Rule**.
Esto no modifica el código, los pagos ni los precios, y se revierte borrando la regla.

## Dónde
Cloudflare → dominio `cabreraelite.com` → **Rules → Transform Rules → Modify Response Header → Create rule**
- Nombre: `Security headers`
- Cuando: **All incoming requests** (expresión `true`)
- Then → **Set static**, una fila por cabecera:

| Cabecera | Valor |
|---|---|
| `Strict-Transport-Security` | `max-age=31536000` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| `Cross-Origin-Opener-Policy` | `same-origin-allow-popups` |
| `Content-Security-Policy` | `frame-ancestors 'none'` |

Notas:
- HSTS sin `includeSubDomains` ni `preload` a propósito: son difíciles de revertir. Se pueden añadir más adelante.
- `frame-ancestors` solo funciona como cabecera (no en `<meta>`); la política CSP completa ya viaja en el `<meta>` de cada página.
- Si más adelante se embebe el sitio en un iframe propio, quitar `X-Frame-Options` y `frame-ancestors`.
- Stripe se usa mediante enlaces de pago (redirección), por eso `payment=()` no afecta al cobro.

## Verificar
`bash tools/check_headers.sh` (desde un equipo con internet) y comprobar que todo diga OK.
Después probar el sitio completo: inicio, registro, cuenta, tienda, chat y un pago de prueba.
Escaneo externo recomendado: https://securityheaders.com/?q=cabreraelite.com

## Rollback
Desactivar o borrar la regla en Cloudflare. Efecto inmediato.
