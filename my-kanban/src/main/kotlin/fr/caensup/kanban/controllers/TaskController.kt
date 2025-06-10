// src/main/kotlin/fr/caensup/kanban/controllers/TaskController.kt
package fr.caensup.kanban.controllers

import fr.caensup.kanban.entities.Task
import fr.caensup.kanban.services.TaskService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.time.LocalDateTime
import java.util.*

@RestController
@CrossOrigin(origins = ["http://localhost:3000", "http://127.0.0.1:3000"])
@RequestMapping("/tasks")
class TaskController(private val taskService: TaskService) {

    @GetMapping
    fun getAllTasks(): ResponseEntity<List<Task>> {
        println("🔍 GET /tasks appelé")
        return try {
            val tasks = taskService.findAll()
            println("✅ ${tasks.size} tâches trouvées")
            ResponseEntity.ok(tasks)
        } catch (e: Exception) {
            println("❌ Erreur GET tasks: ${e.message}")
            ResponseEntity.ok(emptyList())
        }
    }

    @PostMapping
    fun createTask(@RequestBody request: Map<String, Any>): ResponseEntity<*> {
        println("🔍 POST /tasks avec: $request")

        return try {
            val title = request["title"] as? String ?: "Nouvelle tâche"
            val description = request["description"] as? String
            val priority = request["priority"] as? String ?: "medium"
            val boardId = request["boardId"] as? String
            val dueDate = request["dueDate"] as? String

            println("📝 Création tâche: title='$title', priority='$priority', boardId='$boardId'")

            val task = Task(
                title = title,
                description = description,
                priority = priority,
                boardId = if (boardId != null) UUID.fromString(boardId) else null
            )

            if (dueDate != null) {
                task.dueDate = dueDate
            }

            // Gestion des utilisateurs assignés
            val assignedUsers = request["assignedUsers"] as? List<String>
            if (!assignedUsers.isNullOrEmpty()) {
                try {
                    val userIds = assignedUsers.map { UUID.fromString(it) }
                    taskService.assignUsersToTask(task, userIds)
                } catch (e: Exception) {
                    println("⚠️ Erreur assignation utilisateurs: ${e.message}")
                }
            }

            val savedTask = taskService.save(task)
            println("✅ Tâche créée: ${savedTask.id} avec titre='${savedTask.title}'")

            ResponseEntity.status(HttpStatus.CREATED).body(savedTask)

        } catch (e: Exception) {
            println("❌ ERREUR dans createTask: ${e.message}")
            e.printStackTrace()
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(mapOf("error" to e.message))
        }
    }

    @PutMapping("/{id}/move")
    fun moveTask(
        @PathVariable id: UUID,
        @RequestBody request: Map<String, Any>
    ): ResponseEntity<*> {
        println("🔍 PUT /tasks/$id/move avec: $request")

        return try {
            val toBoardId = request["toBoardId"] as? String

            if (toBoardId != null) {
                val task = taskService.findById(id)
                if (task != null) {
                    task.boardId = UUID.fromString(toBoardId)
                    task.updatedAt = LocalDateTime.now()
                    val movedTask = taskService.save(task)
                    println("✅ Tâche déplacée vers board: $toBoardId")
                    ResponseEntity.ok(movedTask)
                } else {
                    ResponseEntity.notFound().build()
                }
            } else {
                ResponseEntity.badRequest().body(mapOf("error" to "toBoardId manquant"))
            }
        } catch (e: Exception) {
            println("❌ Erreur déplacement: ${e.message}")
            ResponseEntity.badRequest().body(mapOf("error" to e.message))
        }
    }

    @DeleteMapping("/{id}")
    fun deleteTask(@PathVariable id: UUID): ResponseEntity<Void> {
        println("🔍 DELETE /tasks/$id")

        return try {
            if (taskService.existsById(id)) {
                taskService.deleteById(id)
                println("✅ Tâche supprimée: $id")
                ResponseEntity.noContent().build()
            } else {
                ResponseEntity.notFound().build()
            }
        } catch (e: Exception) {
            println("❌ Erreur suppression: ${e.message}")
            ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build()
        }
    }

    @GetMapping("/test")
    fun testTasks(): ResponseEntity<Map<String, String>> {
        return ResponseEntity.ok(mapOf("status" to "OK", "message" to "TaskController fonctionne"))
    }
}