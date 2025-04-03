
import { useState, useEffect } from 'react';

// Updated interfaces with consistent naming
export interface User extends DichVu.User {}

export interface Employee extends DichVu.NhanVien {
  // Additional fields for local implementation
  lichLamViec?: {
    [key: string]: {
      start: string;
      end: string;
    }
  };
  // Map dichvu_id to services for consistency
  services?: number[]; 
}

export interface Service extends DichVu.DichVu {}
export interface Appointment extends DichVu.LichHen {}
export interface Review extends DichVu.Review {}

export default () => {
  // State for all data
  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : [];
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const storedEmployees = localStorage.getItem('employees');
    // Transform any loaded employees to ensure services is set from dichvu_id
    const parsedEmployees = storedEmployees ? JSON.parse(storedEmployees) : [];
    return parsedEmployees.map((emp: Employee) => ({
      ...emp,
      // Set services from dichvu_id if services doesn't exist
      services: emp.services || emp.dichvu_id || []
    }));
  });

  const [services, setServices] = useState<Service[]>(() => {
    const storedServices = localStorage.getItem('services');
    return storedServices ? JSON.parse(storedServices) : [];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const storedAppointments = localStorage.getItem('appointments');
    return storedAppointments ? JSON.parse(storedAppointments) : [];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const storedReviews = localStorage.getItem('reviews');
    return storedReviews ? JSON.parse(storedReviews) : [];
  });

  // User management
  const addUser = (user: User) => {
    const updatedUsers = [...users, user];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return user;
  };

  const updateUser = (updatedUser: User) => {
    const updatedUsers = users.map(user => 
      user.user_id === updatedUser.user_id ? updatedUser : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    return updatedUser;
  };

  const deleteUser = (userId: number) => {
    const updatedUsers = users.filter(user => user.user_id !== userId);
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  // Employee management
  const addEmployee = (employee: Employee) => {
    // Ensure employee has both services and dichvu_id arrays
    const employeeWithServices = {
      ...employee,
      services: employee.services || employee.dichvu_id || [],
      dichvu_id: employee.dichvu_id || employee.services || []
    };
    
    const updatedEmployees = [...employees, employeeWithServices];
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    return employeeWithServices;
  };

  const updateEmployee = (updatedEmployee: Employee) => {
    // Ensure employee has both services and dichvu_id arrays
    const employeeWithServices = {
      ...updatedEmployee,
      services: updatedEmployee.services || updatedEmployee.dichvu_id || [],
      dichvu_id: updatedEmployee.dichvu_id || updatedEmployee.services || []
    };
    
    const updatedEmployees = employees.map(employee => 
      employee.employee_id === employeeWithServices.employee_id ? employeeWithServices : employee
    );
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    return employeeWithServices;
  };

  const deleteEmployee = (employeeId: number) => {
    const updatedEmployees = employees.filter(employee => employee.employee_id !== employeeId);
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  // Service management
  const addService = (service: Service) => {
    const updatedServices = [...services, service];
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    return service;
  };

  const updateService = (updatedService: Service) => {
    const updatedServices = services.map(service => 
      service.dichvu_id === updatedService.dichvu_id ? updatedService : service
    );
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    return updatedService;
  };

  const deleteService = (serviceId: number) => {
    const updatedServices = services.filter(service => service.dichvu_id !== serviceId);
    setServices(updatedServices);
    localStorage.setItem('services', JSON.stringify(updatedServices));
    
    // Also update any employees that offer this service - update both services and dichvu_id
    const updatedEmployees = employees.map(employee => {
      const hasService = (employee.services && employee.services.includes(serviceId)) || 
                         (employee.dichvu_id && employee.dichvu_id.includes(serviceId));
      
      if (hasService) {
        return {
          ...employee,
          services: (employee.services || []).filter(id => id !== serviceId),
          dichvu_id: (employee.dichvu_id || []).filter(id => id !== serviceId)
        };
      }
      return employee;
    });
    
    setEmployees(updatedEmployees);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  };

  // Appointment management
  const addAppointment = (appointment: Appointment) => {
    const updatedAppointments = [...appointments, appointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return appointment;
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map(appointment => 
      appointment.lichhen_id === updatedAppointment.lichhen_id ? updatedAppointment : appointment
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return updatedAppointment;
  };

  const deleteAppointment = (appointmentId: number) => {
    const updatedAppointments = appointments.filter(appointment => appointment.lichhen_id !== appointmentId);
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  // Review management
  const addReview = (review: Review) => {
    const updatedReviews = [...reviews, review];
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    
    // Update the appointment with the review ID
    const relatedAppointment = appointments.find(
      app => app.user_id === review.user_id && 
             app.employee_id === review.employee_id &&
             app.dichvu_id === review.dichvu_id
    );
    
    if (relatedAppointment) {
      const updatedAppointment = { ...relatedAppointment, review_id: review.review_id };
      updateAppointment(updatedAppointment);
    }
    
    return review;
  };

  const updateReview = (updatedReview: Review) => {
    const updatedReviews = reviews.map(review => 
      review.review_id === updatedReview.review_id ? updatedReview : review
    );
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    return updatedReview;
  };

  const deleteReview = (reviewId: number) => {
    const updatedReviews = reviews.filter(review => review.review_id !== reviewId);
    setReviews(updatedReviews);
    localStorage.setItem('reviews', JSON.stringify(updatedReviews));
    
    // Update any appointments that referenced this review
    const relatedAppointments = appointments.filter(app => app.review_id === reviewId);
    relatedAppointments.forEach(appointment => {
      const updatedAppointment = { ...appointment, review_id: undefined };
      updateAppointment(updatedAppointment);
    });
  };

  // Find employees who can provide a specific service
  const getEmployeesByService = (serviceId: number) => {
    return employees.filter(employee => 
      // Check both services and dichvu_id arrays
      (employee.services && employee.services.includes(serviceId)) ||
      (employee.dichvu_id && employee.dichvu_id.includes(serviceId))
    );
  };

  // Statistics and Reports
  const getAppointmentStatsByDay = (start: Date, end: Date) => {
    const stats: { [key: string]: number } = {};
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Initialize all days with 0 appointments
    for (let day = new Date(startDate); day <= endDate; day.setDate(day.getDate() + 1)) {
      const dateStr = day.toISOString().split('T')[0]; // YYYY-MM-DD
      stats[dateStr] = 0;
    }
    
    // Count appointments for each day
    appointments.forEach(appointment => {
      const appDate = new Date(appointment.date);
      if (appDate >= startDate && appDate <= endDate) {
        const dateStr = appointment.date;
        stats[dateStr] = (stats[dateStr] || 0) + 1;
      }
    });
    
    return stats;
  };

  const getRevenueByService = () => {
    const revenue: { [key: string]: number } = {};
    
    // Initialize all services with 0 revenue
    services.forEach(service => {
      revenue[service.name] = 0;
    });
    
    // Calculate revenue for completed appointments
    appointments
      .filter(app => app.status === 'completed')
      .forEach(app => {
        const service = services.find(s => s.dichvu_id === app.dichvu_id);
        if (service) {
          revenue[service.name] = (revenue[service.name] || 0) + service.price;
        }
      });
    
    return revenue;
  };

  const getRevenueByEmployee = () => {
    const revenue: { [key: string]: number } = {};
    
    // Initialize all employees with 0 revenue
    employees.forEach(employee => {
      revenue[employee.name] = 0;
    });
    
    // Calculate revenue for completed appointments
    appointments
      .filter(app => app.status === 'completed')
      .forEach(app => {
        const service = services.find(s => s.dichvu_id === app.dichvu_id);
        const employee = employees.find(e => e.employee_id === app.employee_id);
        if (service && employee) {
          revenue[employee.name] = (revenue[employee.name] || 0) + service.price;
        }
      });
    
    return revenue;
  };

  const getEmployeeRatings = () => {
    const employeeRatings: { [key: number]: { total: number, count: number, average: number } } = {};
    
    // Initialize all employees with 0 ratings
    employees.forEach(employee => {
      employeeRatings[employee.employee_id] = { total: 0, count: 0, average: 0 };
    });
    
    // Calculate average ratings
    reviews.forEach(review => {
      const { employee_id, rating } = review;
      const employeeRating = employeeRatings[employee_id];
      
      if (employeeRating) {
        employeeRating.total += rating;
        employeeRating.count += 1;
        employeeRating.average = employeeRating.total / employeeRating.count;
      }
    });
    
    return employeeRatings;
  };

  // Check for appointment conflicts
  const checkAppointmentConflict = (
    employeeId: number, 
    date: string, 
    time: string, 
    duration: number, 
    excludeAppointmentId?: number
  ) => {
    const appointmentTime = new Date(`${date}T${time}`);
    const appointmentEndTime = new Date(appointmentTime.getTime() + duration * 60000);
    
    return appointments.some(appointment => {
      // Skip the current appointment being edited
      if (excludeAppointmentId && appointment.lichhen_id === excludeAppointmentId) {
        return false;
      }
      
      // Check if it's for the same employee and date
      if (appointment.employee_id === employeeId && appointment.date === date) {
        const existingAppointmentTime = new Date(`${appointment.date}T${appointment.time}`);
        
        // Find the service for this appointment to get duration
        const service = services.find(s => s.dichvu_id === appointment.dichvu_id);
        const existingDuration = service?.thoiGianThucHien || 60; // Default to 60 minutes
        
        const existingAppointmentEndTime = new Date(existingAppointmentTime.getTime() + existingDuration * 60000);
        
        // Check for overlap
        return (
          (appointmentTime < existingAppointmentEndTime && appointmentEndTime > existingAppointmentTime)
        );
      }
      
      return false;
    });
  };

  // Check if an employee can provide a service
  const canEmployeeProvideService = (employeeId: number, serviceId: number) => {
    const employee = employees.find(e => e.employee_id === employeeId);
    
    // Check both services and dichvu_id arrays
    return employee && (
      (employee.services && employee.services.includes(serviceId)) || 
      (employee.dichvu_id && employee.dichvu_id.includes(serviceId))
    );
  };
  

  return {
    // Data
    users,
    employees,
    services,
    appointments,
    reviews,
    
    // User operations
    addUser,
    updateUser,
    deleteUser,
    
    // Employee operations
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeesByService,
    canEmployeeProvideService,
    
    // Service operations
    addService,
    updateService,
    deleteService,
    
    // Appointment operations
    addAppointment,
    updateAppointment,
    deleteAppointment,
    
    // Review operations
    addReview,
    updateReview,
    deleteReview,
    
    // Statistics and reporting
    getAppointmentStatsByDay,
    getRevenueByService,
    getRevenueByEmployee,
    getEmployeeRatings,
    
    // Utility functions
    checkAppointmentConflict
  };
};