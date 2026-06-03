# TagX — Proof of Concept: GPS + BLE Tracking Tag

> **Document Purpose**: Define the scope, architecture, build plan, and success criteria for the TagX hardware proof of concept. This PoC validates that a low-cost GPS + BLE hybrid tag can log location independently, sync via Bluetooth, and prove product-market feasibility.

---

## 1. PoC Objectives

The TagX Proof of Concept answers three questions:

| # | Question | How We Prove It |
|---|---|---|
| 1 | Can a GPS + BLE tag log location **without a phone nearby** and sync later? | Prototype logs GPS coordinates to flash memory while out of BLE range, then transmits them to the app on reconnection. |
| 2 | Can the hardware hit the ₹1,050 BOM target at prototype volumes? | Detailed BOM costing with real distributor pricing. |
| 3 | Does the battery last **7+ days** with periodic GPS logging? | Power measurements across all operating modes. |

**Out of scope for PoC:**
- Final enclosure design (3D-printed shell is sufficient)
- UWB precision finding (requires additional IC)
- NB-IoT/LTE-M cellular module (B2B feature, separate PoC)
- Mobile app UI polish (basic data display is enough)

---

## 2. System Architecture

### 2.1 Block Diagram

```
┌─────────────────────────────────────────────────┐
│                   TAG HARDWARE                    │
│                                                   │
│  ┌──────────┐   ┌──────────┐   ┌──────────────┐ │
│  │  GPS     │   │  BLE 5.3 │   │  Flash Memory │ │
│  │  Module  │◄──┤  MCU     ├──►│  (SPI)        │ │
│  │  (UART)  │   │  (Nordic │   │  4-16 MB      │ │
│  └──────────┘   │  nRF52)  │   └──────────────┘ │
│                 │          │                      │
│  ┌──────────┐   │          │   ┌──────────────┐ │
│  │  Battery │   │          │   │  LED / Buzzer │ │
│  │  Mgmt IC ├──►│          │   │  (User I/O)   │ │
│  └──────────┘   └──────────┘   └──────────────┘ │
│       │                                           │
│  ┌────┴─────┐                                     │
│  │Li-Po Cell│                                     │
│  │ 500-800  │                                     │
│  │  mAh     │                                     │
│  └──────────┘                                     │
└─────────────────────────────────────────────────┘
        │ BLE
        ▼
┌─────────────────────────────────────────────────┐
│                 SMARTPHONE APP                    │
│                                                   │
│  ┌──────────┐    ┌──────────┐   ┌──────────────┐ │
│  │  BLE     │    │  Map     │   │  Cloud Sync   │ │
│  │  Scanner │───►│  View    │──►│  (API)        │ │
│  └──────────┘    └──────────┘   └──────────────┘ │
└─────────────────────────────────────────────────┘
```

### 2.2 Component Selection

| Component | Part Number | Why | Est. Cost (₹) |
|---|---|---|---|
| **MCU + BLE** | Nordic nRF52840 or nRF52832 | Industry standard for BLE. Built-in BLE 5.3, ample flash/RAM, low power. Arm M4F core. | 250–350 |
| **GPS Module** | Quectel L76K or u-blox SAM-M8Q | Multi-constellation (GPS + GLONASS + BeiDou), low power, small footprint. UART interface. | 350–450 |
| **Flash Memory** | Winbond W25Q64 (8 MB) or W25Q128 (16 MB) | SPI flash for GPS log buffer. Stores ~500K position fixes at 16 bytes each. | 80–120 |
| **Battery** | Li-Po 503040 (500 mAh) or 603040 (800 mAh) | Slim form factor, rechargeable, with JST connector. | 150–200 |
| **Battery Charger** | TP4056 or MCP73831 | Charging from micro-USB / USB-C. Under-₹10 solution. | 10–15 |
| **Voltage Regulator** | XC6206 (3.3V) or TPS63060 (buck-boost) | Efficient regulation from Li-Po (3.0–4.2V) to 3.3V for nRF52 and GPS. | 25–50 |
| **PCB** | 4-layer FR4, 30×40 mm | Standard stackup. 4 layers for good GPS antenna grounding. | 40–60 |
| **Passives/Connectors** | Inductors, caps, USB-C, test points | — | 50–80 |
| **Enclosure** | 3D-printed PLA/PETG | Rapid prototyping, custom fit. | 50–100 |
| **Total BOM (prototype qty)** | | | **₹1,005–1,425** |

> **Target BOM at scale (10K+):** ₹850–950/unit

### 2.3 Pin Mapping (nRF52840)

| nRF52 Pin | Connected To | Function |
|---|---|---|
| P0.02 | LED (Red) | Status indicator |
| P0.03 | LED (Green) | Sync indicator |
| P0.05 | Button | User input / pairing trigger |
| P0.07 | Buzzer | Find-me alert |
| P0.08 | GPS TX (UART) | GPS data in |
| P0.09 | GPS RX (UART) | GPS commands out |
| P0.13 | Flash CS (SPI) | Chip select |
| P0.14 | Flash SCK (SPI) | Clock |
| P0.15 | Flash MOSI (SPI) | Data out |
| P0.16 | Flash MISO (SPI) | Data in |
| P0.19 | Battery ADC | Voltage measurement via divider |
| P0.20 | GPS_EN | GPS power switch (MOSFET gate) |
| SWDIO | SWD | Programming/debug |
| SWDCLK | SWD | Programming/debug |

---

## 3. Firmware Architecture

### 3.1 Operating Modes

```
                    ┌─────────────────────┐
                    │     SLEEP MODE      │
                    │  MCU: SYSTEM_ON     │
                    │  GPS: OFF           │
                    │  Current: ~15 µA    │
                    │  BLE: Advertising   │
                    │  Duration: N minutes │
                    └──────────┬──────────┘
                               │ Timer expires
                               ▼
                    ┌─────────────────────┐
          ┌────────►│    GPS ACQUIRE      │◄────────┐
          │         │  Power on GPS       │         │
          │         │  Wait for fix       │         │
          │         │  Timeout: 60s max   │         │
          │         │  Current: ~45 mA    │         │
          │         └──────────┬──────────┘         │
          │                    │ Fix acquired        │
          │                    ▼                     │
          │         ┌─────────────────────┐         │
          │         │   LOG TO FLASH      │         │
          │         │  Store lat/lon/time │         │
          │         │  + battery voltage  │         │
          │         │  + movement flag    │         │
          │         │  Append to circular │         │
          │         │  buffer in flash    │         │
          │         └──────────┬──────────┘         │
          │                    │ Done                │
          │                    ▼                     │
          │         ┌─────────────────────┐         │
          │         │  GPS POWER OFF      │         │
          │         └──────────┬──────────┘         │
          │                    │                     │
          │                    ▼                     │
          │         ┌─────────────────────┐         │
          │         │  BLE CHECK          │         │
          ├─────────┤  Advertise N seconds│         │
          │         │  Phone connected?   │─────────┘
          │         └──────────┬──────────┘
          │                    │ No
          │                    ▼
          │         ┌─────────────────────┐
          └─────────┤    BACK TO SLEEP    │
                    └─────────────────────┘
```

### 3.2 GPS Logging Strategy

| Parameter | Value | Rationale |
|---|---|---|
| Log interval (stationary) | 30 minutes | Preserve battery when tag isn't moving |
| Log interval (moving) | 2 minutes | Capture path accurately during motion |
| Movement detection | GPS speed > 3 km/h or accelerometer | nRF52 internal or external IMU |
| GPS timeout | 60 seconds | Prevent infinite drain in no-sky conditions |
| Flash capacity | 8 MB ≈ 500,000 fixes | At 2/hr avg, ~28 years of data |
| Data per fix | 16 bytes | Lat (4) + Lon (4) + Unix time (4) + battery (2) + flags (2) |

### 3.3 BLE Protocol

| Service | Characteristic | Properties | Description |
|---|---|---|---|
| Device Info (0x180A) | Serial Number | Read | Unique tag ID |
| TagX Service | GPS Log Count | Read | Number of unsynced fixes |
| TagX Service | GPS Log Data | Read + Notify | Stream fixes in pages of 20 |
| TagX Service | Command | Write | Pair, Set interval, Find me, Reset |
| TagX Service | Battery Level | Read + Notify | Voltage mapped to 0–100% |
| TagX Service | RTC Sync | Write | Phone syncs Unix time to tag |

### 3.4 Power Budget

| Mode | Current | Duration per cycle | Duty cycle per day | Daily charge (mAh) |
|---|---|---|---|---|
| Sleep (BLE advertising) | 15 µA | Continuous | 24 hrs | 0.36 |
| GPS acquire (cold fix) | 45 mA | 45s avg | 48× (30 min interval) | 24.00 |
| GPS acquire (hot fix) | 25 mA | 8s avg | 48× | 2.67 |
| Flash write | 15 mA | 50ms | 48× | 0.01 |
| BLE sync (phone nearby) | 5 mA | 10s avg | 10× | 0.14 |
| **Total daily** | | | | **~27.2 mAh** |

**Battery life estimates:**

| Battery | Capacity | Est. Life (stationary) | Est. Life (moving) |
|---|---|---|---|
| 500 mAh Li-Po | 500 mAh | **18 days** | **8 days** |
| 800 mAh Li-Po | 800 mAh | **29 days** | **13 days** |
| 1200 mAh Li-Po (larger enclosure) | 1200 mAh | **44 days** | **20 days** |

> **PoC target**: Minimum 7 days of real-world usage with 500 mAh battery. This is achievable with optimised GPS sampling.

---

## 4. Prototype Build Plan

### 4.1 Phase 1 — Development Board (Weeks 1–2)

Use an off-the-shelf nRF52840 Development Kit (nRF52840 DK or Adafruit Feather nRF52840) + GPS breakout board + microSD card for flash.

```
Week 1:
  └── Set up Zephyr RTOS / nRF5 SDK project
  └── Basic BLE peripheral: advertise, connect, read/write characteristics
  └── GPS module UART communication: configure, parse NMEA sentences
  └── Log GPS data to flash via FATFS

Week 2:
  └── Power management: sleep modes, GPS on/off control
  └── Implement circular buffer for GPS logs
  └── BLE data transfer: stream logged GPS points to phone
  └── Basic phone app (nRF Connect or custom) to verify data
```

**Deliverable:** Breadboard prototype. GPS fixes logged to flash, transmitted via BLE to phone app. Battery life measured.

### 4.2 Phase 2 — Custom PCB (Weeks 3–5)

Design a compact 4-layer PCB integrating all components.

```
Week 3:
  └── Schematic capture (KiCad / Altium)
  └── Component selection and footprint creation
  └── Power tree analysis

Week 4:
  └── PCB layout: 30×40 mm, 4-layer
  └── GPS antenna keep-out and ground plane design
  └── BLE antenna matching (pi-network)
  └── Design review

Week 5:
  └── Generate Gerber files
  └── Order from JLCPCB (5 pcs, 48-hr turnaround)
  └── Order components from LCSC / Mouser
  └── Prepare stencil for reflow
```

**Deliverable:** 5 assembled PCB prototypes. Order-to-delivery: ~2 weeks.

### 4.3 Phase 3 — Assembly & Testing (Weeks 6–8)

```
Week 6:
  └── Solder first board (hot plate / reflow oven)
  └── Power-on test: check voltages, current draw
  └── Debug UART output from nRF52
  └── Program bootloader + application via SWD

Week 7:
  └── GPS functional test: outdoor fix acquisition, sensitivity
  └── BLE range test: paired/unpaired modes
  └── Flash endurance: write/read/erase cycles
  └── Battery charging circuit validation

Week 8:
  └── Integration test: full day of GPS logging + BLE sync
  └── Power measurement: sleep, acquire, sync modes
  └── 3D-printed enclosure design and fit check
  └── PoC demo: attach tag to luggage → airport run → recovery
```

**Deliverable:** 3 working prototypes in 3D-printed enclosures, ready for field testing.

---

## 5. Testing & Validation

### 5.1 Functional Tests

| Test | Method | Pass/Fail Criteria |
|---|---|---|
| GPS fix acquisition | Outdoor, clear sky | Cold fix < 60s, hot fix < 10s |
| GPS fix in urban canyon | Mumbai street with buildings | Fix within 120s, accuracy < 15m |
| BLE pair & bond | Android + iOS | Pair once, auto-connect on subsequent |
| BLE range | Open field, phone in pocket | Reliable up to 80m (nRF52840) |
| Flash write endurance | Continuous logging for 24 hrs | Zero data loss, proper circular buffer wrap |
| Data sync | 500 unsynced fixes, trigger BLE sync | All 500 fixes transferred < 30s |
| RTC accuracy | 24 hr drift test | Drift < 5s/day (compensated by phone sync) |

### 5.2 Power Tests

| Test | Method | Pass/Fail Criteria |
|---|---|---|
| Sleep current | Measure with DMM in series | < 25 µA (including BLE advertising) |
| GPS active current | Measure during fix acquisition | < 50 mA average |
| BLE sync current | Measure during data transfer | < 10 mA average |
| Total daily drain | Log for 48 hrs, measure capacity used | < 50 mAh/day (stationary) |
| Battery life projection | Extrapolate from 48-hr measurement | > 10 days with 500 mAh |

### 5.3 Field Tests

| Test | Scenario | Success Metric |
|---|---|---|
| Luggage tracking | Tag in checked bag, Mumbai→Delhi flight | GPS log captures departure and arrival zones. 100% of across-flight positions logged. |
| Bike recovery simulation | Tag hidden on bike, bike "stolen" to another location | GPS path recoverable from flash after recovery. Path accuracy within 10m of actual route. |
| Daily carry | Tag in wallet, 7 days of normal use | Battery lasts 7+ days. All daily positions logged. BLE sync happens automatically when phone is near. |
| Pet tracking simulation | Tag on dog collar, dog walks 2 km from home | GPS path shows full walk. Geofence alert triggers when leaving 500m home zone. |

---

## 6. PoC Budget

| Item | Quantity | Unit Cost (₹) | Total (₹) |
|---|---|---|---|
| **Development Kit** | | | |
| nRF52840 DK | 1 | 2,500 | 2,500 |
| GPS breakout (MAX-M8Q) | 2 | 1,200 | 2,400 |
| MicroSD breakout + cards | 2 | 300 | 600 |
| Breadboard + wires + misc | 1 | 500 | 500 |
| **PCB Prototypes** | | | |
| PCB fab (5 pcs, JLCPCB) | 1 lot | 1,500 | 1,500 |
| Components (BOM × 5) | 1 lot | 7,000 | 7,000 |
| Stencil + solder paste | 1 | 500 | 500 |
| **Assembly & Test** | | | |
| 3D-printed enclosures | 5 | 100 | 500 |
| Batteries + connectors | 10 | 180 | 1,800 |
| USB-C cables | 5 | 100 | 500 |
| Test equipment (if not owned) | 1 | 3,000 | 3,000 |
| **Software & Services** | | | |
| nRF5 SDK / Zephyr RTOS | — | Free | 0 |
| Segger J-Link EDU | 1 | 2,500 | 2,500 |
| KiCad (PCB design) | — | Free | 0 |
| Cloud infrastructure (AWS, 3 mo) | 1 | 6,000 | 6,000 |
| Apple Developer Program (1 yr) | 1 | 7,500 | 7,500 |
| Domain name + basic hosting (1 yr) | 1 | 1,500 | 1,500 |
| SMS/email API credits (test) | 1 | 1,000 | 1,000 |
| Travel & local transport (field tests) | 1 | 1,475 | 1,475 |
| **Contingency** | | | 3,500 |
| **TOTAL PoC BUDGET** | | | **₹44,275** |

> **Note**: Test equipment (multimeter, oscilloscope, logic analyser) assumed available in an engineering lab. If purchasing from scratch, add ₹8,000–15,000.

---

## 7. Success Criteria

The PoC is deemed successful when ALL of the following are met:

| # | Criterion | Measurement |
|---|---|---|
| 1 | GPS log works without phone nearby | Tag logs GPS for 8+ hours with phone in airplane mode. Data syncs when BLE reconnects. |
| 2 | End-to-end data flow | GPS fix → flash → BLE → phone → cloud → map display. No data loss. |
| 3 | Battery life ≥ 7 days | 500 mAh battery powers the tag for minimum 7 days with 30-min GPS interval. |
| 4 | BOM cost ≤ ₹1,050 | At prototype volume (100 pcs), total BOM + assembly ≤ ₹1,050. |
| 5 | Cross-platform BLE pairing | Works with both Android (Google Pixel, Samsung) and iOS (iPhone 13+). |
| 6 | GPS accuracy ≤ 10m | 80% of fixes within 10m of ground truth (measured against Google Maps). |

---

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| GPS fix too slow or fails indoors | Medium | High | Design for outdoor use. Fall back to BLE proximity (last known location) when GPS unavailable. Document expected behaviour. |
| Battery life below 7 days | Medium | High | Use adaptive GPS interval (longer when stationary). Add option for power-save mode with GPS off. |
| BLE range insufficient | Low | Medium | nRF52840 has excellent range (80m+). Use antenna matching network on PCB. |
| Flash corruption on power loss | Low | High | Implement CRC checks on each log entry. Use journaling write pattern. |
| BOM cost exceeds target | Medium | Medium | Alternative GPS modules (ATGM336H at ₹200 vs Quectel at ₹400). Simpler 2-layer PCB at scale. |
| Component shortages | Medium | High | Identify 2-3 alternative sources for each critical IC. nRF52840 has pin-compatible nRF52832 as fallback. |

---

## 9. Timeline

```
Week 1  │████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░│  BLE + GPS breadboard, basic firmware
Week 2  │████████████████░░░░░░░░░░░░░░░░░░░░░░░│  Flash logging, power management, BLE sync
Week 3  │████████████████████████░░░░░░░░░░░░░░░│  Schematic capture, component ordering
Week 4  │████████████████████████████████░░░░░░░░│  PCB layout, design review
Week 5  │██████████████████████████████████████░░│  Gerber release, PCB order, stencil
Week 6  │████████████████████████████████████████│  Board assembly, power-on, bring-up
Week 7  │████████████████████████████████████████│  Functional test, debug, field test
Week 8  │████████████████████████████████████████│  Enclosure, demo prep, PoC sign-off

        │░░░░░░░░░░│░░░░░░░░░░│░░░░░░░░░░│░░░░░░░░░░│░░░░░░░░░░│░░░░░░░░░░│░░░░░░░░░░│░░░░░░░░░░│
       Week 1     Week 2     Week 3     Week 4     Week 5     Week 6     Week 7     Week 8
```

**Total duration: 8 weeks** (can be compressed to 6 weeks with parallel PCB design + firmware development).

---

## 10. Deliverables

At the end of the PoC, the following are delivered:

1. **3 working prototypes** in 3D-printed enclosures
2. **Firmware source code** (Zephyr RTOS or nRF5 SDK)
3. **PCB design files** (KiCad / Altium — schematic + layout + Gerbers)
4. **BOM** with verified pricing at prototype and production volumes
5. **Test report** with power measurements, GPS accuracy, BLE range
6. **Field test video** — luggage tracking demo (Mumbai→Delhi flight)
7. **Go/No-Go recommendation** for production investment

---

## 11. Path to Production

After successful PoC:

| Phase | Timeline | Investment | Volume |
|---|---|---|---|
| **PoC** (this document) | 8 weeks | ₹27,000 | 3 units |
| **EVT** (Engineering Validation) | 12 weeks | ₹5,00,000 | 100 units |
| **DVT** (Design Validation) | 8 weeks | ₹10,00,000 | 500 units |
| **PVT** (Production Validation) | 8 weeks | ₹15,00,000 | 2,000 units |
| **MP** (Mass Production) | Ongoing | ₹37,00,000 (tooling + setup) | 10,000+ units/month |

> EVT phase includes: FCC/BIS certification, injection-moulded enclosure, reliability testing, mobile app v1. This is typically funded by the seed round.

---

## Appendix A: Component Datasheets

| Component | Datasheet / Link |
|---|---|
| Nordic nRF52840 | https://infocenter.nordicsemi.com/pdf/nRF52840_PS_v1.2.pdf |
| Quectel L76K | https://www.quectel.com/product/gps-l76k/ |
| u-blox SAM-M8Q | https://www.u-blox.com/en/product/sam-m8q-module |
| TP4056 Charger | https://www.analog.com/en/products/tp4056.html |
| Winbond W25Q64 | https://www.winbond.com/resource-files/w25q64jv%20revg%2003272021.pdf |

## Appendix B: Bill of Materials (Prototype × 100)

| Ref | Part | Qty/Unit | Unit Price (₹) | Extended (₹) |
|---|---|---|---|---|
| U1 | nRF52840 QFN | 1 | 290 | 290 |
| U2 | Quectel L76K (GPS) | 1 | 380 | 380 |
| U3 | W25Q64 (Flash) | 1 | 85 | 85 |
| U4 | TP4056 (Charger) | 1 | 8 | 8 |
| U5 | XC6206 (3.3V LDO) | 1 | 12 | 12 |
| B1 | Li-Po 503040 (500 mAh) | 1 | 160 | 160 |
| PCB | 4-layer FR4, 30×40 mm | 1 | 45 | 45 |
| ANT1 | GPS patch antenna | 1 | 25 | 25 |
| Passive | Caps, resistors, LED, button | 1 lot | 55 | 55 |
| Conn | USB-C, battery JST, test pins | 1 lot | 30 | 30 |
| **Total per unit** | | | | **₹1,090** |
| **Target at 10K** | | | | **₹890** |
