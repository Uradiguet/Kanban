package fr.caensup.kanban.dtos

import java.util.*

data class MoveTaskRequest(
    val fromBoardId: UUID,
    val toBoardId: UUID
)

data class AssignTaskRequest(
    val users: List<UUID>
)
