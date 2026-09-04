# Changelog

## v0.4.1 - 2026-09-04

- Date: 2026-09-04
- Component: card / naive-flex-card
- Repository: Micpi/naive-flex-card
- Previous tag: v0.4.0
- HACS version: v0.4.1

## Summary

- fix(cover): garder les deux directions actives aux positions intermédiaires
- Build:    📦 Build : naive-flex-card   ---------------------------   📦 Installation des dépendances npm...  up to date, audited 1 package in 1s  found 0 vulnerabilities   ✅ Dépendances installées   🔧 Build en cours...  > naive-flex-card@0.4.1 build > node -e "const fs=require('fs');fs.mkdirSync('dist',{recursive:true});fs.copyFileSync('naive-flex-card.js','dist/naive-flex-card.js');console.log('dist/naive-flex-card.js generated');"  dist/naive-flex-card.js generated   ✅ Fichier copié dans examples/cartes Lovelace/   ✅ Build terminé : naive-flex-card ok
- Version metadata updated: hacs.json, package-lock.json, package.json

## Detailed changelog

### Card source

- `naive-flex-card.js` - changed (+15 -3, working tree)

### Documentation

- `README.md` - changed (+1 -1, working tree)

### HACS and metadata

- `hacs.json` - changed (+1 -1, working tree)
- `package-lock.json` - changed (+2 -2, working tree)
- `package.json` - changed (+1 -1, working tree)

### Tests

- `tests/naive-flex-card.test.mjs` - changed (+29 -0, working tree)

## Commits since previous tag

- No committed changes since previous tag before this release commit.

## HACS update notes

- HACS should detect this release from tag `v0.4.1`.
- If the update does not appear immediately, refresh HACS cache or wait for the next HACS refresh cycle.

# Changelog

## v0.4.0 - 2026-09-04

- Date: 2026-09-04
- Component: card / naive-flex-card
- Repository: Micpi/naive-flex-card
- Previous tag: v0.3.1
- HACS version: v0.4.0

## Summary

- feat(card): commandes volet explicites et déploiement simplifié
- Build:    📦 Build : naive-flex-card   ---------------------------   📦 Installation des dépendances npm...  up to date, audited 1 package in 983ms  found 0 vulnerabilities   ✅ Dépendances installées   🔧 Build en cours...  > naive-flex-card@0.4.0 build > node -e "const fs=require('fs');fs.mkdirSync('dist',{recursive:true});fs.copyFileSync('naive-flex-card.js','dist/naive-flex-card.js');console.log('dist/naive-flex-card.js generated');"  dist/naive-flex-card.js generated   ✅ Fichier copié dans examples/cartes Lovelace/   ✅ Build terminé : naive-flex-card ok
- Version metadata updated: hacs.json, package-lock.json, package.json

## Detailed changelog

### Card source

- `naive-flex-card.js` - changed (+607 -105, working tree)

### Documentation

- `README.md` - changed (+98 -10, working tree)

### HACS and metadata

- `hacs.json` - changed (+1 -1, working tree)
- `package-lock.json` - changed (+2 -2, working tree)
- `package.json` - changed (+3 -2, working tree)

### Other

- `examples.yaml` - added (+58 -0, working tree)

### Tests

- `tests/` - added (stat unavailable, working tree)

## Commits since previous tag

- No committed changes since previous tag before this release commit.

## HACS update notes

- HACS should detect this release from tag `v0.4.0`.
- If the update does not appear immediately, refresh HACS cache or wait for the next HACS refresh cycle.

# Changelog

## v0.3.1 - 2026-07-20

- fix(card): keep main control buttons on one row on mobile

## v0.3.0 - 2026-07-20

- feat(card): add Light Slider style unified controls for light, volume, and cover sliders
- feat(card): add configurable French labels for controls, badges, and state text
- feat(editor): expose label customization and translate the visual editor
- fix(editor): preserve nested control defaults when editing partial configuration

## v0.2.1 - 2026-06-01

- feat(card): publish naive-flex-card v0.2.1
- changed: .gitignore
- changed: README.md
- changed: hacs.json
- changed: naive-flex-card.js
- changed: package-lock.json
- changed: package.json

