package fr.caensup.kanban.services

import fr.caensup.kanban.dtos.TaskDto
import fr.caensup.kanban.entities.Priority
import fr.caensup.kanban.entities.Task
import fr.caensup.kanban.repositories.BoardRepository
import fr.caensup.kanban.repositories.TaskRepository
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.*

@Service
class TaskService(
    private val taskRepository: TaskRepository,
    private val userRepository: UserRepository,
    private val boardRepository: BoardRepository
) {

    fun findAll(): List<TaskDto> = taskRepository.findAll().map { taskToDto(it) }

    fun findById(id: UUID) = taskRepository.findById(id).orElse(null)

    fun existsById(id: UUID) = taskRepository.existsById(id)

    fun save(taskDto: TaskDto): Task {
        val task = if (taskDto.id != null) {
            // Mise à jour
            taskRepository.findById(taskDto.id!!).orElse(Task(title = "")).apply {
                title = taskDto.title ?: ""
                description = taskDto.description
                priority = taskDto.priority
                dueDate = taskDto.dueDate
                updatedAt = LocalDateTime.now()
                
                // Mise à jour du board si fourni
                if (taskDto.boardId != null && taskDto.boardId != board?.id) {
                    board = boardRepository.findById(taskDto.boardId!!).orElse(null)
                }
                
                // Mise à jour des utilisateurs assignés
                assignedUsers.clear()
                taskDto.assignedUsers?.let { userIds ->
                    assignedUsers.addAll(userRepository.findAllById(userIds))
                }
            }
        } else {
            // Création
            if (taskDto.boardId == null) {
                throw IllegalArgumentException("boardId is required")
            }
            val board = boardRepository.findById(taskDto.boardId!!)
                .orElseThrow { IllegalArgumentException("Board not found with id: ${taskDto.boardId}") }
            Task(
                title = taskDto.title ?: "",
                description = taskDto.description,
                priority = taskDto.priority,
                dueDate = taskDto.dueDate,
                board = board
            ).apply {
                // Assignation des utilisateurs
                taskDto.assignedUsers?.let { userIds ->
                    assignedUsers.addAll(userRepository.findAllById(userIds))
                }
            }
        }
        
        return taskRepository.save(task)
    }

    fun deleteById(id: UUID) = taskRepository.deleteById(id)

    fun assignUsers(taskId: UUID, userIds: List<UUID>): Task {
        val task = taskRepository.findById(taskId)
            .orElseThrow { RuntimeException("Task not found with id: $taskId") }
        
        val users = userRepository.findAllById(userIds)
        task.assignedUsers.clear()
        task.assignedUsers.addAll(users)
        task.updatedAt = LocalDateTime.now()
        
        return taskRepository.save(task)
    }

    fun moveTask(taskId: UUID, toBoardId: UUID): Task {
        val task = taskRepository.findById(taskId)
            .orElseThrow { RuntimeException("Task not found with id: $taskId") }
        
        val toBoard = boardRepository.findById(toBoardId)
            .orElseThrow { RuntimeException("Board not found with id: $toBoardId") }
        
        task.board = toBoard
        task.updatedAt = LocalDateTime.now()
        
        return taskRepository.save(task)
    }

    private fun taskToDto(task: Task): TaskDto {
        return TaskDto(
            id = task.id,
            title = task.title,
            description = task.description,
            priority = task.priority,
            dueDate = task.dueDate,
            boardId = task.board?.id,
            assignedUsers = task.assignedUsers.map { it.id!! },
            createdAt = task.createdAt,
            updatedAt = task.updatedAt
        )
    }
}
