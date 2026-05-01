#include <algorithm>
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include "Car.h"

using namespace std;

void showMenu();
void registerCar(vector<unique_ptr<Car>>& cars);
void deregisterCar(vector<unique_ptr<Car>>& cars);
void rentCar(vector<unique_ptr<Car>>& cars);
void returnCar(vector<unique_ptr<Car>>& cars);
void listCars(const vector<unique_ptr<Car>>& cars);
void sortCars(vector<unique_ptr<Car>>& cars);
int findCarIndexByName(const vector<unique_ptr<Car>>& cars, const string& name);

int main() {
    vector<unique_ptr<Car>> cars;

    // Starter inventory for testing/demo.
    cars.push_back(make_unique<Sedan>("Toyota Camry"));
    cars.push_back(make_unique<SUV>("Honda CR-V"));
    cars.push_back(make_unique<Truck>("Ford F-150"));

    int choice = 0;

    do {
        showMenu();
        cout << "Enter choice: ";
        cin >> choice;
        cin.ignore();

        switch (choice) {
            case 1:
                rentCar(cars);
                break;
            case 2:
                returnCar(cars);
                break;
            case 3:
                registerCar(cars);
                break;
            case 4:
                deregisterCar(cars);
                break;
            case 5:
                sortCars(cars);
                break;
            case 6:
                listCars(cars);
                break;
            case 7:
                cout << "Exiting program. Goodbye!" << endl;
                break;
            default:
                cout << "Invalid choice. Please try again." << endl;
        }
    } while (choice != 7);

    return 0;
}

void showMenu() {
    cout << "\nCar Rental System Menu" << endl;
    cout << "1. Rent a Car" << endl;
    cout << "2. Return a Car" << endl;
    cout << "3. Register a New Car" << endl;
    cout << "4. Deregister a Car" << endl;
    cout << "5. Sort Cars" << endl;
    cout << "6. List Cars" << endl;
    cout << "7. Quit" << endl;
}

void registerCar(vector<unique_ptr<Car>>& cars) {
    int typeChoice;
    string name;

    cout << "\nSelect car type:" << endl;
    cout << "1. Sedan" << endl;
    cout << "2. SUV" << endl;
    cout << "3. Truck" << endl;
    cout << "4. Van" << endl;
    cout << "5. Motorcycle" << endl;
    cout << "Enter type choice: ";
    cin >> typeChoice;
    cin.ignore();

    cout << "Enter car name: ";
    getline(cin, name);

    if (findCarIndexByName(cars, name) != -1) {
        cout << "A car with that name already exists." << endl;
        return;
    }

    switch (typeChoice) {
        case 1:
            cars.push_back(make_unique<Sedan>(name));
            break;
        case 2:
            cars.push_back(make_unique<SUV>(name));
            break;
        case 3:
            cars.push_back(make_unique<Truck>(name));
            break;
        case 4:
            cars.push_back(make_unique<Van>(name));
            break;
        case 5:
            cars.push_back(make_unique<Motorcycle>(name));
            break;
        default:
            cout << "Invalid type. Car was not registered." << endl;
            return;
    }

    cout << "Car registered successfully." << endl;
}

void deregisterCar(vector<unique_ptr<Car>>& cars) {
    string name;
    cout << "Enter car name to deregister: ";
    getline(cin, name);

    int index = findCarIndexByName(cars, name);

    if (index == -1) {
        cout << "Car not found." << endl;
        return;
    }

    if (!cars[index]->getAvailability()) {
        cout << "Cannot deregister a car while it is rented." << endl;
        return;
    }

    cars.erase(cars.begin() + index);
    cout << "Car deregistered successfully." << endl;
}

void rentCar(vector<unique_ptr<Car>>& cars) {
    string name, startDate, endDate;
    cout << "Enter car name to rent: ";
    getline(cin, name);

    int index = findCarIndexByName(cars, name);

    if (index == -1) {
        cout << "Car not found." << endl;
        return;
    }

    if (!cars[index]->getAvailability()) {
        cout << "This car is already rented." << endl;
        return;
    }

    cout << "Enter rent start date (YYYY-MM-DD): ";
    getline(cin, startDate);

    cout << "Enter rent return date (YYYY-MM-DD): ";
    getline(cin, endDate);

    cars[index]->rentCar(startDate, endDate);
    cout << "Car rented successfully." << endl;
}

void returnCar(vector<unique_ptr<Car>>& cars) {
    string name;
    cout << "Enter car name to return: ";
    getline(cin, name);

    int index = findCarIndexByName(cars, name);

    if (index == -1) {
        cout << "Car not found." << endl;
        return;
    }

    if (cars[index]->getAvailability()) {
        cout << "This car is already available." << endl;
        return;
    }

    cars[index]->returnCar();
    cout << "Car returned successfully." << endl;
}

void listCars(const vector<unique_ptr<Car>>& cars) {
    cout << "\nCurrent Car Inventory" << endl;
    cout << "---------------------" << endl;

    if (cars.empty()) {
        cout << "No cars are currently registered." << endl;
        return;
    }

    for (const auto& car : cars) {
        car->displayInfo();
    }
}

void sortCars(vector<unique_ptr<Car>>& cars) {
    int choice;

    cout << "\nSort by:" << endl;
    cout << "1. Name" << endl;
    cout << "2. Type" << endl;
    cout << "3. Rent Start Date" << endl;
    cout << "4. Rent Return Date" << endl;
    cout << "Enter sort choice: ";
    cin >> choice;
    cin.ignore();

    switch (choice) {
        case 1:
            sort(cars.begin(), cars.end(), [](const unique_ptr<Car>& a, const unique_ptr<Car>& b) {
                return a->getName() < b->getName();
            });
            break;
        case 2:
            sort(cars.begin(), cars.end(), [](const unique_ptr<Car>& a, const unique_ptr<Car>& b) {
                return a->getType() < b->getType();
            });
            break;
        case 3:
            sort(cars.begin(), cars.end(), [](const unique_ptr<Car>& a, const unique_ptr<Car>& b) {
                return a->getRentStart() < b->getRentStart();
            });
            break;
        case 4:
            sort(cars.begin(), cars.end(), [](const unique_ptr<Car>& a, const unique_ptr<Car>& b) {
                return a->getRentEnd() < b->getRentEnd();
            });
            break;
        default:
            cout << "Invalid sort choice." << endl;
            return;
    }

    cout << "Cars sorted successfully." << endl;
    listCars(cars);
}

int findCarIndexByName(const vector<unique_ptr<Car>>& cars, const string& name) {
    for (int i = 0; i < static_cast<int>(cars.size()); i++) {
        if (cars[i]->getName() == name) {
            return i;
        }
    }
    return -1;
}
