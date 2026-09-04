import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import vm from "node:vm"

async function loadCardClasses() {
  const sourcePath = new URL("../naive-flex-card.js", import.meta.url)
  const rawSource = await readFile(sourcePath, "utf8")
  const source = rawSource
    .replace(/^import .*lit-element.*\r?\n/m, "")
    .concat(
      "\nglobalThis.__cardExports = { NaiveFlexCard, NaiveFlexCardEditor, DEFAULT_CONFIG, COVER_FEATURES };"
    )

  class FakeLitElement {
    requestUpdate() {}

    dispatchEvent(event) {
      this.lastEvent = event
      return true
    }
  }

  class FakeCustomEvent {
    constructor(type, options = {}) {
      this.type = type
      this.detail = options.detail
    }
  }

  const context = {
    LitElement: FakeLitElement,
    html: () => ({}),
    css: () => ({}),
    customElements: { define() {} },
    CustomEvent: FakeCustomEvent,
    structuredClone,
    setTimeout,
    clearTimeout,
    history: { pushState() {} },
    window: { customCards: [], open() {} },
    document: { createElement: () => ({}) },
    console: { info() {}, warn() {}, error() {} },
  }
  context.globalThis = context

  vm.runInNewContext(source, context, { filename: "naive-flex-card.js" })
  return context.__cardExports
}

function createCoverCard(NaiveFlexCard, state = "closed", supportedFeatures = 15) {
  const calls = []
  const card = new NaiveFlexCard()
  card.setConfig({ entity: "cover.salon" })
  card.hass = {
    states: {
      "cover.salon": {
        state,
        attributes: { current_position: state === "closed" ? 0 : 100, supported_features: supportedFeatures },
      },
    },
    async callService(domain, service, data, target) {
      calls.push({ domain, service, data, target })
    },
  }
  return { card, calls }
}

test("les commandes principales ouvrent et ferment sans jamais basculer", async () => {
  const { NaiveFlexCard } = await loadCardClasses()
  const { card, calls } = createCoverCard(NaiveFlexCard)
  let propagationStopped = false

  await card._coverAction({ stopPropagation: () => (propagationStopped = true) }, "open_cover")
  card.hass.states["cover.salon"].state = "open"
  await card._coverAction({ stopPropagation() {} }, "close_cover")

  assert.equal(propagationStopped, true)
  assert.deepEqual(
    JSON.parse(JSON.stringify(calls.map(({ domain, service, data }) => ({ domain, service, data })))),
    [
      { domain: "cover", service: "open_cover", data: { entity_id: "cover.salon" } },
      { domain: "cover", service: "close_cover", data: { entity_id: "cover.salon" } },
    ]
  )
  assert.equal(calls.some(({ service }) => service === "toggle"), false)
})

test("les actions volet natives ciblent explicitement la bonne entité", async () => {
  const { NaiveFlexCard } = await loadCardClasses()
  const { card, calls } = createCoverCard(NaiveFlexCard)

  await card._runAction({ action: "open-cover" }, "cover.salon")
  await card._runAction({ action: "stop-cover" }, "cover.salon")
  await card._runAction({ action: "close-cover" }, "cover.salon")
  await card._runAction({ action: "set-position", position: 150 }, "cover.salon")

  assert.deepEqual(
    calls.map(({ service }) => service),
    ["open_cover", "stop_cover", "close_cover", "set_cover_position"]
  )
  assert.equal(calls[3].data.position, 100)
  assert.equal(calls.every(({ data }) => data.entity_id === "cover.salon"), true)
})

test("un bouton sans action ouvre les détails et ne bascule pas l'entité", async () => {
  const { NaiveFlexCard } = await loadCardClasses()
  const { card, calls } = createCoverCard(NaiveFlexCard)

  await card._onExtraButtonTap({ label: "Ouvrir" })

  assert.equal(calls.length, 0)
  assert.equal(card.lastEvent.type, "hass-more-info")
  assert.equal(card.lastEvent.detail.entityId, "cover.salon")
})

test("l'en-tête exécute l'action générale au clavier sans toucher aux contrôles", async () => {
  const { NaiveFlexCard } = await loadCardClasses()
  const { card, calls } = createCoverCard(NaiveFlexCard)
  card.setConfig({ entity: "cover.salon", tap_action: { action: "open-cover" } })
  let prevented = false
  let stopped = false

  await card._onHeaderKeyDown({
    key: "Enter",
    preventDefault: () => (prevented = true),
    stopPropagation: () => (stopped = true),
  })

  assert.equal(prevented, true)
  assert.equal(stopped, true)
  assert.equal(calls[0].service, "open_cover")
})

test("un service du même domaine reçoit automatiquement l'entité de la carte", async () => {
  const { NaiveFlexCard } = await loadCardClasses()
  const { card, calls } = createCoverCard(NaiveFlexCard)

  await card._runAction({ action: "call-service", service: "cover.open_cover" }, "cover.salon")
  await card._runAction({ action: "call-service", service: "notify.mobile_app" }, "cover.salon")

  assert.equal(calls[0].data.entity_id, "cover.salon")
  assert.equal("entity_id" in calls[1].data, false)
})

test("le format Home Assistant perform-action est accepté", async () => {
  const { NaiveFlexCard } = await loadCardClasses()
  const { card, calls } = createCoverCard(NaiveFlexCard)

  await card._runAction(
    {
      action: "perform-action",
      perform_action: "cover.set_cover_position",
      target: { entity_id: "cover.salon" },
      data: { position: 42 },
    },
    "cover.autre"
  )

  assert.equal(calls[0].domain, "cover")
  assert.equal(calls[0].service, "set_cover_position")
  assert.equal(calls[0].data.position, 42)
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0].target)), { entity_id: "cover.salon" })
})

test("les capacités supported_features pilotent les contrôles disponibles", async () => {
  const { NaiveFlexCard, COVER_FEATURES } = await loadCardClasses()
  const { card } = createCoverCard(NaiveFlexCard, "closed", COVER_FEATURES.OPEN | COVER_FEATURES.CLOSE)

  assert.equal(card._coverSupports(COVER_FEATURES.OPEN), true)
  assert.equal(card._coverSupports(COVER_FEATURES.CLOSE), true)
  assert.equal(card._coverSupports(COVER_FEATURES.STOP), false)
  assert.equal(card._coverSupports(COVER_FEATURES.SET_POSITION), false)
})

test("l'éditeur émet une configuration compacte", async () => {
  const { NaiveFlexCardEditor } = await loadCardClasses()
  const editor = new NaiveFlexCardEditor()
  editor.setConfig({ entity: "cover.salon" })

  editor._setValue("cover_controls.show_stop", false)

  assert.deepEqual(JSON.parse(JSON.stringify(editor.lastEvent.detail.config)), {
    cover_controls: { show_stop: false },
    entity: "cover.salon",
  })
})

test("le profil volet avec positions ne crée aucune action toggle", async () => {
  const { NaiveFlexCardEditor } = await loadCardClasses()
  const editor = new NaiveFlexCardEditor()
  editor.setConfig({ entity: "cover.salon" })
  editor._quickProfile = "cover-positions"

  editor._applyQuickProfile()

  const config = editor.lastEvent.detail.config
  assert.equal(config.control_type, "cover")
  assert.equal(config.button_row.enabled, true)
  assert.deepEqual(
    Array.from(config.button_row.buttons, (button) => button.action),
    ["set-position", "set-position", "set-position"]
  )
  assert.equal(config.button_row.buttons.some((button) => button.action === "toggle"), false)
})
