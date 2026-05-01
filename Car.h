#ifndef CAR_H
#define CAR_H

#include <iostream>
#include <string>

class Car {
protected:
    std::string carName;
    bool isAvailable;
    std::string rentStart;
    std::string rentEnd;

public:
    Car(const std::string& name)
        : carName(name), isAvailable(true), rentStart("N/A"), rentEnd("N/A") {}

    virtual ~Car() {}

    std::string getName() const { return carName; }
    bool getAvailability() const { return isAvailable; }
    std::string getRentStart() const { return rentStart; }
    std::string getRentEnd() const { return rentEnd; }

    virtual std::string getType() const = 0;

    void rentCar(const std::string& startDate, const std::string& endDate) {
        isAvailable = false;
        rentStart = startDate;
        rentEnd = endDate;
    }

    void returnCar() {
        isAvailable = true;
        rentStart = "N/A";
        rentEnd = "N/A";
    }

    virtual void displayInfo() const {
        std::cout << "Name: " << carName
                  << " | Type: " << getType()
                  << " | Status: " << (isAvailable ? "Available" : "Rented")
                  << " | Rent Start: " << rentStart
                  << " | Rent End: " << rentEnd << std::endl;
    }
};

class Sedan : public Car {
public:
    Sedan(const std::string& name) : Car(name) {}
    std::string getType() const override { return "Sedan"; }
};

class SUV : public Car {
public:
    SUV(const std::string& name) : Car(name) {}
    std::string getType() const override { return "SUV"; }
};

class Truck : public Car {
public:
    Truck(const std::string& name) : Car(name) {}
    std::string getType() const override { return "Truck"; }
};

class Van : public Car {
public:
    Van(const std::string& name) : Car(name) {}
    std::string getType() const override { return "Van"; }
};

class Motorcycle : public Car {
public:
    Motorcycle(const std::string& name) : Car(name) {}
    std::string getType() const override { return "Motorcycle"; }
};

#endif
