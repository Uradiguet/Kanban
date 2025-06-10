package fr.caensup.kanban.controllers

import fr.caensup.kanban.entities.Task
import fr.caensup.kanban.services.TaskService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.*

@RestController
@RequestMapping("/tasks")
class TaskController(private val taskService: TaskService) {

    @PutMapping("/{taskId}/assign")
    fun assignMembers(
        @PathVariable taskId: UUID,
        @RequestBody request: AssignTaskRequest
    ): ResponseEntity<Task> {
        return ResponseEntity.ok(taskService.assignMembers(taskId, request.members))
    }
}

data class AssignTaskRequest(val members: List<UUID>)
