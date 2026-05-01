import { useState, useEffect } from "react";

type CarType = "Sedan" | "SUV" | "Truck" | "Van" | "Motorcycle";
type SortOption = "name" | "type" | "start" | "end";

interface Car {
  id: number;
  name: string;
  type: CarType;
  available: boolean;
  rentStart: string;
  rentEnd: string;
}

const initialCars: Car[] = [
  { id: 1, name: "Toyota Camry", type: "Sedan", available: true, rentStart: "N/A", rentEnd: "N/A" },
  { id: 2, name: "Honda CR-V", type: "SUV", available: true, rentStart: "N/A", rentEnd: "N/A" },
  { id: 3, name: "Ford F-150", type: "Truck", available: true, rentStart: "N/A", rentEnd: "N/A" },
];

export default function CarRentalManagementSystem() {
  const [cars, setCars] = useState<Car[]>(initialCars);
  const [carName, setCarName] = useState("");
  const [carType, setCarType] = useState<CarType>("Sedan");
  const [rentStart, setRentStart] = useState("");
  const [rentEnd, setRentEnd] = useState("");
  const [selectedCar, setSelectedCar] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  function showMessage(text: string, type: "success" | "error") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }

  function registerCar() {
    if (!carName.trim()) {
      showMessage("Please enter a car name.", "error");
      return;
    }
    const exists = cars.some((car) => car.name.toLowerCase() === carName.toLowerCase());
    if (exists) {
      showMessage("A car with that name already exists.", "error");
      return;
    }
    const newCar: Car = {
      id: Date.now(),
      name: carName,
      type: carType,
      available: true,
      rentStart: "N/A",
      rentEnd: "N/A",
    };
    setCars((prev) => [...prev, newCar]);
    setCarName("");
    showMessage(`${newCar.name} registered successfully.`, "success");
  }

  function rentCar() {
    if (!selectedCar || !rentStart || !rentEnd) {
      showMessage("Please complete all rental fields.", "error");
      return;
    }
    if (rentEnd < rentStart) {
      showMessage("Return date must be after the start date.", "error");
      return;
    }
    let alreadyRented = false;
    setCars((prev) =>
      prev.map((car) => {
        if (car.id === Number(selectedCar)) {
          if (!car.available) {
            alreadyRented = true;
            return car;
          }
          return { ...car, available: false, rentStart, rentEnd };
        }
        return car;
      })
    );
    if (alreadyRented) {
      showMessage("This car is already rented.", "error");
      return;
    }
    setRentStart("");
    setRentEnd("");
    setSelectedCar("");
    showMessage("Car rented successfully.", "success");
  }

  function returnCar(id: number) {
    setCars((prev) =>
      prev.map((car) =>
        car.id === id ? { ...car, available: true, rentStart: "N/A", rentEnd: "N/A" } : car
      )
    );
    showMessage("Car returned successfully.", "success");
  }

  function deregisterCar(id: number) {
    const target = cars.find((car) => car.id === id);
    if (!target) return;
    if (!target.available) {
      showMessage("Cannot deregister a currently rented car.", "error");
      return;
    }
    setCars((prev) => prev.filter((car) => car.id !== id));
    showMessage(`${target.name} deregistered.`, "success");
  }

  function getSortedCars(option: SortOption, list: Car[]): Car[] {
    const sorted = [...list];
    if (option === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    if (option === "type") sorted.sort((a, b) => a.type.localeCompare(b.type));
    if (option === "start") sorted.sort((a, b) => a.rentStart.localeCompare(b.rentStart));
    if (option === "end") sorted.sort((a, b) => a.rentEnd.localeCompare(b.rentEnd));
    return sorted;
  }

  useEffect(() => {
    setCars((prev) => getSortedCars(sortOption, prev));
  }, [sortOption]);

  const displayCars = getSortedCars(sortOption, cars);

  const vehicleTypes: CarType[] = ["Sedan", "SUV", "Truck", "Van", "Motorcycle"];

  const typeIcon: Record<CarType, string> = {
    Sedan: "🚗",
    SUV: "🚙",
    Truck: "🚚",
    Van: "🚐",
    Motorcycle: "🏍️",
  };

  const stats = {
    total: cars.length,
    available: cars.filter((c) => c.available).length,
    rented: cars.filter((c) => !c.available).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚘</span>
            <div>
              <h1 className="text-xl font-bold tracking-tight">CarFleet Pro</h1>
              <p className="text-xs text-blue-300">Rental Management System</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{stats.total}</div>
              <div className="text-xs text-slate-400">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">{stats.available}</div>
              <div className="text-xs text-slate-400">Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-400">{stats.rented}</div>
              <div className="text-xs text-slate-400">Rented</div>
            </div>
          </div>
        </div>
      </header>

      {/* Notification */}
      {message && (
        <div
          className={`fixed top-20 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            message.type === "success"
              ? "bg-emerald-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {message.type === "success" ? "✓ " : "✕ "}
          {message.text}
        </div>
      )}

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Register */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-xl">➕</div>
              <h2 className="text-lg font-semibold">Register New Car</h2>
            </div>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Car name (e.g. Toyota Camry)"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && registerCar()}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={carType}
                onChange={(e) => setCarType(e.target.value as CarType)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                {vehicleTypes.map((t) => (
                  <option key={t} value={t} className="bg-slate-800">
                    {typeIcon[t]} {t}
                  </option>
                ))}
              </select>
              <button
                onClick={registerCar}
                className="w-full bg-blue-600 hover:bg-blue-500 transition-colors rounded-xl py-3 text-sm font-semibold"
              >
                Register Car
              </button>
            </div>
          </div>

          {/* Rent */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl">🔑</div>
              <h2 className="text-lg font-semibold">Rent a Car</h2>
            </div>
            <div className="space-y-3">
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 appearance-none cursor-pointer"
              >
                <option value="" className="bg-slate-800">— Select a car —</option>
                {cars.map((car) => (
                  <option
                    key={car.id}
                    value={car.id}
                    disabled={!car.available}
                    className="bg-slate-800"
                  >
                    {typeIcon[car.type]} {car.name} ({car.type}){!car.available ? " — Rented" : ""}
                  </option>
                ))}
              </select>
              <div>
                <label className="block text-xs text-slate-400 mb-1 pl-1">Rent Start Date</label>
                <input
                  type="date"
                  value={rentStart}
                  onChange={(e) => setRentStart(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1 pl-1">Return Date</label>
                <input
                  type="date"
                  value={rentEnd}
                  onChange={(e) => setRentEnd(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 [color-scheme:dark]"
                />
              </div>
              <button
                onClick={rentCar}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold transition-colors rounded-xl py-3 text-sm"
              >
                Rent Car
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">📋</div>
              <h2 className="text-lg font-semibold">Car Inventory</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort by</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="name" className="bg-slate-800">Name</option>
                <option value="type" className="bg-slate-800">Type</option>
                <option value="start" className="bg-slate-800">Rent Start Date</option>
                <option value="end" className="bg-slate-800">Return Date</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-white/5 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-3 text-left">Car Name</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Availability</th>
                  <th className="px-6 py-3 text-left">Rent Start</th>
                  <th className="px-6 py-3 text-left">Return Date</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {displayCars.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No cars registered. Add one above to get started.
                    </td>
                  </tr>
                ) : (
                  displayCars.map((car) => (
                    <tr key={car.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-medium">{car.name}</td>
                      <td className="px-6 py-4 text-slate-300">
                        {typeIcon[car.type]} {car.type}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            car.available
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${car.available ? "bg-emerald-400" : "bg-amber-400"}`} />
                          {car.available ? "Available" : "Rented"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-300">{car.rentStart}</td>
                      <td className="px-6 py-4 text-slate-300">{car.rentEnd}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {!car.available && (
                            <button
                              onClick={() => returnCar(car.id)}
                              className="bg-emerald-600 hover:bg-emerald-500 transition-colors text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                            >
                              Return
                            </button>
                          )}
                          <button
                            onClick={() => deregisterCar(car.id)}
                            className="bg-red-600/80 hover:bg-red-600 transition-colors text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                          >
                            Deregister
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* OOP Features Section */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-xl">🎓</div>
            <div>
              <h2 className="text-lg font-semibold">OOP Concepts Demonstrated</h2>
              <p className="text-xs text-slate-400">University C++ Project Features</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: "🧬",
                title: "Inheritance",
                desc: "Vehicle base class inherited by Sedan, SUV, Truck, Van, and Motorcycle subclasses, each sharing core properties.",
              },
              {
                icon: "🔀",
                title: "Polymorphism",
                desc: "A unified rentCar() method operates on any vehicle type through shared interface, regardless of subclass.",
              },
              {
                icon: "📦",
                title: "Inventory Management",
                desc: "Dynamic fleet tracking with register, deregister, availability status, and duplicate prevention.",
              },
              {
                icon: "🔢",
                title: "Sorting Algorithms",
                desc: "Multi-criteria sorting by name, type, rent start date, and return date using comparators.",
              },
            ].map((feat) => (
              <div
                key={feat.title}
                className="bg-white/5 border border-white/10 rounded-xl p-4"
              >
                <div className="text-2xl mb-2">{feat.icon}</div>
                <h3 className="font-semibold text-sm mb-1">{feat.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 mt-8 py-6 text-center text-xs text-slate-500">
        CarFleet Pro · Car Rental Management System · University C++ OOP Project Demo
      </footer>
    </div>
  );
}
