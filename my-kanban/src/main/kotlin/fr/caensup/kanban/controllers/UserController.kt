package fr.caensup.kanban.controllers

import fr.caensup.kanban.dtos.UserDto
import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.UserRepository
import fr.caensup.kanban.services.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@CrossOrigin(origins = ["http://127.0.0.1:3000"])
@RequestMapping("/users")
class UserController(
    private val userService: UserService,
    private val userRepository: UserRepository
){
    @GetMapping(path = ["/",""])
    fun findAll() = userService.findAll()

    @PostMapping(path = ["/",""])
    fun save(@RequestBody user:UserDto):ResponseEntity<User>{
        val savedUser=userService.save(user)
        return ResponseEntity(savedUser, HttpStatus.CREATED)
    }

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: UUID):ResponseEntity<Void> {
        if(userRepository.existsById(id)) {
            userService.deleteById(id)
            return ResponseEntity(HttpStatus.OK)
        }
        return ResponseEntity.notFound().build()
    }

    @PutMapping("/{id}")
    fun update(@PathVariable id:UUID,@RequestBody user:UserDto):ResponseEntity<User>{
      if(userRepository.existsById(id)){
          return ResponseEntity.ok(userService.save(user))
      }
        return ResponseEntity.notFound().build()

    }

}