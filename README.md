# Car Rental Management System

## Main Goal

The goal of this project was to create a C++ car rental inventory system using object-oriented programming concepts like inheritance and polymorphism. The program allows users to register, deregister, rent, return, list, and sort vehicles using a text-based menu system.

## 1. Inheritance

The project uses a base class called `Car` to store information shared by all vehicles, including:

* `carName`
* `isAvailable`
* `rentStart`
* `rentEnd`

The derived classes are:

* `Sedan`
* `SUV`
* `Truck`
* `Van`
* `Motorcycle`

Each derived class inherits the shared data and functions from `Car` and overrides the `getType()` function to return its own vehicle type.

## 2. Polymorphism

All vehicles are stored inside one vector:

```cpp
vector<unique_ptr<Car>> cars;
```

This allows the program to manage different vehicle types together using base-class pointers. Even though the vector stores `Car` pointers, the actual objects can still be sedans, SUVs, trucks, vans, or motorcycles.

## 3. Renting a Car

When renting a car, the program first checks if the vehicle exists and whether it is currently available. If it is available, the user enters a rent start date and return date, and the vehicle is marked as unavailable.

## 4. Returning a Car

When returning a car, the program checks that the vehicle exists and is currently rented. The car is then marked as available again and the rental dates are reset to `N/A`.

## 5. Registering a Car

The user selects a vehicle type and enters the vehicle name. The program then creates the correct derived object using `make_unique()` and adds it to the inventory vector.

## 6. Deregistering a Car

The user enters the car name, and the program removes it from the inventory if the vehicle exists and is not currently rented. This prevents cars from being removed while checked out.

## 7. Listing Cars

The list function displays every car in the inventory along with:

* vehicle name
* vehicle type
* availability
* rent start date
* rent return date

## 8. Sorting Cars

The sorting feature allows the user to sort vehicles by:

* name
* type
* rent start date
* rent return date

The program uses the C++ `sort()` function with comparison functions for sorting.

## Design

This project follows an object-oriented design because each vehicle is treated as its own object. Shared data is placed in the `Car` base class, while specific vehicle types are handled through derived classes. Using polymorphism made it easier to manage all vehicle types in a single inventory system.

## Summary

In this project, I created a car rental management system using inheritance and polymorphism in C++. A base class called `Car` stores the shared information for all vehicles, while derived classes such as `Sedan`, `SUV`, `Truck`, `Van`, and `Motorcycle` represent specific vehicle types. The program allows users to register, deregister, rent, return, list, and sort cars through a text-based menu system.

## Testing Plan

To test the program, I would:

1. Display the starter inventory.
2. Register a new vehicle.
3. Rent the vehicle using rental dates.
4. Verify the vehicle becomes unavailable.
5. Attempt to rent the same vehicle again to verify the error message.
6. Return the vehicle.
7. Verify it becomes available again.
8. Test sorting by name, type, rent start date, and return date.
9. Deregister an available vehicle.
