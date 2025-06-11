package fr.caensup.kanban.dtos

import fr.caensup.kanban.entities.Priority
import java.time.LocalDate
import java.time.LocalDateTime
import java.util.*

data class TaskDto(
    var id: UUID? = null,
    var title: String? = null,
    var description: String? = null,
    var priority: Priority = Priority.MEDIUM,
    var dueDate: LocalDate? = null,
    var boardId: UUID? = null,
    var assignedUsers: List<UUID>? = null,
    var createdAt: LocalDateTime? = null,
    var updatedAt: LocalDateTime? = null
)
