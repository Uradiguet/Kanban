package fr.caensup.kanban.controllers

import fr.caensup.kanban.dtos.AssignTaskRequest
import fr.caensup.kanban.dtos.MoveTaskRequest
import fr.caensup.kanban.dtos.TaskDto
import fr.caensup.kanban.entities.Task
import fr.caensup.kanban.services.TaskService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000", "http://127.0.0.1:3000"])
@RequestMapping("/tasks")
class TaskController(private val taskService: TaskService) {

    @GetMapping
    fun getAllTasks() = ResponseEntity.ok(taskService.findAll())

    @GetMapping("/{id}")
    fun getTaskById(@PathVariable id: UUID) = 
        taskService.findById(id)?.let { ResponseEntity.ok(it) } 
            ?: ResponseEntity.notFound().build()

    @PostMapping
    fun createTask(@RequestBody taskDto: TaskDto) = 
        ResponseEntity(taskService.save(taskDto), HttpStatus.CREATED)

    @PutMapping("/{id}")
    fun updateTask(@PathVariable id: UUID, @RequestBody taskDto: TaskDto): ResponseEntity<Task> {
        return if (taskService.existsById(id)) {
            taskDto.id = id
            ResponseEntity.ok(taskService.save(taskDto))
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: UUID): ResponseEntity<Void> {
        return if (taskService.existsById(id)) {
            taskService.deleteById(id)
            ResponseEntity.noContent().build()
        } else {
            ResponseEntity.notFound().build()
        }
    }

    @PutMapping("/{id}/assign")
    fun assignUsersToTask(
        @PathVariable id: UUID,
        @RequestBody request: AssignTaskRequest
    ): ResponseEntity<Task> {
        return try {
            ResponseEntity.ok(taskService.assignUsers(id, request.users))
        } catch (e: Exception) {
            ResponseEntity.notFound().build()
        }
    }

    @PutMapping("/{id}/move")
    fun moveTask(
        @PathVariable id: UUID,
        @RequestBody request: MoveTaskRequest
    ): ResponseEntity<Any> {
        return try {
            ResponseEntity.ok(taskService.moveTask(id, request.toBoardId))
        } catch (e: Exception) {
            ResponseEntity.badRequest().body("Erreur lors du déplacement: ${e.message}")
        }
    }
}
