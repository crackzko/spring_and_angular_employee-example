package edu.employee.employeadminbackend.employee;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.List;

@CrossOrigin
@RestController()
@RequestMapping(EmployeeRestController.PATH)
public class EmployeeRestController {

    public static final String PATH = "/api/employee";
    private static final String ID = "id";
    private static final String LIMIT = "limit";
    private static final String PAGE = "page";
    private static final String PATH_PARAMETER_NAME_ID = "/{id}";


    private final EmployeeRepository employeeRepository;

    public EmployeeRestController(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    @PostMapping()
    public ResponseEntity<URI> create(@RequestBody Employee employee, HttpServletRequest request) {

        try {
            var supervisor = employee.getSupervisor();
            if (supervisor != null) {
                if (supervisor.getId() != null) {
                    var found = employeeRepository.findById(supervisor.getId());
                    if (found.isPresent()) {
                        employee.setSupervisor(found.get());
                    } else {
                        return ResponseEntity.badRequest().build();
                    }
                } else {
                    return ResponseEntity.badRequest().build();
                }
            }

            var created = employeeRepository.save(employee);
            var entityUriString = String.format("%s/%d", request.getRequestURI(), created.getId());

            return ResponseEntity.created(new URI(entityUriString)).build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

    }

    @GetMapping("/count")
    public Long count() {
        return employeeRepository.count();
    }


    @GetMapping()
    public List<Employee> read(@RequestParam(name = PAGE, defaultValue = "0", required = false) int page,
                               @RequestParam(name = LIMIT, defaultValue = "0", required = false) int limit) {

        if (limit != 0) {
            var pageable = PageRequest.of(page, limit);
            return employeeRepository.findAll(pageable).getContent();
        }

        return employeeRepository.findAll();

    }

    @DeleteMapping(PATH_PARAMETER_NAME_ID)
    public ResponseEntity delete(@PathVariable(ID) Long id) {
        if (id == null) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return employeeRepository.findById(id)
                .map(employee -> {
                    try {
                        var supervised = employeeRepository.findBySupervisorId(id);
                        supervised.forEach(supervisedEmployee -> {
                            supervisedEmployee.setSupervisor(null);
                            employeeRepository.save(supervisedEmployee);
                        });

                        employeeRepository.delete(employee);
                        return ResponseEntity.ok().build();
                    } catch (Exception e) {
                        return serverError();
                    }
                }).orElse(notFound());

    }

    private ResponseEntity serverError() {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
    }

    private ResponseEntity notFound() {
        return ResponseEntity.notFound().build();
    }

}
