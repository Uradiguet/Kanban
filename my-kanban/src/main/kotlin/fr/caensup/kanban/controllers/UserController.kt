package fr.caensup.kanban.controllers

import fr.caensup.kanban.dtos.UserDto
import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.UserRepository
import fr.caensup.kanban.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000", "http://127.0.0.1:3000"]) // CORRECTION: Ajouter port 3000
@RequestMapping("/users")
class UserController(
    private val userService: UserService,
    private val userRepository: UserRepository
) {
    @GetMapping
    fun findAll() = ResponseEntity.ok(userService.findAll()) // CORRECTION: Wrapper dans ResponseEntity

    @PostMapping
    fun save(@RequestBody user: UserDto): ResponseEntity<User> {
        val savedUser = userService.save(user)
        return ResponseEntity(savedUser, HttpStatus.CREATED)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID): ResponseEntity<Void> {
        return if (userRepository.existsById(id)) {
            userService.deleteById(id)
            ResponseEntity.noContent().build() // CORRECTION: 204 No Content au lieu de 200
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id: UUID, @RequestBody user: UserDto): ResponseEntity<User> {
        return if (userRepository.existsById(id)) {
            user.id = id
            ResponseEntity.ok(userService.save(user))
        } else {
            ResponseEntity.notFound().build()
        }
    }
}
