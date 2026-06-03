# TagX — China Sourcing Guide

> How to source, manufacture, and ship TagX from China — including supplier contacts, pricing, and logistics for both prototype and production volumes.

---

## 1. Sourcing Strategy

### 1.1 What to Source from China vs India

| Item | Source | Rationale |
|---|---|---|
| **GPS modules** (Quectel/ATGM336H) | China | Quectel is a Chinese company. Price is 40-60% lower than Mouser/Digikey. |
| **BLE MCU** (nRF52840 / CH582) | China | nRF52 from Chinese distributors is 30% cheaper. Chinese MCUs like CH582/TLSR8258 are 5× cheaper. |
| **Flash memory** (Winbond) | China | Commodity component. ¥2-3 vs ₹40 at Indian distributors. |
| **Li-Po batteries** | China | Shenzhen battery pricing is unbeatable. ¥5-8 for 500 mAh with JST. |
| **PCB fabrication** | China | JLCPCB / PCBWay. 5 pcs for $2 + shipping. India PCB fab is 3-4× more expensive. |
| **PCBA (assembly)** | China | Turnkey assembly at JLCPCB or SMT factory. ¥0.01-0.03 per joint. |
| **Enclosure (3D print)** | India (local) | 3D-printed prototypes are faster locally. SLA from ₹500/pc. |
| **Injection mold (production)** | China | Steel molds in Shenzhen: ¥15,000-40,000 vs ₹3L+ in India. |
| **Final assembly + testing** | India | Assemble in India to save 15% import duty. Flash firmware locally. |
| **Packaging + box** | India (Mumbai) | Local print shops are cheaper for small runs. |

**Golden rule**: Components + PCB in China. Assembly + testing + packaging in India.

---

## 2. Component Pricing — China vs India

### 2.1 Bill of Materials (China-Sourced)

| Component | Chinese Part | China Price (¥) | India Price (₹) | Savings |
|---|---|---|---|---|
| **BLE MCU** — nRF52840 QFN | LCSC: C_105342 | ¥14.50 (₹170) | ₹290 | 41% |
| **Alternative MCU** — CH582F (RISC-V BLE 5.3) | LCSC: C_2843965 | ¥3.80 (₹45) | ₹120 (if avail) | 62% |
| **Alternative MCU** — ESP32-C3 (BLE + WiFi) | LCSC: C_2858338 | ¥5.20 (₹61) | ₹150 | 59% |
| **GPS module** — Quectel L76K | LCSC: C_527702 | ¥28.00 (₹328) | ₹380 | 14% |
| **GPS module** — ATGM336H-5N (Chinese, BDS+GPS) | 1688.com | ¥15.00 (₹176) | ₹250 | 30% |
| **Flash** — Winbond W25Q64 (8 MB) | LCSC: C_97686 | ¥2.30 (₹27) | ₹85 | 68% |
| **Flash** — XTX XT25F64 (compatible) | 1688.com | ¥1.60 (₹19) | ₹50 (est.) | 62% |
| **Li-Po** — 503040 500 mAh with JST | 1688.com | ¥5.80 (₹68) | ₹160 | 58% |
| **Li-Po** — 603048 800 mAh with JST | 1688.com | ¥7.50 (₹88) | ₹200 | 56% |
| **Charger IC** — TP4056 | LCSC: C_215465 | ¥0.50 (₹6) | ₹8 | 25% |
| **LDO** — XC6206P332MR | LCSC: C_84157 | ¥0.15 (₹2) | ₹12 | 83% |
| **Buzzer** — Magnetic 5V 85dB | 1688.com | ¥0.80 (₹9) | ₹15 | 40% |
| **RGB LED** — SK6812 side-view | LCSC: C_207276 | ¥0.60 (₹7) | ₹5 | — |
| **PCB** — 4-layer FR4 30×40mm ENIG (100 pcs) | JLCPCB | ¥80 total (¥0.80/pc) | ₹45/pc | 79% |
| **PCB** — 2-layer FR4 30×40mm HASL (100 pcs) | JLCPCB | ¥25 total (¥0.25/pc) | ₹25/pc | 90% |
| **Passives** — 0402/0603 kit | LCSC | ¥15 (full set for 100 units) | ₹55 | 66% |

### 2.2 Total BOM Comparison

| Config | China Sourced | India Sourced | Savings |
|---|---|---|---|
| **nRF52840 + Quectel L76K + 8MB Flash + 500mAh** | **¥60 (₹705)** | ₹1,090 | **35%** |
| **CH582F + ATGM336H + 8MB Flash + 500mAh** | **¥29 (₹341)** | ₹750 (est.) | **55%** |
| **ESP32-C3 + ATGM336H + 8MB Flash + 800mAh** | **¥33 (₹388)** | ₹820 (est.) | **53%** |

> **Baseline recommendation for prototype**: nRF52840 + Quectel L76K (tried and tested, lots of community support)
>
> **Recommendation for production**: CH582F + ATGM336H (RISC-V + Chinese GPS = ¥29 BOM = ₹341!)

---

## 3. Where to Buy — Platform Guide

### 3.1 Platforms

| Platform | URL | Best For | Payment | Shipping to India |
|---|---|---|---|---|
| **LCSC** (立创商城) | lcsc.com | Components, genuine parts, cheap | Credit card, PayPal, Wire | DHL/FedEx, 3-5 days |
| **1688.com** (阿里巴巴) | 1688.com | Batteries, cables, buzzers, enclosures, custom parts | Wire transfer (T/T) | Forwarder needed |
| **Alibaba** | alibaba.com | Full turnkey, factories, MOQ ≥ 500 | T/T, Trade Assurance | Factory arranges |
| **Taobao** | taobao.com | Samples, small qty, cheap Chinese parts | Alipay (via forwarder) | Forwarder needed |
| **JLCPCB** | jlcpcb.com | PCB + PCBA (turnkey assembly) | Credit card, PayPal | DHL, 3-5 days (¥65 flat) |
| **PCBWay** | pcbway.com | PCB + PCBA + 3D printing + CNC | Credit card, PayPal | DHL, 3-5 days |

### 3.2 Step-by-Step: Ordering Components from LCSC (Easiest)

1. Go to lcsc.com — English interface, credit card accepted
2. Search part numbers from the BOM above
3. Add to cart, upload BOM CSV for bulk check
4. **Important**: Enable "full reels" toggle if you need reels (for PCBA), or use cut tape for hand assembly
5. Shipping: DHL Express (¥65-120, 3-5 days to Mumbai)
6. Customs: LCSC declares at value. Expect 18% GST + 10% customs duty. Ask for "commercial sample" declaration to reduce duty.

### 3.3 Step-by-Step: PCB Assembly at JLCPCB (Prototype)

1. Go to jlcpcb.com → "SMT Assembly"
2. Upload Gerber files + BOM + Pick-and-Place (centroid) file
3. JLCPCB has ~200K parts in their "basic parts" library (free assembly)
4. Parts not in basic library → you order from LCSC and ship to JLCPCB
5. **Timeline**: PCB (2 days) + Assembly (3 days) + DHL (3-5 days) = **8-10 days total**
6. **Cost estimate (50 pcs)**: PCB ¥80 + Assembly ¥350 + LCSC parts ¥3,000 + DHL ¥100 = **¥3,530 (₹41,500)**
7. Get quote at: https://jlcpcb.com/quote

### 3.4 Step-by-Step: Full Turnkey Factory (Production — MOQ 500+)

1. Search Alibaba for: "GPS tracker OEM manufacturer" or "Bluetooth tag assembly factory"
2. Recommended suppliers to contact:

| Supplier | Location | Specialty | MOQ | Est. Unit Price (1000 pcs) |
|---|---|---|---|---|
| **Shenzhen Eelink** | Shenzhen | GPS trackers, IoT devices | 500 | ¥45-55 (₹530-650) |
| **Shenzhen iTrack** | Shenzhen | BLE tags, asset trackers | 1000 | ¥38-48 (₹450-565) |
| **Shenzhen Transand** | Shenzhen | Wearables, small electronics | 500 | ¥50-60 (₹590-710) |
| **Shenzhen Covox** | Shenzhen | Bluetooth devices | 1000 | ¥42-52 (₹495-615) |
| **Dongguan Kaisida** | Dongguan | PCB assembly + box build | 2000 | ¥35-45 (₹415-530) |

---

## 4. Communication Templates

### 4.1 Initial Contact (Alibaba Inquiry)

> **Subject**: Inquiry for GPS + BLE Smart Tracker OEM Manufacturing
>
> Hello [Supplier Name / Team],
>
> I am developing a GPS + BLE smart tracker for the Indian market. Expected initial order: 1,000 units. Target monthly volume: 5,000-10,000 units by Q2 2027.
>
> **Required specifications:**
> - MCU: BLE 5.0+ (nRF52840 or equivalent, Chinese MCU alternatives welcome)
> - GPS: Multi-constellation (GPS + BeiDou + GLONASS), Quectel L76K or equivalent
> - Flash: 4-8 MB SPI NOR flash for GPS log storage
> - Battery: 500-800 mAh Li-Po, rechargeable via USB-C (TP4056 or MCP73831)
> - PCB: 30×40 mm, 4-layer (or can optimize)
> - Enclosure: IPX4 rated, keychain hole, 55×35×12 mm target
>
> **Requested from you:**
> 1. Can you provide a turnkey quote (components + PCB + assembly + enclosure)?
> 2. What is your MOQ for the first order?
> 3. Lead time for first batch of 500-1000 units?
> 4. Do you have a reference design for a similar product?
> 5. Can you assist with firmware development or do you need firmware provided?
> 6. Do you support FOB Shenzhen or DDP Mumbai shipping?
>
> Looking forward to discussing. I can share detailed BOM and design files on request.
>
> Best regards,
> [Your Name]
> TagX — India
> WhatsApp: +91 XXXXXXXXXX
> WeChat: [your WeChat ID]

### 4.2 WeChat Follow-up (Day 3-5)

> Hi [Name], this is [Your Name] from TagX. I sent an inquiry on Alibaba about our GPS tracker — did you get a chance to review?
>
> Quick summary: BLE + GPS tracker, 1000 unit MOQ, we provide BOM and gerber, you do PCBA + enclosure + testing. Target FOB Shenzhen.
>
> Can we set up a quick video call this week? My WeChat is [ID].

### 4.3 Technical Clarification (After Initial Quote)

> Thanks for the quote. A few technical clarifications:
>
> 1. **GPS chip**: Can you confirm the GPS module supports assisted GPS (AGPS) for faster indoor fix?
> 2. **BLE range**: What is the expected BLE range with the antenna design? We need 50m+ in open air.
> 3. **Battery**: What is the rated discharge rate of the 500 mAh cell? We need 1C continuous.
> 4. **Firmware**: We will provide firmware. Can you program the MCUs before assembly (ICSP), or do we need to program after assembly?
> 5. **Testing**: What QA testing is included in the quote? (RF testing? GPS fix test? Battery cycle test?)
> 6. **Samples**: Can you provide 10 engineering samples before mass production? Cost?

---

## 5. Production Cost Breakdown (China)

### 5.1 Prototype (50 units — JLCPCB + Hand Assembly)

| Item | Cost (¥) | Cost (₹) |
|---|---|---|
| PCB 4-layer ENIG (50 pcs, 30×40mm) | 80 | 940 |
| LCSC components (BOM for 50 pcs) | 3,000 | 35,300 |
| SMT assembly at JLCPCB (50 pcs, ~200 joints each) | 350 | 4,120 |
| 3D-printed enclosure (SLA, 10 pcs from local) | — | 5,000 |
| Li-Po batteries (50 pcs from 1688) | 290 | 3,410 |
| DHL shipping (PCB + components + assembled boards) | 200 | 2,350 |
| Customs + duties (28% on declared ¥2,000) | 560 | 6,580 |
| **Total** | **¥4,480** | **₹57,700** |
| **Per unit** | **¥90** | **₹1,154** |

### 5.2 Pilot Run (500 units — Small Factory Turnkey)

| Item | Per Unit (¥) | Total (¥) | Total (₹) |
|---|---|---|---|
| Components (BOM at Chinese pricing) | 32 | 16,000 | 1,88,300 |
| PCB + PCBA (includes testing) | 15 | 7,500 | 88,300 |
| Enclosure (injection mold — amortized over 500) | 30 + 20,000 mold | 35,000 | 4,11,800 |
| Battery | 7 | 3,500 | 41,200 |
| Packaging + manual | 5 | 2,500 | 29,400 |
| Firmware flashing + functional test | 4 | 2,000 | 23,500 |
| FOB Shenzhen logistics | 3 | 1,500 | 17,600 |
| **Total FOB** | **¥96** | **¥68,000** | **₹8,00,100** |
| Sea freight (1 CBM to Mumbai) | — | ¥1,800 (₹21,200) | 21,200 |
| Insurance + customs clearance | — | ¥5,000 (₹58,800) | 58,800 |
| BIS certification (mandatory for Bluetooth devices) | — | — | 2,50,000 |
| **Total Landed Mumbai** | **¥149** | **¥74,800** | **₹11,30,100** |
| **Per unit landed cost** | **¥150** | | **₹2,260** |

> **Note**: The injection mold cost (¥20,000 / ₹2.4L) dominates small runs. At 5,000 units, mold amortization drops to ¥4/unit, making the landed cost ~₹1,100.
> **BIS certification**: ₹2.5L for Bluetooth devices under IS 13252. Required before selling in India. Start this process in parallel — don't wait until production is ready.

### 5.3 Mass Production (10,000 units — Full Turnkey)

| Item | Per Unit (¥) | Total (¥) | Total (₹) |
|---|---|---|---|
| Components (BOM, volume pricing) | 22 | 2,20,000 | 25,88,000 |
| PCB + PCBA (panelized, automated line) | 8 | 80,000 | 9,41,000 |
| Enclosure (injection mold amortized) | 4 (mold ¥40K ÷ 10K) | 80,000 | 9,41,000 |
| Battery | 5 | 50,000 | 5,88,000 |
| Packaging + manual + carton | 3 | 30,000 | 3,53,000 |
| Firmware + testing | 2 | 20,000 | 2,35,000 |
| FOB Shenzhen | 2 | 20,000 | 2,35,000 |
| **Total FOB** | **¥46** | **¥5,00,000** | **₹58,81,000** |
| Sea freight (2 CBM) | — | ¥2,200 (₹25,900) | 25,900 |
| Customs + duties + GST (28% effective on landed value) | — | ¥1,34,000 | 16,73,000 |
| **Total Landed Mumbai** | **¥64** | **¥6,36,200** | **₹75,79,900** |
| **Per unit landed cost** | **¥64** | | **₹758** |

> **Target retail price**: ₹2,999 → **Gross margin: 75%**
>
> At this scale, the India-assembly model (import components + PCB only, assemble locally) saves ₹100-150/unit on import duties.

---

## 6. Logistics — Getting It to India

### 6.1 Shipping Options

| Method | Cost per kg | Time | Best For |
|---|---|---|---|
| **DHL/FedEx Express** | ¥25-35/kg | 3-5 days | Samples, prototypes, urgent (<10 kg) |
| **Air freight** | ¥12-18/kg | 7-10 days | Small batches (10-100 kg) |
| **Sea freight (LCL)** | ¥3-7/kg | 25-35 days | Production orders (500+ kg) |
| **China Post / ePacket** | ¥1-3/kg | 15-30 days | Small components, non-urgent |

### 6.2 Freight Forwarders for India

| Forwarder | Route | Contact |
|---|---|---|
| **Shenzhen Yicheng Logistics** | Shenzhen → Mumbai/Delhi | Alibaba: "Yicheng Freight" |
| **DL Global Logistics** | Shenzhen → Nhava Sheva (Mumbai port) | dlgloballogistics.com |
| **Maersk (direct)** | Shanghai → Mundra/Nhava Sheva | maersk.com |
| **iContainers** | Shenzhen → Mumbai | icontainers.com |
| **Freightos** | Marketplace — compare rates | freightos.com |

### 6.3 Customs & Duties (India)

| Cost Head | Rate | Example (₹10L invoice) |
|---|---|---|
| Basic Customs Duty (GPS tracker) | 10% | ₹1,00,000 |
| Social Welfare Surcharge (10% of BCD) | 1% | ₹10,000 |
| IGST (Integrated GST) | 18% | ₹1,98,000 |
| **Total duty incidence** | **~28.8%** | **₹3,08,000** |
| Customs handling + CHA fees | ₹5,000-15,000 | ₹10,000 |
| **Effective duty rate** | **~30%** | **₹3,18,000** |

> **Trick**: Ship as "PCBA + components" and "enclosure" separately. Enclosures at 10% duty vs finished product at 20%. Do final assembly in India. Consult a customs house agent (CHA) in Mumbai before first shipment.

### 6.4 Recommended CHA (Customs House Agent) for Mumbai

| Agent | Phone | Notes |
|---|---|---|
| **Best Customs Clearance** (Andheri) | +91 98200 XXXXX | Handles electronics imports |
| **SK Global Logistics** (Nhava Sheva) | +91 9870X XXXXX | Specializes in IoT devices |
| **Sayona Group** (Mumbai) | sayonagroup.com | Large operations, reliable |

> Get these contacts by searching "customs clearance mumbai electronics" on Google or IndiaMART.

---

## 7. Recommended Sourcing Roadmap

```
Week 0-1     LCSC order (prototype components - nRF52 + GPS + flash)
             ├── DHL 3-5 days → breadboard prototyping begins
             │
Week 2-4     JLCPCB PCB order + hand assembly
             ├── 10 bare boards → hand solder 5, test circuits
             │
Week 4-6     1688.com battery + buzzer order
             ├── Samples via forwarder (7-10 days)
             │
Week 6-7     Contact 5 factories on Alibaba
             ├── Send RFQ, compare quotes (2 weeks for reply)
             │
Week 8-10    Order 100 pcs from best factory
             ├── Negotiate: 50% advance, 50% on shipment
             ├── Visit factory in Shenzhen (₹30K trip)
             │
Week 12-16   Receive pilot batch
             ├── QC inspection in Shenzhen before shipping
             ├── Sea freight to Mumbai (30 days)
             ├── Customs clearance (3-7 days post arrival)
```

---

## 8. Key Contacts (Curated Alibaba Suppliers)

### 8.1 Recommended Suppliers for TagX

| Company | Alibaba Store | MOQ | Lead Time | Payment | Rating |
|---|---|---|---|---|---|
| **Shenzhen Topfeels Electronics** | topfeels.en.alibaba.com | 500 pcs | 25-30 days | T/T, LC | 4.8★ |
| *Specializes in*: GPS trackers, personal alarms. Already makes similar products. Can modify existing design. | | | | | |
| **Shenzhen Aidehai Technology** | aidehai.en.alibaba.com | 1000 pcs | 20-25 days | T/T | 4.7★ |
| *Specializes in*: BLE devices, smart tags, ODM services. Has reference design for BLE + flash loggers. | | | | | |
| **Huizhou Allsmart Technology** | allsmarten.alibaba.com | 2000 pcs | 30-35 days | T/T, PayPal | 4.6★ |
| *Specializes in*: Asset trackers, BLE beacons, GPS loggers. Good for higher volume production. | | | | | |
| **Shenzhen Woquan Technology** | woquantech.en.alibaba.com | 100 pcs | 15-20 days | T/T, PayPal, Trade Assurance | 4.5★ |
| *Specializes in*: Small batch production, prototyping services. Good for pilot run. | | | | | |

### 8.2 Red Flags When Evaluating Suppliers

| Red Flag | What to Do |
|---|---|
| Insists on 100% payment before production | Walk away. Standard is 30-50% deposit, 50-70% before shipment. |
| Cannot provide photos/video of factory | Ask for WeChat video call. If they refuse, suspicious. |
| Price is 30%+ lower than other quotes | Likely using counterfeit components or cutting corners. Reject. |
| Shipping by "express" for 1000+ units | Ridiculous. Sea freight is the only economical option. |
| No EMC/RF testing capability | You'll need FCC/BIS compliance. Factory should have a spectrum analyzer. |
| Offers no warranty on assembled units | Minimum 12-month warranty is standard. |

---

## 9. Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Counterfeit components from LCSC | Very Low | Medium | Stick to "Original" filter on LCSC. Avoid "Replacement" parts. |
| Factory delays | Medium | High | Build 2-week buffer. Contract specifies 1% penalty per week delay. |
| Poor solder quality | Medium | High | Request QC photos + X-ray inspection report before shipping. |
| IP theft / cloned design | Low (GPS tracker is commodity) | Medium | Don't share source code. Send compiled firmware binary. Use encrypted bootloader. |
| GPS sensitivity lower than expected | Medium | High | Request GPS sensitivity test report before production. Test samples yourself before PO. |
| BIS certification fails | Low | Medium | Pre-test with BIS lab in India (₹50K) before full compliance application. |
| Chinese New Year shutdown | High (if Jan-Feb) | High | Plan production around CNY. Factories close 2-3 weeks. Order extra stock beforehand. |

---

## 10. Payment Guide

| Payment Method | Pros | Cons |
|---|---|---|
| **Trade Assurance** (Alibaba) | Free dispute resolution. Refund possible for defective goods. | 0.8% fee capped at $250. Suppliers inflate price slightly. |
| **T/T Wire Transfer** (Telegraphic Transfer) | No fees (except bank charges). Standard in industry. | No buyer protection. Need supplier trust. |
| **Letter of Credit (L/C)** | Safe for both parties. Bank guarantees payment. | Complicated. ¥2,000-5,000 bank fees. Overkill for <$50K. |
| **PayPal** | Buyer protection. Easy. | 4.4% fee. Most factories don't accept. |
| **WeChat Pay / Alipay** | Instant. 0.1% fee. | Need Chinese bank account. Can use via agent. |

**Recommendation for TagX:**
- **Prototype orders** (< $500): PayPal or Alibaba Trade Assurance
- **Pilot run** ($5K-10K): 30% T/T deposit + 70% Trade Assurance before shipment
- **Production** ($30K+): 30% T/T + 70% L/C, or visit factory and pay after QC inspection

---

## 11. Cost Summary — All Scenarios

| Scenario | Volume | Per Unit (Landed ₹) | Per Unit (FOB ¥) | Total Investment |
|---|---|---|---|---|
| **Dev kit prototype** (hand-built) | 3 pcs | ₹1,540 | — | ₹4,620 |
| **JLCPCB prototype + hand assembly** | 50 pcs | ₹1,154 | ¥90 | ₹57,700 |
| **Factory pilot** (turnkey, injection mold) | 500 pcs | ₹2,260 | ¥150 | ₹11,30,100 |
| **Factory pilot** (CNC enclosure, no mold) | 500 pcs | ₹1,120 | ¥80 | ₹5,60,000 |
| **Mass production** (steel mold amortized) | 10,000 pcs | ₹758 | ¥64 | ₹75,79,900 |
| **Mass production** (final assembly in India) | 10,000 pcs | ₹680 | ¥55 | ₹67,94,000 |
| **Long-term target** (100K+, full vertical) | 100,000 pcs | ₹550 | ¥42 | — |

---

## 12. Quick Start Checklist

- [ ] **Right now**: Search "lcsc.com" → add nRF52840 + Quectel L76K + W25Q64 to cart → order (₹3,500-4,000)
- [ ] **This week**: Create Alibaba account, send RFQ to all 5 recommended suppliers above
- [ ] **This week**: Download WeChat, add supplier contacts from Alibaba
- [ ] **Week 1-2**: Upload PCB Gerbers to JLCPCB → quote SMT assembly → order 50 pcs
- [ ] **Week 2-3**: Search "Li-Po 503040 500mAh" on 1688.com via a buying agent
- [ ] **Week 4**: Finalize factory for pilot run based on quotes received
- [ ] **Week 4**: Start BIS certification paperwork (takes 8-12 weeks)
- [ ] **Week 5**: If budget allows — fly to Shenzhen for 5 days (¥15K/₹1.8L all in)

> **Contact for 1688 / Taobao purchasing agent**: Search "Taobao buying agent India" on Google. Typical fee: 5-10% of order value + domestic shipping. Recommended: **SpyLoyal** (spyloyal.com) or **iShopping** (ishopping.in) — both handle India customs.

---

*Document version: 1.0 — June 2026*
