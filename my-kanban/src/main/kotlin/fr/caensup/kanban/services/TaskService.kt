// src/main/kotlin/fr/caensup/kanban/services/TaskService.kt
package fr.caensup.kanban.services

import fr.caensup.kanban.entities.Task
import fr.caensup.kanban.repositories.TaskRepository
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val userRepository: UserRepository
) {

    fun findAll(): List<Task> {
        return try {
            taskRepository.findAll()
        } catch (e: Exception) {
            println("❌ Erreur findAll tasks: ${e.message}")
            emptyList()
        }
    }

    fun findById(id: UUID): Task? {
        return try {
            taskRepository.findById(id).orElse(null)
        } catch (e: Exception) {
            println("❌ Erreur findById task: ${e.message}")
            null
        }
    }

    fun existsById(id: UUID): Boolean {
        return try {
            taskRepository.existsById(id)
        } catch (e: Exception) {
            println("❌ Erreur existsById task: ${e.message}")
            false
        }
    }

    fun save(task: Task): Task {
        return try {
            task.updatedAt = LocalDateTime.now()
            val saved = taskRepository.save(task)
            println("✅ Task sauvée: ${saved.id}")
            saved
        } catch (e: Exception) {
            println("❌ Erreur save task: ${e.message}")
            e.printStackTrace()
            throw e
        }
    }

    fun deleteById(id: UUID) {
        try {
            taskRepository.deleteById(id)
            println("✅ Task supprimée: $id")
        } catch (e: Exception) {
            println("❌ Erreur delete task: ${e.message}")
            throw e
        }
    }

    fun assignUsersToTask(task: Task, userIds: List<UUID>) {
        try {
            val users = userRepository.findAllById(userIds)
            task.assignedUsers.clear()
            task.assignedUsers.addAll(users)
            println("✅ ${users.size} utilisateurs assignés à la tâche ${task.id}")
        } catch (e: Exception) {
            println("❌ Erreur assignation utilisateurs: ${e.message}")
            // Ne pas planter, juste logger l'erreur
        }
    }

    fun getTasksByBoardId(boardId: UUID): List<Task> {
        return try {
            findAll().filter { it.boardId == boardId }
        } catch (e: Exception) {
            println("❌ Erreur getTasksByBoardId: ${e.message}")
            emptyList()
        }
    }
}