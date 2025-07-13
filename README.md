# GpuTycoon
Game about building a data center business



# Data Center Simulator

**Data Center Simulator** is an idle-style React Native game that lets players build and manage virtual data center buildings. Each building—ranging from small (10 racks) to mega-scale (10,000 racks)—can be outfitted with GPUs and a multi‑tier cooling system to generate income over time.

## 🚀 Project Goals

* **Simulate** the economics of running a data center: purchase buildings, install GPUs, manage heat.
* **Gamify** infrastructure management with idle mechanics and upgrade paths.
* **Visualize** performance with sleek, dark-themed UI tailored for modern iPhone notches and safe areas.
* **Scale** from a modest shell to a global empire, with buildings of increasing capacity and cost.

## 🎮 Key Features

* **Building Tiers**: Four sizes (Small, Medium, Large, Mega) with exponential purchase costs.
* **GPU Management**: Buy and sell GPUs for each building; GPUs generate income per second.
* **3‑Tier Cooling**: Evaporative, Liquid, and Nitro tiers cap heat and throttle GPU performance.
* **Idle Income Loop**: Automatic per‑second income calculation across all buildings.
* **Detailed View**: Tap a building to open a full-screen detail card for upgrades and stats.
* **SafeArea & Notch Support**: UI built inside `SafeAreaView` for iPhone X+ compatibility.

## 📦 Getting Started

1. **Clone the repo** and install dependencies:

   ```bash
   git clone <repo-url>
   cd data-center-simulator
   yarn install
   ```
2. **Run on iOS/Android simulator**:

   ```bash
   yarn ios
   yarn android
   ```
3. **Interact**: Start with enough funds to buy a Small building and two GPUs—then watch your data center grow!

## 🛣️ Roadmap

1. Finalize core idle loop and building logic.
2. Polish UI with animations & audio feedback.
3. Integrate analytics for retention & monetization.
4. Implement global map expansion and prestige mechanics.
5. Launch to App Store with live‑ops events and in‑app purchases.

## 🤝 Contributing

Feel free to open issues or PRs for new features, bug fixes, or UI improvements. Let’s build the ultimate data center idle sim!
