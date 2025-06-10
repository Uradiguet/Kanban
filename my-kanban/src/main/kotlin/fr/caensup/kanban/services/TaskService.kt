package fr.caensup.kanban.services

import fr.caensup.kanban.entities.Task
import fr.caensup.kanban.entities.User
import fr.caensup.kanban.repositories.TaskRepository
import fr.caensup.kanban.repositories.UserRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class TaskService(private val taskRepository: TaskRepository, private val userRepository: UserRepository) {

    fun assignMembers(taskId: UUID, memberIds: List<UUID>): Task {
        val task = taskRepository.findById(taskId).orElseThrow { RuntimeException("Task not found") }
        val members = userRepository.findAllById(memberIds)
        task.assignedMembers.clear()
        task.assignedMembers.addAll(members)
        return taskRepository.save(task)
    }
}
