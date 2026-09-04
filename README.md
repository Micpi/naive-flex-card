<div align="center">

# 🧱 Naive Flex Card — Home Assistant Card

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge)](https://hacs.xyz)
[![HA Version](https://img.shields.io/badge/Home%20Assistant-2024.1%2B-blue?style=for-the-badge&logo=home-assistant)](https://www.home-assistant.io)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/github/v/release/Micpi/naive-flex-card?style=for-the-badge&label=Version)](https://github.com/Micpi/naive-flex-card/releases/latest)
[![Buy Me a Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-FFDD00?style=for-the-badge&logo=buymeacoffee&logoColor=000000)](https://buymeacoffee.com/mickaelpila)

**Carte Lovelace modulaire, sûre et simple à déployer pour piloter lumières, médias, actions et volets.**

Configurez visuellement styles, actions et entités pour créer des cartes unifiées et réutilisables.

</div>

---

- light
- button / switch / script / scene
- volume (media_player)
- cover

Points clefs:

- Configuration simple (presets + options directes)
- Configuration complete (actions, styles, couleurs, dimensions)
- Sliders unifies avec rendu type Light Slider Card
- Commandes volet strictement séparées : ouvrir, arrêter et fermer n'utilisent jamais `toggle`
- Détection des capacités `supported_features` de chaque volet
- Profils de déploiement rapide directement dans l'éditeur visuel
- YAML compact : les valeurs par défaut ne sont plus enregistrées inutilement
- Textes configurables via `labels` pour eviter les libelles anglais
- Editeur 100% visuel (aucune saisie JSON obligatoire)
- Actions natives visuelles: tap, hold, double tap
- Sections repliables type carte standard (General, Actions, Styles, Defaults)
- Pickers visuels pour entites, couleurs et icones
- Groupes de boutons activables/desactivables, au choix
- Preset visuel navbar_popup inspire du look navbar/media
- Rangee de boutons horizontale scrollable
- Tailles de boutons minimum, maximum et personnalisee
- Editeur visuel Lovelace inclus

## 🧪 Usage recommande

Naive Flex Card sert de carte polyvalente de reference quand une seule carte doit combiner un controle principal, des actions rapides et une presentation homogene avec le style Naive Flex du workspace.

## 📦 Installation

1. Copier le dossier `custom_cards/naive-flex-card` dans votre environnement de dev.
1. Ajouter la ressource Lovelace:

```yaml
url: /local/naive-flex-card.js
type: module
```

1. Ajouter la carte:

```yaml
type: custom:naive-flex-card
entity: light.salon
```

## ⚡ Déploiement rapide

Le plus simple est d'ajouter la carte depuis l'interface Home Assistant, de sélectionner l'entité,
puis d'ouvrir **Déploiement rapide** dans l'éditeur. Les profils suivants sont disponibles :

- Automatique essentiel
- Volet — commandes essentielles
- Volet — commandes + positions 25 / 50 / 75 %
- Lumière
- Lecteur multimédia / volume

La configuration minimale d'un volet tient à deux lignes :

```yaml
type: custom:naive-flex-card
entity: cover.volet_salon
```

Le domaine `cover` est détecté automatiquement. La carte envoie alors uniquement les services
`cover.open_cover`, `cover.stop_cover`, `cover.close_cover` et `cover.set_cover_position`.

## ⚙️ Configuration personnalisée

```yaml
type: custom:naive-flex-card
entity: light.salon
control_type: auto
style:
  preset: modern
button_row:
  enabled: true
  scroll: true
  min_button_width: 72
  max_button_width: 132
  buttons:
    - label: Éteint
      icon: mdi:power
      action: call-service
      service: light.turn_off
    - label: 50%
      icon: mdi:brightness-6
      action: call-service
      service: light.turn_on
      service_data:
        brightness_pct: 50
labels:
  toggle: Basculer
  brightness: Luminosité
  on: Allumé
  off: Éteint
```

## 🪟 Volets roulants

Les boutons natifs Ouvrir et Fermer sont des commandes directionnelles, jamais des bascules. La
carte masque aussi automatiquement une commande absente de `supported_features`. Pour une ancienne
intégration qui ne publie pas correctement ses capacités, utilisez
`respect_supported_features: false`.

```yaml
type: custom:naive-flex-card
entity: cover.volet_salon
style:
  preset: soft
  shape: pill
cover_controls:
  show_open: true
  show_stop: true
  show_close: true
  show_position: true
  show_icons: true
  position_step: 5
  respect_supported_features: true
  disable_redundant_commands: true
  open_icon: mdi:arrow-up
  stop_icon: mdi:stop
  close_icon: mdi:arrow-down
button_row:
  enabled: true
  scroll: true
  button_width: 110px
  min_button_width: 88
  max_button_width: 150
  buttons:
    - label: 25%
      icon: mdi:window-shutter
      action: set-position
      position: 25
    - label: 50%
      icon: mdi:window-shutter
      action: set-position
      position: 50
    - label: 100%
      icon: mdi:window-shutter-open
      action: set-position
      position: 100
```

Les actions volet peuvent aussi cibler une autre entité dans une rangée de boutons :

```yaml
button_row:
  enabled: true
  buttons:
    - label: Ouvrir cuisine
      icon: mdi:arrow-up
      entity: cover.volet_cuisine
      action: open-cover
    - label: Fermer cuisine
      icon: mdi:arrow-down
      entity: cover.volet_cuisine
      action: close-cover
```

## 🧭 Options principales

- `entity`: entite cible
- `control_type`: `auto | light | button | volume | cover`
- `name`, `icon`
- `style.preset`: `modern | minimal | outline | soft`
- `style.shape`: `rounded | square | pill`
- `style.appearance`: `solid | glass | outline`
- `style.active_color`, `style.background_color`, `style.text_color`
- `labels.*`: textes visibles de la carte (badges, boutons, etats, sliders)
- `cover_controls.show_open`, `show_stop`, `show_close`, `show_position`, `show_icons`
- `cover_controls.position_step`: pas du slider, de 1 à 100
- `cover_controls.respect_supported_features`: masque les fonctions non supportées
- `cover_controls.disable_redundant_commands`: désactive Ouvrir uniquement à 100 % et Fermer uniquement à 0 % ; les deux directions restent disponibles après un arrêt intermédiaire
- `cover_controls.open_icon`, `stop_icon`, `close_icon`
- `button_row.enabled`, `button_row.scroll`
- `button_row.min_button_width`, `button_row.max_button_width`, `button_row.button_width`
- `button_row.buttons[]`: actions rapides custom (editees visuellement dans l'UI)

## 🧭 Format button_row.buttons

Chaque bouton accepte:

- `label`
- `icon`
- `entity` (optionnel)
- `action`: `more-info | toggle | open-cover | stop-cover | close-cover | set-position | call-service`
- `service` + `service_data` (si `call-service`)
- `position` (volet, de 0 fermé à 100 ouvert) pour `set-position`

`set-value` reste accepté pour compatibilité avec les anciennes configurations, mais les nouvelles
configurations de volet doivent utiliser `set-position`.

### Actions générales de la carte

`tap_action`, `hold_action` et `double_tap_action` acceptent également les actions volet explicites :

```yaml
tap_action:
  action: open-cover
hold_action:
  action: stop-cover
double_tap_action:
  action: close-cover
```

Les événements des boutons et sliders sont isolés de ces actions générales : appuyer sur Ouvrir ne
peut donc pas déclencher en plus un `tap_action` ou un `hold_action`.

## 🗣️ Textes personnalisables

La carte fournit des libelles francais par defaut. Tous les textes visibles principaux peuvent etre ajustes:

```yaml
labels:
  badge_light: Lumière
  badge_volume: Son
  toggle: Basculer
  brightness: Luminosité
  brightness_down: "- Luminosité"
  brightness_up: "+ Luminosité"
  volume: Volume
  open: Ouvrir
  stop: Arrêter
  close: Fermer
  on: Allumé
  off: Éteint
  unavailable: Entité introuvable
```

## 🛠️ Editeur

La carte embarque un editeur visuel complet et constitue la base ergonomique a reutiliser pour les futures cartes riches du workspace.

## 🧱 Build local

Depuis `custom_cards/naive-flex-card`:

```bash
npm run build
```

Le fichier genere est `dist/naive-flex-card.js`.

## ✅ Tests

```bash
npm test
```

Les exemples prêts à copier sont regroupés dans [`examples.yaml`](examples.yaml).
